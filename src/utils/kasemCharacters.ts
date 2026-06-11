import type {
  KasemCharacter,
  KasemSuggestion,
  LongPressSuggestion,
} from '../types/kasem'

export const KASEM_CRITICAL_CHARS: KasemCharacter[] = [
  { char: '\u0190', label: '\u0190', ariaLabel: 'Insert Open E (\u0190)' },
  { char: '\u025B', label: '\u025B', ariaLabel: 'Insert Open E (\u025B)' },
  { char: '\u0186', label: '\u0186', ariaLabel: 'Insert Open O (\u0186)' },
  { char: '\u0254', label: '\u0254', ariaLabel: 'Insert Open O (\u0254)' },
  { char: '\u014A', label: '\u014A', ariaLabel: 'Insert Eng (\u014A)' },
  { char: '\u014B', label: '\u014B', ariaLabel: 'Insert Eng (\u014B)' },
]

export const KASEM_ACCENTED_CHARS: KasemCharacter[] = [
  { char: '\u00C1', label: '\u00C1', ariaLabel: 'Insert A acute (\u00C1)' },
  { char: '\u00E1', label: '\u00E1', ariaLabel: 'Insert a acute (\u00E1)' },
  { char: '\u00C9', label: '\u00C9', ariaLabel: 'Insert E acute (\u00C9)' },
  { char: '\u00E9', label: '\u00E9', ariaLabel: 'Insert e acute (\u00E9)' },
  { char: '\u00D3', label: '\u00D3', ariaLabel: 'Insert O acute (\u00D3)' },
  { char: '\u00F3', label: '\u00F3', ariaLabel: 'Insert o acute (\u00F3)' },
]

export const KASEM_FUTURE_CHARS: KasemCharacter[] = [
  { char: '\u00CD', label: '\u00CD', ariaLabel: 'Insert I acute (\u00CD)' },
  { char: '\u00ED', label: '\u00ED', ariaLabel: 'Insert i acute (\u00ED)' },
  { char: '\u00DA', label: '\u00DA', ariaLabel: 'Insert U acute (\u00DA)' },
  { char: '\u00FA', label: '\u00FA', ariaLabel: 'Insert u acute (\u00FA)' },
]

export const ALL_KASEM_CHARS: KasemCharacter[] = [
  ...KASEM_CRITICAL_CHARS,
  ...KASEM_ACCENTED_CHARS,
]

export const LONG_PRESS_MAP: Record<string, LongPressSuggestion[]> = {
  e: [
    { char: 'e', label: 'e', ariaLabel: 'Letter e' },
    { char: '\u00E9', label: '\u00E9', ariaLabel: 'e acute' },
    { char: '\u025B', label: '\u025B', ariaLabel: 'open e' },
  ],
  E: [
    { char: 'E', label: 'E', ariaLabel: 'Letter E' },
    { char: '\u00C9', label: '\u00C9', ariaLabel: 'E acute' },
    { char: '\u0190', label: '\u0190', ariaLabel: 'Open E' },
  ],
  o: [
    { char: 'o', label: 'o', ariaLabel: 'Letter o' },
    { char: '\u00F3', label: '\u00F3', ariaLabel: 'o acute' },
    { char: '\u0254', label: '\u0254', ariaLabel: 'open o' },
  ],
  O: [
    { char: 'O', label: 'O', ariaLabel: 'Letter O' },
    { char: '\u00D3', label: '\u00D3', ariaLabel: 'O acute' },
    { char: '\u0186', label: '\u0186', ariaLabel: 'Open O' },
  ],
  n: [
    { char: 'n', label: 'n', ariaLabel: 'Letter n' },
    { char: '\u014B', label: '\u014B', ariaLabel: 'eng' },
  ],
  N: [
    { char: 'N', label: 'N', ariaLabel: 'Letter N' },
    { char: '\u014A', label: '\u014A', ariaLabel: 'Eng' },
  ],
  a: [
    { char: 'a', label: 'a', ariaLabel: 'Letter a' },
    { char: '\u00E1', label: '\u00E1', ariaLabel: 'a acute' },
  ],
  A: [
    { char: 'A', label: 'A', ariaLabel: 'Letter A' },
    { char: '\u00C1', label: '\u00C1', ariaLabel: 'A acute' },
  ],
}

