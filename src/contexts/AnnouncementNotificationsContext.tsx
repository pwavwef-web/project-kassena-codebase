import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../hooks/useAuth'
import { subscribeToPublishedAnnouncements } from '../lib/firestore'
import type { Announcement } from '../types'
import { AnnouncementNotificationsContext } from './AnnouncementNotificationsContextValue'

type AudioContextConstructor = new () => AudioContext

const getReadStorageKey = (uid: string) =>
  `project-kasena:read-announcements:${uid}`

const parseStoredIds = (value: string | null): Set<string> => {
  if (!value) {
    return new Set()
  }

  try {
    const parsed = JSON.parse(value)

    if (Array.isArray(parsed)) {
      return new Set(
        parsed.filter((item): item is string => typeof item === 'string'),
      )
    }
  } catch {
    return new Set()
  }

  return new Set()
}

const getAudioContextConstructor = (): AudioContextConstructor | null => {
  const audioWindow = window as Window & {
    webkitAudioContext?: AudioContextConstructor
  }

  return window.AudioContext ?? audioWindow.webkitAudioContext ?? null
}

export const AnnouncementNotificationsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { appUser } = useAuth()
  const appUserUid = appUser?.uid
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const announcementsRef = useRef<Announcement[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasLoadedSnapshotRef = useRef(false)
  const hasUserGestureRef = useRef(false)
  const knownAnnouncementIdsRef = useRef<Set<string>>(new Set())
  const pendingChimeRef = useRef(false)
  const readIdsRef = useRef<Set<string>>(new Set())

  const persistReadIds = useCallback(
    (ids: Set<string>) => {
      readIdsRef.current = ids
      setReadIds(new Set(ids))

      if (appUserUid) {
        localStorage.setItem(
          getReadStorageKey(appUserUid),
          JSON.stringify([...ids]),
        )
      }
    },
    [appUserUid],
  )

  const playChime = useCallback(async (): Promise<boolean> => {
    const AudioContextCtor = getAudioContextConstructor()

    if (!AudioContextCtor) {
      return false
    }

    const context = audioContextRef.current ?? new AudioContextCtor()
    audioContextRef.current = context

    if (context.state === 'suspended') {
      await context.resume()
    }

    if (context.state !== 'running') {
      return false
    }

    const now = context.currentTime
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58)
    gain.connect(context.destination)

    ;[880, 1175].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const startAt = now + index * 0.16
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, startAt)
      oscillator.connect(gain)
      oscillator.start(startAt)
      oscillator.stop(startAt + 0.24)
    })

    return true
  }, [])

  const ring = useCallback(() => {
    if (!hasUserGestureRef.current) {
      pendingChimeRef.current = true
      return
    }

    void playChime().then((didPlay) => {
      pendingChimeRef.current = !didPlay
    })
  }, [playChime])

  useEffect(() => {
    const unlockAudio = () => {
      hasUserGestureRef.current = true
      window.removeEventListener('keydown', unlockAudio)
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)

      if (pendingChimeRef.current) {
        pendingChimeRef.current = false
        void playChime().then((didPlay) => {
          pendingChimeRef.current = !didPlay
        })
      }
    }

    window.addEventListener('keydown', unlockAudio, { once: true })
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('touchstart', unlockAudio, { once: true })

    return () => {
      window.removeEventListener('keydown', unlockAudio)
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
    }
  }, [playChime])

  useEffect(() => {
    let active = true

    if (!appUserUid) {
      announcementsRef.current = []
      hasLoadedSnapshotRef.current = false
      knownAnnouncementIdsRef.current = new Set()
      readIdsRef.current = new Set()

      queueMicrotask(() => {
        if (active) {
          setAnnouncements([])
          setErrorMessage('')
          setIsLoading(false)
          setReadIds(new Set())
        }
      })

      return () => {
        active = false
      }
    }

    const storedReadIds = parseStoredIds(
      localStorage.getItem(getReadStorageKey(appUserUid)),
    )
    readIdsRef.current = storedReadIds
    hasLoadedSnapshotRef.current = false
    knownAnnouncementIdsRef.current = new Set()

    queueMicrotask(() => {
      if (active) {
        setReadIds(storedReadIds)
        setIsLoading(true)
        setErrorMessage('')
      }
    })

    const unsubscribe = subscribeToPublishedAnnouncements(
      (items) => {
        if (!active) {
          return
        }

        const previousKnownIds = knownAnnouncementIdsRef.current
        const unreadItems = items.filter(
          (item) => !readIdsRef.current.has(item.id),
        )
        const hasNewUnread = unreadItems.some(
          (item) => !previousKnownIds.has(item.id),
        )

        announcementsRef.current = items
        setAnnouncements(items)
        setErrorMessage('')
        setIsLoading(false)

        if (!hasLoadedSnapshotRef.current) {
          if (unreadItems.length > 0) {
            ring()
          }

          hasLoadedSnapshotRef.current = true
        } else if (hasNewUnread) {
          ring()
        }

        knownAnnouncementIdsRef.current = new Set(
          items.map((item) => item.id),
        )
      },
      (error) => {
        if (!active) {
          return
        }

        console.error('Announcement notification listener failed:', error)
        setErrorMessage('Announcement notifications could not be loaded.')
        setIsLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [appUserUid, ring])

  const markAllRead = useCallback(() => {
    if (!appUserUid) {
      return
    }

    const nextReadIds = new Set(readIdsRef.current)
    announcementsRef.current.forEach((announcement) => {
      nextReadIds.add(announcement.id)
    })
    persistReadIds(nextReadIds)
  }, [appUserUid, persistReadIds])

  const unreadCount = useMemo(
    () =>
      announcements.filter((announcement) => !readIds.has(announcement.id))
        .length,
    [announcements, readIds],
  )

  const value = useMemo(
    () => ({
      announcements,
      errorMessage,
      isLoading,
      markAllRead,
      unreadCount,
    }),
    [announcements, errorMessage, isLoading, markAllRead, unreadCount],
  )

  return (
    <AnnouncementNotificationsContext.Provider value={value}>
      {children}
    </AnnouncementNotificationsContext.Provider>
  )
}
