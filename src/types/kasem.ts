export interface KasemCharacter {
  char: string
  label: string
  ariaLabel: string
}

export interface KasemSuggestion {
  original: string
  replacement: string
  label: string
}

export interface LongPressSuggestion {
  char: string
  label: string
  ariaLabel: string
}

export interface KasemKeyboardProps {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
  onInsert?: (character: string) => void
  showAutoReplaceToggle?: boolean
  className?: string
}

export interface UseKasemInputOptions {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
  autoReplaceEnabled?: boolean
  onCharacterInsert?: (character: string) => void
  onSuggestionSelect?: (original: string, replacement: string) => void
}

export interface UseKasemInputReturn {
  insertCharacter: (char: string) => void
  replaceAtCursor: (original: string, replacement: string) => void
  getSuggestions: (text: string) => KasemSuggestion[]
  getLongPressSuggestions: (char: string) => LongPressSuggestion[]
  autoReplaceEnabled: boolean
  setAutoReplaceEnabled: (enabled: boolean) => void
  applyAutoReplace: (text: string) => string
}

export type KasemAnalyticsEvent =
  | 'kasem_character_inserted'
  | 'kasem_toolbar_opened'
  | 'kasem_suggestion_selected'
  | 'kasem_longpress_used'
  | 'kasem_auto_replace_toggled'
