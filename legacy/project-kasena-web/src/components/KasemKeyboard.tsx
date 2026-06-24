import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from 'react'
import { getFirebaseAnalytics } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { useKasemInput } from '../hooks/useKasemInput'
import type {
  KasemAnalyticsEvent,
  KasemInsertSource,
  KasemKeyboardProps,
  KasemSuggestion,
  LongPressSuggestion,
} from '../types/kasem'
import { ALL_KASEM_CHARS } from '../utils/kasemCharacters'
import {
  getCharacterBeforeCursor,
  getTextBeforeCursor,
} from '../utils/kasemCharacters'

const LONG_PRESS_DELAY = 480

type CharacterSuggestionState = {
  original: string
  suggestions: LongPressSuggestion[]
  source: 'typed' | 'longpress'
}

const trackEvent = (
  eventName: KasemAnalyticsEvent,
  params: Record<string, string | number | boolean | undefined> = {},
) => {
  void getFirebaseAnalytics().then(async (analytics) => {
    if (analytics) {
      const { logEvent } = await import('firebase/analytics')
      logEvent(analytics, eventName, params)
    }
  })

  if (import.meta.env.DEV) {
    console.info(`[Kasem Keyboard] ${eventName}`, params)
  }
}

export const KasemKeyboard = ({
  inputRef,
  onInsert,
  showAutoReplaceToggle = true,
  className = '',
  context = 'kasem_input',
  fixedOnMobile = true,
}: KasemKeyboardProps) => {
  const { appUser } = useAuth()
  const rootRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toolbarTrackedForFocus = useRef(false)
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)
  const [keyboardInset, setKeyboardInset] = useState(0)
  const [suggestions, setSuggestions] = useState<KasemSuggestion[]>([])
  const [characterSuggestions, setCharacterSuggestions] =
    useState<CharacterSuggestionState | null>(null)

  const {
    insertCharacter,
    replaceAtCursor,
    getSuggestions,
    getLongPressSuggestions,
    autoReplaceEnabled,
    setAutoReplaceEnabled,
    applyAutoReplaceToInput,
  } = useKasemInput({
    inputRef,
    profileUserId: appUser?.uid,
    profilePreference: appUser?.kasemKeyboard?.smartTypingEnabled,
    onCharacterInsert: (char: string, source: KasemInsertSource) => {
      onInsert?.(char)
      trackEvent('kasem_character_inserted', {
        character: char,
        source,
        context,
      })
    },
    onSuggestionSelect: (original, replacement) => {
      trackEvent('kasem_suggestion_selected', {
        original,
        replacement,
        context,
      })
    },
  })

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const refreshSuggestions = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    const textBeforeCursor = getTextBeforeCursor(input)
    const previousChar = getCharacterBeforeCursor(input)
    const nextCharacterSuggestions = previousChar
      ? getLongPressSuggestions(previousChar)
      : []

    setSuggestions(getSuggestions(textBeforeCursor))
    setCharacterSuggestions(
      previousChar && nextCharacterSuggestions.length > 1
        ? {
            original: previousChar,
            suggestions: nextCharacterSuggestions,
            source: 'typed',
          }
        : null,
    )
  }, [getLongPressSuggestions, getSuggestions, inputRef])

  const hideKeyboard = useCallback(() => {
    clearLongPressTimer()
    setIsToolbarVisible(false)
    setSuggestions([])
    setCharacterSuggestions(null)
    toolbarTrackedForFocus.current = false
  }, [clearLongPressTimer])

  const handleFocus = useCallback(() => {
    setIsToolbarVisible(true)
    refreshSuggestions()

    if (!toolbarTrackedForFocus.current) {
      trackEvent('kasem_toolbar_opened', { context })
      toolbarTrackedForFocus.current = true
    }

    window.setTimeout(() => {
      inputRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    }, 80)
  }, [context, inputRef, refreshSuggestions])

  const handleBlur = useCallback(() => {
    window.setTimeout(() => {
      const activeElement = document.activeElement
      const input = inputRef.current

      if (
        activeElement !== input &&
        !rootRef.current?.contains(activeElement)
      ) {
        hideKeyboard()
      }
    }, 120)
  }, [hideKeyboard, inputRef])

  const handleInput = useCallback(() => {
    const replacement = applyAutoReplaceToInput()
    const input = inputRef.current

    if (!input) {
      return
    }

    setSuggestions(getSuggestions(getTextBeforeCursor(input)))

    if (replacement) {
      setCharacterSuggestions(null)
      return
    }

    const previousChar = getCharacterBeforeCursor(input)
    const variants = previousChar ? getLongPressSuggestions(previousChar) : []

    setCharacterSuggestions(
      previousChar && variants.length > 1
        ? {
            original: previousChar,
            suggestions: variants,
            source: 'typed',
          }
        : null,
    )
  }, [
    applyAutoReplaceToInput,
    getLongPressSuggestions,
    getSuggestions,
    inputRef,
  ])

  const handleKeyDown = useCallback(
    (event: Event) => {
      const keyboardEvent = event as KeyboardEvent

      if (
        keyboardEvent.altKey ||
        keyboardEvent.ctrlKey ||
        keyboardEvent.metaKey ||
        keyboardEvent.repeat
      ) {
        return
      }

      if (keyboardEvent.key === 'Escape') {
        setCharacterSuggestions(null)
        return
      }

      const variants = getLongPressSuggestions(keyboardEvent.key)
      if (variants.length < 2) {
        return
      }

      clearLongPressTimer()
      longPressTimer.current = setTimeout(() => {
        setCharacterSuggestions({
          original: keyboardEvent.key,
          suggestions: variants,
          source: 'longpress',
        })
        trackEvent('kasem_longpress_used', {
          character: keyboardEvent.key,
          context,
        })
      }, LONG_PRESS_DELAY)
    },
    [clearLongPressTimer, context, getLongPressSuggestions],
  )

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)
    input.addEventListener('input', handleInput)
    input.addEventListener('keydown', handleKeyDown)
    input.addEventListener('keyup', clearLongPressTimer)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
      input.removeEventListener('input', handleInput)
      input.removeEventListener('keydown', handleKeyDown)
      input.removeEventListener('keyup', clearLongPressTimer)
    }
  }, [
    clearLongPressTimer,
    handleBlur,
    handleFocus,
    handleInput,
    handleKeyDown,
    inputRef,
  ])

  useEffect(() => clearLongPressTimer, [clearLongPressTimer])

  useEffect(() => {
    if (!isToolbarVisible || !fixedOnMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset inset when the mobile toolbar is hidden.
      setKeyboardInset(0)
      return () => undefined
    }

    const updateInset = () => {
      const viewport = window.visualViewport
      if (!viewport) {
        setKeyboardInset(0)
        return
      }

      setKeyboardInset(
        Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop),
      )
    }

    updateInset()
    window.visualViewport?.addEventListener('resize', updateInset)
    window.visualViewport?.addEventListener('scroll', updateInset)
    window.addEventListener('resize', updateInset)

    return () => {
      window.visualViewport?.removeEventListener('resize', updateInset)
      window.visualViewport?.removeEventListener('scroll', updateInset)
      window.removeEventListener('resize', updateInset)
    }
  }, [fixedOnMobile, isToolbarVisible])

  const handleRootBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !event.currentTarget.contains(event.relatedTarget as Node | null) &&
      document.activeElement !== inputRef.current
    ) {
      hideKeyboard()
    }
  }

  const handleToolbarInsert = (char: string) => {
    insertCharacter(char, 'toolbar')
    setCharacterSuggestions(null)
  }

  const handleSuggestionTap = (suggestion: KasemSuggestion) => {
    replaceAtCursor(suggestion.original, suggestion.replacement)
    setSuggestions((current) =>
      current.filter((item) => item.id !== suggestion.id),
    )
    setCharacterSuggestions(null)
  }

  const handleCharacterSuggestionTap = (suggestion: LongPressSuggestion) => {
    if (!characterSuggestions) return

    replaceAtCursor(characterSuggestions.original, suggestion.char)
    setCharacterSuggestions(null)
  }

  const handleToggleAutoReplace = () => {
    const nextValue = !autoReplaceEnabled
    setAutoReplaceEnabled(nextValue)
    trackEvent('kasem_auto_replace_toggled', {
      enabled: nextValue,
      context,
    })
    inputRef.current?.focus()
  }

  if (!isToolbarVisible) {
    return null
  }

  const toolbarShellClass = fixedOnMobile
    ? 'fixed left-2 right-2 z-50 mx-auto max-w-3xl sm:static sm:inset-auto sm:z-auto sm:max-w-none'
    : 'relative'

  return (
    <div
      ref={rootRef}
      className={`kasem-keyboard ${className}`}
      onBlur={handleRootBlur}
    >
      {suggestions.length > 0 && (
        <div
          className="mt-2 flex flex-wrap gap-2 rounded-lg border border-kassena-plaster bg-white px-2 py-2 shadow-sm"
          role="listbox"
          aria-label="Kasem spelling suggestions"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSuggestionTap(suggestion)}
              className="min-h-11 rounded-lg border border-kassena-plaster bg-kassena-plaster px-3 py-2 text-sm font-bold text-kassena-indigo transition hover:border-kassena-terracotta hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-kente"
              role="option"
              aria-label={suggestion.ariaLabel}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      {fixedOnMobile && <div className="h-24 sm:hidden" aria-hidden="true" />}

      <div
        className={toolbarShellClass}
        style={
          fixedOnMobile
            ? { bottom: `${keyboardInset + 8}px` }
            : undefined
        }
      >
        <div className="overflow-hidden rounded-lg border border-kassena-plaster bg-white shadow-[0_16px_44px_rgba(30,54,93,0.18)] ring-1 ring-black/5 sm:shadow-sm">
          {characterSuggestions && (
            <div
              className="flex items-center gap-1 overflow-x-auto border-b border-kassena-plaster bg-kassena-plaster px-2 py-2"
              role="listbox"
              aria-label={`Character suggestions for ${characterSuggestions.original}`}
            >
              {characterSuggestions.suggestions.map((suggestion) => (
                <button
                  key={suggestion.char}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleCharacterSuggestionTap(suggestion)}
                  className="flex h-11 min-w-[44px] items-center justify-center rounded-lg border border-transparent bg-white px-3 text-lg font-black text-kassena-indigo transition hover:border-kassena-terracotta hover:text-kassena-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-kente"
                  role="option"
                  aria-label={suggestion.ariaLabel}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-kassena-plaster/80 p-2">
            <div
              className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-1"
              role="toolbar"
              aria-label="Kasem special characters"
            >
              {ALL_KASEM_CHARS.map((kasemChar) => (
                <button
                  key={kasemChar.char}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleToolbarInsert(kasemChar.char)}
                  className="flex h-11 min-w-[44px] items-center justify-center rounded-lg border border-white/80 bg-white text-lg font-black text-kassena-indigo shadow-sm transition hover:border-kassena-terracotta hover:text-kassena-terracotta active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-kente"
                  aria-label={kasemChar.ariaLabel}
                  title={kasemChar.ariaLabel}
                >
                  {kasemChar.char}
                </button>
              ))}
            </div>

            {showAutoReplaceToggle && (
              <div className="flex shrink-0 items-center gap-2 border-l border-kassena-kente/35 pl-2">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleToggleAutoReplace}
                  className={`relative h-7 w-12 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-kente ${
                    autoReplaceEnabled
                      ? 'bg-kassena-terracotta'
                      : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={autoReplaceEnabled}
                  aria-label="Enable Smart Kasem Typing"
                  title="Enable Smart Kasem Typing"
                >
                  <span
                    className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      autoReplaceEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <span className="hidden text-xs font-black text-kassena-indigo sm:inline">
                  Smart
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
