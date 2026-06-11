import { useState, useCallback, useMemo } from 'react'
import type {
  UseKasemInputOptions,
  UseKasemInputReturn,
  KasemSuggestion,
} from '../types/kasem'
import {
  insertAtCursor,
  replaceAtCursor,
  getContextSuggestions,
  getLongPressSuggestions,
  applyAutoReplace as applyAutoReplaceUtil,
} from '../utils/kasemCharacters'
import type { LongPressSuggestion } from '../types/kasem'

const AUTO_REPLACE_KEY = 'kasem_auto_replace'

function loadAutoReplacePreference(): boolean {
  try {
    const stored = localStorage.getItem(AUTO_REPLACE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

function saveAutoReplacePreference(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_REPLACE_KEY, String(enabled))
  } catch {
    // localStorage unavailable
  }
}

export const useKasemInput = ({
  inputRef,
  autoReplaceEnabled: initialAutoReplace,
  onCharacterInsert,
  onSuggestionSelect,
}: UseKasemInputOptions): UseKasemInputReturn => {
  const [autoReplaceEnabled, setAutoReplaceEnabledState] = useState<boolean>(
    () => initialAutoReplace ?? loadAutoReplacePreference(),
  )

  const setAutoReplaceEnabled = useCallback((enabled: boolean) => {
    setAutoReplaceEnabledState(enabled)
    saveAutoReplacePreference(enabled)
  }, [])

  const insertCharacter = useCallback(
    (char: string) => {
      const input = inputRef.current
      if (!input) return
      insertAtCursor(input, char)
      onCharacterInsert?.(char)
    },
    [inputRef, onCharacterInsert],
  )

  const replaceCurrentChar = useCallback(
    (original: string, replacement: string) => {
      const input = inputRef.current
      if (!input) return
      replaceAtCursor(input, original, replacement)
      onSuggestionSelect?.(original, replacement)
    },
    [inputRef, onSuggestionSelect],
  )

  const getSuggestions = useCallback((text: string): KasemSuggestion[] => {
    return getContextSuggestions(text)
  }, [])

  const getLongPressSuggestionsForChar = useCallback(
    (char: string): LongPressSuggestion[] => {
      return getLongPressSuggestions(char)
    },
    [],
  )

  const applyAutoReplace = useCallback(
    (text: string): string => {
      if (!autoReplaceEnabled) return text
      return applyAutoReplaceUtil(text)
    },
    [autoReplaceEnabled],
  )

  return useMemo(
    () => ({
      insertCharacter,
      replaceAtCursor: replaceCurrentChar,
      getSuggestions,
      getLongPressSuggestions: getLongPressSuggestionsForChar,
      autoReplaceEnabled,
      setAutoReplaceEnabled,
      applyAutoReplace,
    }),
    [
      insertCharacter,
      replaceCurrentChar,
      getSuggestions,
      getLongPressSuggestionsForChar,
      autoReplaceEnabled,
      setAutoReplaceEnabled,
      applyAutoReplace,
    ],
  )
}
