import { useState, useCallback, useEffect, useRef } from 'react'
import type {
  KasemKeyboardProps,
  KasemSuggestion,
  LongPressSuggestion,
} from '../types/kasem'
import {
  ALL_KASEM_CHARS,
  getLongPressSuggestions,
  getContextSuggestions,
} from '../utils/kasemCharacters'
import { useKasemInput } from '../hooks/useKasemInput'

const LONG_PRESS_DELAY = 500

const trackEvent = (event: string, params?: Record<string, unknown>) => {
  if (import.meta.env.DEV) {
    console.log(`[Kasem Analytics] ${event}`, params)
  }
}

export const KasemKeyboard = ({
  inputRef,
  onInsert,
  showAutoReplaceToggle = true,
  className = '',
}: KasemKeyboardProps) => {
  const [suggestions, setSuggestions] = useState<KasemSuggestion[]>([])
  const [longPressPopup, setLongPressPopup] = useState<{
    char: string
    suggestions: LongPressSuggestion[]
    x: number
    y: number
  } | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const {
    insertCharacter,
    replaceAtCursor: replaceChar,
    autoReplaceEnabled,
    setAutoReplaceEnabled,
    applyAutoReplace,
  } = useKasemInput({
    inputRef,
    onCharacterInsert: (char) => {
      onInsert?.(char)
      trackEvent('kasem_character_inserted', { character: char })
    },
    onSuggestionSelect: (original, replacement) => {
      trackEvent('kasem_suggestion_selected', { original, replacement })
    },
  })

  const updateSuggestions = useCallback(() => {
    const input = inputRef.current
    if (!input) return
    const text = input.value
    const newSuggestions = getContextSuggestions(text)
    setSuggestions(newSuggestions)
  }, [inputRef])

  const handleInput = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    if (autoReplaceEnabled) {
      const original = input.value
      const replaced = applyAutoReplace(original)
      if (original !== replaced) {
        const nativeSetter =
          Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
          )?.set ||
          Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value',
          )?.set
        if (nativeSetter) {
          nativeSetter.call(input, replaced)
        } else {
          input.value = replaced
        }
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    updateSuggestions()
  }, [inputRef, autoReplaceEnabled, applyAutoReplace, updateSuggestions])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const onFocus = () => {
      setIsToolbarVisible(true)
      trackEvent('kasem_toolbar_opened')
      updateSuggestions()
    }

    const onBlur = (e: Event) => {
      const focusEvent = e as FocusEvent
      if (popupRef.current?.contains(focusEvent.relatedTarget as Node)) return
      setTimeout(() => {
        setLongPressPopup(null)
      }, 150)
    }

    input.addEventListener('focus', onFocus)
    input.addEventListener('blur', onBlur)
    input.addEventListener('input', handleInput)

    return () => {
      input.removeEventListener('focus', onFocus)
      input.removeEventListener('blur', onBlur)
      input.removeEventListener('input', handleInput)
    }
  }, [inputRef, handleInput, updateSuggestions])

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current)
    }
  }, [])

  const handleCharTap = useCallback(
    (char: string) => {
      insertCharacter(char)
      setLongPressPopup(null)
    },
    [insertCharacter],
  )

  const handleCharPointerDown = useCallback(
    (char: string, e: React.PointerEvent) => {
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()

      longPressTimer.current = setTimeout(() => {
        const suggestionsForChar = getLongPressSuggestions(char)
        if (suggestionsForChar.length > 1) {
          setLongPressPopup({
            char,
            suggestions: suggestionsForChar,
            x: rect.left + rect.width / 2,
            y: rect.top,
          })
          trackEvent('kasem_longpress_used', { character: char })
        }
      }, LONG_PRESS_DELAY)
    },
    [],
  )

  const handleCharPointerUp = useCallback(
    (char: string) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      if (!longPressPopup) {
        handleCharTap(char)
      }
    },
    [longPressPopup, handleCharTap],
  )

  const handleSuggestionTap = useCallback(
    (suggestion: KasemSuggestion) => {
      replaceChar(suggestion.original, suggestion.replacement)
      setSuggestions((prev) =>
        prev.filter((s) => s.replacement !== suggestion.replacement),
      )
    },
    [replaceChar],
  )

  const handleLongPressSelect = useCallback(
    (char: string) => {
      handleCharTap(char)
      setLongPressPopup(null)
    },
    [handleCharTap],
  )

  const handleToggleAutoReplace = useCallback(() => {
    setAutoReplaceEnabled(!autoReplaceEnabled)
    trackEvent('kasem_auto_replace_toggled', { enabled: !autoReplaceEnabled })
  }, [autoReplaceEnabled, setAutoReplaceEnabled])

  if (!isToolbarVisible) return null

  return (
    <div
      className={`relative ${className}`}
      role="group"
      aria-label="Kasem character keyboard"
    >
      <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-kassena-cream bg-gradient-to-r from-kassena-cream/60 to-white px-3 py-2">
        <div
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide"
          role="toolbar"
          aria-label="Kasem special characters"
        >
          {ALL_KASEM_CHARS.map((kasemChar) => (
            <button
              key={kasemChar.char}
              type="button"
              onPointerDown={(e) => handleCharPointerDown(kasemChar.char, e)}
              onPointerUp={() => handleCharPointerUp(kasemChar.char)}
              onPointerLeave={() => {
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current)
                  longPressTimer.current = null
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
              className="flex h-11 min-w-[44px] items-center justify-center rounded-xl border border-kassena-cream bg-white text-lg font-semibold text-kassena-dark shadow-sm transition-all active:scale-95 active:bg-kassena-green active:text-white hover:border-kassena-green hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-green"
              aria-label={kasemChar.ariaLabel}
              title={kasemChar.label}
            >
              {kasemChar.char}
            </button>
          ))}
        </div>

        {showAutoReplaceToggle && (
          <div className="ml-auto flex items-center gap-2 border-l border-kassena-cream pl-3">
            <button
              type="button"
              onClick={handleToggleAutoReplace}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                autoReplaceEnabled ? 'bg-kassena-green' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={autoReplaceEnabled}
              aria-label="Toggle Smart Kasem Typing"
              title="Smart Kasem Typing auto-replaces ng, ee, oo"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  autoReplaceEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
            <span className="hidden whitespace-nowrap text-xs font-medium text-slate-500 sm:inline">
              Smart
            </span>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div
          className="flex flex-wrap gap-2 rounded-b-2xl border border-t-0 border-kassena-cream bg-white px-3 py-2"
          role="listbox"
          aria-label="Kasem character suggestions"
        >
          <span className="mr-1 self-center text-xs font-medium text-slate-400">
            Try:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.replacement}
              type="button"
              onClick={() => handleSuggestionTap(suggestion)}
              className="rounded-full border border-kassena-cream bg-kassena-bg px-3 py-1 text-sm font-medium text-kassena-green transition-all hover:border-kassena-green hover:bg-kassena-green hover:text-white active:scale-95"
              role="option"
              aria-label={suggestion.label}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      {longPressPopup && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setLongPressPopup(null)}
            onKeyDown={(e) => e.key === 'Escape' && setLongPressPopup(null)}
          />
          <div
            ref={popupRef}
            className="fixed z-50 flex gap-1 rounded-2xl border border-kassena-cream bg-white p-2 shadow-xl animate-scale-in"
            style={{
              left: `${longPressPopup.x}px`,
              top: `${longPressPopup.y - 56}px`,
              transform: 'translateX(-50%)',
            }}
            role="listbox"
            aria-label={`Replace ${longPressPopup.char}`}
          >
            {longPressPopup.suggestions.map((suggestion) => (
              <button
                key={suggestion.char}
                type="button"
                onClick={() => handleLongPressSelect(suggestion.char)}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold transition-all hover:bg-kassena-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kassena-green active:scale-95"
                role="option"
                aria-label={suggestion.ariaLabel}
              >
                {suggestion.char}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
