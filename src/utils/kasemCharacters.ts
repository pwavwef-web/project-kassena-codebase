import type {
  KasemCharacter,
  KasemInputElement,
  KasemSuggestion,
  LongPressSuggestion,
} from '../types/kasem'

export const KASEM_CRITICAL_CHARS: KasemCharacter[] = [
  { char: 'Ɛ', label: 'Ɛ', ariaLabel: 'Insert Open E (Ɛ)', group: 'critical' },
  { char: 'ɛ', label: 'ɛ', ariaLabel: 'Insert Open E (ɛ)', group: 'critical' },
  { char: 'Ɔ', label: 'Ɔ', ariaLabel: 'Insert Open O (Ɔ)', group: 'critical' },
  { char: 'ɔ', label: 'ɔ', ariaLabel: 'Insert Open O (ɔ)', group: 'critical' },
  {
    char: 'Ŋ',
    label: 'Ŋ',
    ariaLabel: 'Insert Eng Character (Ŋ)',
    group: 'critical',
  },
  {
    char: 'ŋ',
    label: 'ŋ',
    ariaLabel: 'Insert Eng Character (ŋ)',
    group: 'critical',
  },
]

export const KASEM_ACCENTED_CHARS: KasemCharacter[] = [
  { char: 'Á', label: 'Á', ariaLabel: 'Insert A acute (Á)', group: 'accented' },
  { char: 'á', label: 'á', ariaLabel: 'Insert a acute (á)', group: 'accented' },
  { char: 'É', label: 'É', ariaLabel: 'Insert E acute (É)', group: 'accented' },
  { char: 'é', label: 'é', ariaLabel: 'Insert e acute (é)', group: 'accented' },
  { char: 'Ó', label: 'Ó', ariaLabel: 'Insert O acute (Ó)', group: 'accented' },
  { char: 'ó', label: 'ó', ariaLabel: 'Insert o acute (ó)', group: 'accented' },
]

export const KASEM_FUTURE_CHARS: KasemCharacter[] = [
  { char: 'Í', label: 'Í', ariaLabel: 'Insert I acute (Í)', group: 'future' },
  { char: 'í', label: 'í', ariaLabel: 'Insert i acute (í)', group: 'future' },
  { char: 'Ú', label: 'Ú', ariaLabel: 'Insert U acute (Ú)', group: 'future' },
  { char: 'ú', label: 'ú', ariaLabel: 'Insert u acute (ú)', group: 'future' },
]

export const ALL_KASEM_CHARS: KasemCharacter[] = [
  ...KASEM_CRITICAL_CHARS,
  ...KASEM_ACCENTED_CHARS,
]

export const LONG_PRESS_MAP: Record<string, LongPressSuggestion[]> = {
  e: [
    { char: 'e', label: 'e', ariaLabel: 'Keep letter e' },
    { char: 'é', label: 'é', ariaLabel: 'Replace with e acute (é)' },
    { char: 'ɛ', label: 'ɛ', ariaLabel: 'Replace with open e (ɛ)' },
  ],
  E: [
    { char: 'E', label: 'E', ariaLabel: 'Keep letter E' },
    { char: 'É', label: 'É', ariaLabel: 'Replace with E acute (É)' },
    { char: 'Ɛ', label: 'Ɛ', ariaLabel: 'Replace with Open E (Ɛ)' },
  ],
  o: [
    { char: 'o', label: 'o', ariaLabel: 'Keep letter o' },
    { char: 'ó', label: 'ó', ariaLabel: 'Replace with o acute (ó)' },
    { char: 'ɔ', label: 'ɔ', ariaLabel: 'Replace with open o (ɔ)' },
  ],
  O: [
    { char: 'O', label: 'O', ariaLabel: 'Keep letter O' },
    { char: 'Ó', label: 'Ó', ariaLabel: 'Replace with O acute (Ó)' },
    { char: 'Ɔ', label: 'Ɔ', ariaLabel: 'Replace with Open O (Ɔ)' },
  ],
  n: [
    { char: 'n', label: 'n', ariaLabel: 'Keep letter n' },
    { char: 'ŋ', label: 'ŋ', ariaLabel: 'Replace with eng character (ŋ)' },
  ],
  N: [
    { char: 'N', label: 'N', ariaLabel: 'Keep letter N' },
    { char: 'Ŋ', label: 'Ŋ', ariaLabel: 'Replace with Eng Character (Ŋ)' },
  ],
  a: [
    { char: 'a', label: 'a', ariaLabel: 'Keep letter a' },
    { char: 'á', label: 'á', ariaLabel: 'Replace with a acute (á)' },
  ],
  A: [
    { char: 'A', label: 'A', ariaLabel: 'Keep letter A' },
    { char: 'Á', label: 'Á', ariaLabel: 'Replace with A acute (Á)' },
  ],
}

