import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from './constants'

export const required = (value: string, label: string): string => {
  if (!value.trim()) {
    return `${label} is required.`
  }
  return ''
}

export const validateContribution = (input: {
  englishText: string
  kasemText: string
  dialect: string
  category: string
}): string[] => {
  const errors = [
    required(input.englishText, 'English text'),
    required(input.kasemText, 'Kasem text'),
    required(input.dialect, 'Dialect'),
    required(input.category, 'Category'),
  ].filter(Boolean)

  return errors
}

export const validateFile = (file: File): string => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File must be smaller than ${Math.floor(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB.`
  }

  if (
    !ALLOWED_FILE_TYPES.includes(
      file.type as (typeof ALLOWED_FILE_TYPES)[number],
    )
  ) {
    return 'This file type is not allowed.'
  }

  return ''
}
