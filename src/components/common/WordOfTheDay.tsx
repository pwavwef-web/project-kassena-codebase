import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { EmptyState } from './EmptyState'
import { AudioPlayer } from './AudioPlayer'
import {
  recordAchievementShare,
  recordWordOfTheDayView,
} from '../../lib/achievements'

interface WordOfTheDayData {
  wordKey?: string
  kasemWord: string
  pronunciation: string
  englishMeaning: string
  exampleSentence: string
  culturalNote?: string
  audioUrl?: string
}

interface WordOfTheDayProps {
  data: WordOfTheDayData | null
  isLoading?: boolean
  viewerId?: string | null
}

export const WordOfTheDay = ({
  data,
  isLoading = false,
  viewerId,
}: WordOfTheDayProps) => {
  const [copied, setCopied] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data) {
      return
    }

    recordWordOfTheDayView(
      viewerId,
      data.wordKey ?? `${data.kasemWord}-${data.englishMeaning}`,
    )
  }, [data, viewerId])

  const handleShare = async () => {
    if (!data) return

    const shareText = `${data.kasemWord} (${data.pronunciation}) - ${data.englishMeaning}\n"${data.exampleSentence}"\n\nLearn more on TribeStudio!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Word of the Day: ${data.kasemWord}`,
          text: shareText,
        })
        recordAchievementShare(viewerId)
      } catch {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      recordAchievementShare(viewerId)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareImage = async () => {
    if (!cardRef.current) return
    setIsGeneratingImage(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `${data?.kasemWord ?? 'word'}-tribestudio.png`, {
          type: 'image/png',
        })

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: `Word of the Day: ${data?.kasemWord}`,
              text: `${data?.kasemWord} - ${data?.englishMeaning} | Learn Kasem on TribeStudio!`,
              files: [file],
            })
            recordAchievementShare(viewerId)
          } catch {
            downloadImage(canvas)
            recordAchievementShare(viewerId)
          }
        } else {
          downloadImage(canvas)
          recordAchievementShare(viewerId)
        }
      }, 'image/png')
    } catch {
      console.error('Failed to generate share image')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const downloadImage = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a')
    link.download = `${data?.kasemWord ?? 'word'}-tribestudio.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 animate-pulse">
        <div className="h-4 w-24 rounded bg-slate-200 mb-4" />
        <div className="h-8 w-32 rounded bg-slate-200 mb-2" />
        <div className="h-4 w-20 rounded bg-slate-200 mb-4" />
        <div className="h-6 w-48 rounded bg-slate-200" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <EmptyState message="Today's word is loading. Check back soon!" />
      </div>
    )
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-kassena-green via-kassena-dark to-[#104022] p-6 text-white shadow-lg transition-all hover:shadow-xl sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-kassena-orange/20 blur-2xl pointer-events-none" />

      <div className="relative z-10" ref={cardRef}>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-kassena-gold/20 px-3 py-1 text-xs font-semibold text-kassena-gold">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Word of the Day
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShareImage}
              disabled={isGeneratingImage}
              className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-95 disabled:opacity-60"
              aria-label="Share as image"
            >
              {isGeneratingImage ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-95"
              aria-label="Share word of the day"
            >
              {copied ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-kassena-cream">
          {data.kasemWord}
        </h3>
        <p className="mt-1 text-sm font-medium text-kassena-cream/70">
          {data.pronunciation}
        </p>

        <p className="mt-4 text-lg font-semibold text-kassena-gold">
          {data.englishMeaning}
        </p>

        <blockquote className="mt-3 border-l-2 border-kassena-gold/30 pl-3 text-sm text-white/80 italic">
          &ldquo;{data.exampleSentence}&rdquo;
        </blockquote>

        {data.culturalNote && (
          <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/70">
            <span className="font-semibold text-kassena-gold">Cultural Note: </span>
            {data.culturalNote}
          </div>
        )}

        <div className="mt-3">
          {data.audioUrl ? (
            <AudioPlayer src={data.audioUrl} label="Listen" compact />
          ) : (
            <p className="text-xs text-white/40">Audio pronunciation coming soon</p>
          )}
        </div>
      </div>
    </article>
  )
}