const CONTEXT_RULES: Array<{
  trigger: string
  original: string
  replacement: string
  label: string
}> = [
  {
    trigger: 'be',
    original: 'be',
    replacement: 'bɛ',
    label: 'bɛ',
  },
  {
    trigger: 'ko',
    original: 'ko',
    replacement: 'kɔ',
    label: 'kɔ',
  },
  {
    trigger: 'ng',
    original: 'ng',
    replacement: 'ŋ',
    label: 'ŋ',
  },
  {
    trigger: 'ee',
    original: 'ee',
    replacement: 'ɛ',
    label: 'ɛ',
  },
  {
    trigger: 'oo',
    original: 'oo',
    replacement: 'ɔ',
    label: 'ɔ',
  },
]

const AUTO_REPLACE_RULES: Array<{ pattern: string; replacement: string }> = [
  { pattern: 'ng', replacement: 'ŋ' },
  { pattern: 'Ng', replacement: 'Ŋ' },
  { pattern: 'NG', replacement: 'Ŋ' },
  { pattern: 'ee', replacement: 'ɛ' },
  { pattern: 'EE', replacement: 'Ɛ' },
  { pattern: 'oo', replacement: 'ɔ' },
  { pattern: 'OO', replacement: 'Ɔ' },
]

const getValueSetter = (input: KasemInputElement) => {
  const prototype =
    input instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype

  return Object.getOwnPropertyDescriptor(prototype, 'value')?.set
}

export function setInputValue(
  input: KasemInputElement,
  value: string,
  cursorPosition: number,
): void {
  const setter = getValueSetter(input)

  if (setter) {
    setter.call(input, value)
  } else {
    input.value = value
  }

  input.setSelectionRange(cursorPosition, cursorPosition)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.focus()
}

export function insertAtCursor(input: KasemInputElement, char: string): void {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const nextValue = `${input.value.slice(0, start)}${char}${input.value.slice(
    end,
  )}`

  setInputValue(input, nextValue, start + char.length)
}

export function replaceAtCursor(
  input: KasemInputElement,
  original: string,
  replacement: string,
): void {
  const cursor = input.selectionStart ?? input.value.length
  const searchEnd = Math.max(cursor, original.length)
  const lastOccurrence = input.value.lastIndexOf(original, searchEnd)

  if (lastOccurrence === -1 || lastOccurrence > cursor) {
    return
  }

  const nextValue = `${input.value.slice(0, lastOccurrence)}${replacement}${input.value.slice(
    lastOccurrence + original.length,
  )}`

  setInputValue(input, nextValue, lastOccurrence + replacement.length)
}

export function applyAutoReplaceAtCursor(
  input: KasemInputElement,
): string | null {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? start

  if (start !== end) {
    return null
  }

  const beforeCursor = input.value.slice(0, start)
  const match = AUTO_REPLACE_RULES.find(({ pattern }) =>
    beforeCursor.endsWith(pattern),
  )

  if (!match) {
    return null
  }

  const replacementStart = start - match.pattern.length
  const nextValue = `${input.value.slice(0, replacementStart)}${match.replacement}${input.value.slice(
    start,
  )}`

  setInputValue(input, nextValue, replacementStart + match.replacement.length)

  return match.replacement
}

export function getLongPressSuggestions(char: string): LongPressSuggestion[] {
  return LONG_PRESS_MAP[char] ?? []
}

export function getContextSuggestions(textBeforeCursor: string): KasemSuggestion[] {
  const lowerText = textBeforeCursor.toLowerCase()
  const suggestions = CONTEXT_RULES.filter(({ trigger }) =>
    lowerText.endsWith(trigger),
  )

  return suggestions.map((suggestion) => ({
    id: `${suggestion.original}-${suggestion.replacement}`,
    original: suggestion.original,
    replacement: suggestion.replacement,
    label: suggestion.label,
    ariaLabel: `Replace ${suggestion.original} with ${suggestion.replacement}`,
  }))
}

export function getCharacterBeforeCursor(
  input: KasemInputElement,
): string | null {
  const cursor = input.selectionStart ?? input.value.length

  if (cursor <= 0 || input.selectionEnd !== cursor) {
    return null
  }

  return input.value[cursor - 1] ?? null
}

export function getTextBeforeCursor(input: KasemInputElement): string {
  const cursor = input.selectionStart ?? input.value.length
  return input.value.slice(0, cursor)
}
