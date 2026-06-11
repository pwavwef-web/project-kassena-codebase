import type { RefObject } from 'react'

export type KasemInputElement = HTMLInputElement | HTMLTextAreaElement

export type KasemCharacterGroup = 'critical' | 'accented' | 'future'

export interface KasemCharacter {
  char: string
  label: string
  ariaLabel: string
  group: KasemCharacterGroup
}

export interface KasemSuggestion {
  id: string
  original: string
  replacement: string
  label: string
  ariaLabel: string
}

export interface LongPressSuggestion {
  char: string
  label: string
  ariaLabel: string
}

export interface KasemKeyboardPreference {
  smartTypingEnabled: boolean
  updatedAt?: unknown
}

export interface KasemKeyboardProps {
  inputRef: RefObject<KasemInputElement | null>
  onInsert?: (character: string) => void
  showAutoReplaceToggle?: boolean
  className?: string
  context?: string
  fixedOnMobile?: boolean
}

export interface UseKasemInputOptions {
  inputRef: RefObject<KasemInputElement | null>
  autoReplaceEnabled?: boolean
  profileUserId?: string | null
  profilePreference?: boolean | null
  onCharacterInsert?: (character: string, source: KasemInsertSource) => void
  onSuggestionSelect?: (original: string, replacement: string) => void
}

export interface UseKasemInputReturn {
  insertCharacter: (char: string, source?: KasemInsertSource) => void
  replaceAtCursor: (original: string, replacement: string) => void
  getSuggestions: (text: string) => KasemSuggestion[]
  getLongPressSuggestions: (char: string) => LongPressSuggestion[]
  autoReplaceEnabled: boolean
  setAutoReplaceEnabled: (enabled: boolean) => void
  applyAutoReplaceToInput: () => string | null
}

export type KasemInsertSource = 'toolbar' | 'longpress' | 'auto_replace'

export type KasemAnalyticsEvent =
  | 'kasem_character_inserted'
  | 'kasem_toolbar_opened'
  | 'kasem_suggestion_selected'
  | 'kasem_longpress_used'
  | 'kasem_auto_replace_toggled'
