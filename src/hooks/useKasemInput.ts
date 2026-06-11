import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { db } from '../config/firebase'
import type {
  KasemInsertSource,
  KasemSuggestion,
  LongPressSuggestion,
  UseKasemInputOptions,
  UseKasemInputReturn,
} from '../types/kasem'
import {
  applyAutoReplaceAtCursor,
  getContextSuggestions,
  getLongPressSuggestions,
  insertAtCursor,
  replaceAtCursor,
} from '../utils/kasemCharacters'

const AUTO_REPLACE_KEY = 'kasem_auto_replace'

function loadAutoReplacePreference(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.localStorage.getItem(AUTO_REPLACE_KEY) === 'true'
  } catch {
    return false
  }
}

function saveLocalAutoReplacePreference(enabled: boolean): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(AUTO_REPLACE_KEY, String(enabled))
  } catch {
    // Some locked-down browsers disallow localStorage. The keyboard still works.
  }
}

async function saveProfileAutoReplacePreference(
  userId: string | null | undefined,
  enabled: boolean,
): Promise<void> {
  if (!userId) {
    return
  }

  await setDoc(
    doc(db, 'users', userId),
    {
      kasemKeyboard: {
        smartTypingEnabled: enabled,
        updatedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const useKasemInput = ({
  inputRef,
  autoReplaceEnabled: initialAutoReplace,
  profileUserId,
  profilePreference,
  onCharacterInsert,
  onSuggestionSelect,
}: UseKasemInputOptions): UseKasemInputReturn => {
  const [autoReplaceEnabled, setAutoReplaceEnabledState] = useState<boolean>(
    () => initialAutoReplace ?? profilePreference ?? loadAutoReplacePreference(),
  )

  useEffect(() => {
    if (typeof profilePreference === 'boolean') {
      setAutoReplaceEnabledState(profilePreference)
      saveLocalAutoReplacePreference(profilePreference)
    }
  }, [profilePreference])

  const setAutoReplaceEnabled = useCallback(
    (enabled: boolean) => {
      setAutoReplaceEnabledState(enabled)
      saveLocalAutoReplacePreference(enabled)
      void saveProfileAutoReplacePreference(profileUserId, enabled).catch(() => {
        // Preference syncing is best-effort; keep the local setting responsive.
      })
    },
    [profileUserId],
  )

  const insertCharacter = useCallback(
    (char: string, source: KasemInsertSource = 'toolbar') => {
      const input = inputRef.current
      if (!input) return

      insertAtCursor(input, char)
      onCharacterInsert?.(char, source)
    },
    [inputRef, onCharacterInsert],
  )

  const replaceCurrentText = useCallback(
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

  const applyAutoReplaceToInput = useCallback(() => {
    const input = inputRef.current

    if (!input || !autoReplaceEnabled) {
      return null
    }

    const replacement = applyAutoReplaceAtCursor(input)
    if (replacement) {
      onCharacterInsert?.(replacement, 'auto_replace')
    }

    return replacement
  }, [autoReplaceEnabled, inputRef, onCharacterInsert])

  return useMemo(
    () => ({
      insertCharacter,
      replaceAtCursor: replaceCurrentText,
      getSuggestions,
      getLongPressSuggestions: getLongPressSuggestionsForChar,
      autoReplaceEnabled,
      setAutoReplaceEnabled,
      applyAutoReplaceToInput,
    }),
    [
      insertCharacter,
      replaceCurrentText,
      getSuggestions,
      getLongPressSuggestionsForChar,
      autoReplaceEnabled,
      setAutoReplaceEnabled,
      applyAutoReplaceToInput,
    ],
  )
}
