export const APP_NAME = 'TribeStudio'
export const TAGLINE = 'Preserving Our Language. Empowering Our People.'

export const DIALECT_OPTIONS = [
  'Navrongo',
  'Paga',
  'Chiana',
  'Chuchuliga',
  'Sandema',
  'Other',
  'Not sure',
] as const

export const PART_OF_SPEECH_OPTIONS = [
  'Noun',
  'Verb',
  'Adjective',
  'Adverb',
  'Phrase',
  'Proverb',
  'Greeting',
  'Other',
] as const

export const CATEGORY_OPTIONS = [
  'General vocabulary',
  'Education',
  'Health',
  'Agriculture',
  'Culture',
  'Proverb',
  'Greeting',
  'Storytelling',
  'Other',
] as const

export const UPLOAD_CATEGORIES = [
  'Corpus Zero',
  'Consent Forms',
  'Dictionary Scans',
  'Audio',
  'Video',
  'Images',
  'Poems and Text Posts',
  'Stories and Folklore',
  'Proverbs',
  'Learning Posts',
  'Research Documents',
  'Other',
] as const

export const DATA_COLLECTION_TARGET = 20000
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

export const POPULAR_SEARCHES = [
  'water',
  'hello',
  'thank you',
  'greetings',
  'food',
  'mother',
  'father',
  'love',
  'peace',
  'home',
] as const

export const MAX_RECENTLY_VIEWED = 50
export const MAX_SEARCH_HISTORY = 20
export const CORRECTION_POINTS = 20

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const