export const CONTEXT_SUGGESTIONS: Array<{
  pattern: RegExp
  suggestions: KasemSuggestion[]
}> = [
  {
    pattern: /\b\w*be\b/i,
    suggestions: [
      {
        original: 'be',
        replacement: 'b\u025B',
        label: 'b\u025B (be with open e)',
      },
    ],
  },
  {
    pattern: /\b\w*ko\b/i,
    suggestions: [
      {
        original: 'ko',
        replacement: 'k\u0254',
        label: 'k\u0254 (ko with open o)',
      },
    ],
  },
  {
    pattern: /\b\w*ng\b/i,
    suggestions: [
      { original: 'ng', replacement: '\u014Bg', label: '\u014Bg (eng sound)' },
    ],
  },
  {
    pattern: /\b\w*ee\b/i,
    suggestions: [
      {
        original: 'ee',
        replacement: '\u025B\u025B',
        label: '\u025B\u025B (double open e)',
      },
    ],
  },
  {
    pattern: /\b\w*oo\b/i,
    suggestions: [
      {
        original: 'oo',
        replacement: '\u0254\u0254',
        label: '\u0254\u0254 (double open o)',
      },
    ],
  },
  {
    pattern: /\b\w*na\b/i,
    suggestions: [
      {
        original: 'na',
        replacement: 'n\u025B',
        label: 'n\u025B (na with open e)',
      },
    ],
  },
  {
    pattern: /\b\w*ma\b/i,
    suggestions: [
      {
        original: 'ma',
        replacement: 'm\u0254',
        label: 'm\u0254 (ma with open o)',
      },
    ],
  },
]

export const AUTO_REPLACE_MAP: Record<string, string> = {
  ng: '\u014Bg',
  NG: '\u014Ag',
  ee: '\u025B',
  EE: '\u0190',
  oo: '\u0254',
  OO: '\u0186',
}

export function applyAutoReplace(text: string): string {
  let result = text
  for (const [pattern, replacement] of Object.entries(AUTO_REPLACE_MAP)) {
    const regex = new RegExp(pattern, 'g')
    result = result.replace(regex, replacement)
  }
  return result
}

export function getLongPressSuggestions(char: string): LongPressSuggestion[] {
  return LONG_PRESS_MAP[char] || []
}

export function getContextSuggestions(text: string): KasemSuggestion[] {
  const suggestions: KasemSuggestion[] = []
  for (const { pattern, suggestions: sugs } of CONTEXT_SUGGESTIONS) {
    if (pattern.test(text)) {
      suggestions.push(...sugs)
    }
  }
  const seen = new Set<string>()
  return suggestions.filter((s) => {
    if (seen.has(s.replacement)) return false
    seen.add(s.replacement)
    return true
  })
}

export function insertAtCursor(
  input: HTMLInputElement | HTMLTextAreaElement,
  char: string,
): void {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const before = input.value.slice(0, start)
  const after = input.value.slice(end)
  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
      ?.set ||
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value',
    )?.set

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, before + char + after)
  } else {
    input.value = before + char + after
  }

  const newCursorPos = start + char.length
  input.setSelectionRange(newCursorPos, newCursorPos)

  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.focus()
}

export function replaceAtCursor(
  input: HTMLInputElement | HTMLTextAreaElement,
  original: string,
  replacement: string,
): void {
  const value = input.value
  const cursorPos = input.selectionStart ?? value.length
  const lastOccurrence = value.lastIndexOf(original, cursorPos)
  if (lastOccurrence === -1) return

  const before = value.slice(0, lastOccurrence)
  const after = value.slice(lastOccurrence + original.length)
  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
      ?.set ||
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value',
    )?.set

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, before + replacement + after)
  } else {
    input.value = before + replacement + after
  }

  const newCursorPos = lastOccurrence + replacement.length
  input.setSelectionRange(newCursorPos, newCursorPos)

  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.focus()
}
