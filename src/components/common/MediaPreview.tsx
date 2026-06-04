export interface MediaPreviewFile {
  name: string
  url: string
  contentType?: string
}

interface MediaPreviewProps {
  file: MediaPreviewFile
  title?: string
  className?: string
  compact?: boolean
}

type MediaKind = 'audio' | 'video' | 'image' | 'file'

const EXTENSION_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

const TYPE_LABELS: Record<string, string> = {
  'audio/mpeg': 'MP3 audio',
  'audio/mp4': 'MP4 audio',
  'audio/wav': 'WAV audio',
  'audio/x-wav': 'WAV audio',
  'video/mp4': 'MP4 video',
  'video/quicktime': 'MOV video',
  'video/webm': 'WEBM video',
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/webp': 'Image',
}

const GENERIC_CONTENT_TYPES = new Set([
  'application/octet-stream',
  'binary/octet-stream',
])

const getExtension = (fileName: string) => {
  const extension = fileName.split('.').pop()
  return extension ? extension.toLowerCase() : ''
}

const resolveContentType = (file: MediaPreviewFile) => {
  const explicitType = file.contentType?.trim().toLowerCase()
  if (explicitType && !GENERIC_CONTENT_TYPES.has(explicitType)) {
    return explicitType
  }

  return EXTENSION_TYPES[getExtension(file.name)] ?? ''
}

const getMediaKind = (file: MediaPreviewFile): MediaKind => {
  const contentType = resolveContentType(file)
  const extension = getExtension(file.name)

  if (
    contentType.startsWith('audio/') ||
    ['mp3', 'm4a', 'wav'].includes(extension)
  ) {
    return 'audio'
  }

  if (
    contentType.startsWith('video/') ||
    ['mp4', 'mov', 'webm'].includes(extension)
  ) {
    return 'video'
  }

  if (
    contentType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
  ) {
    return 'image'
  }

  return 'file'
}

const getTypeLabel = (file: MediaPreviewFile) => {
  const contentType = resolveContentType(file)
  return TYPE_LABELS[contentType] ?? (contentType || 'Attached file')
}

export const MediaPreview = ({
  file,
  title,
  className = '',
  compact = false,
}: MediaPreviewProps) => {
  const contentType = resolveContentType(file)
  const kind = getMediaKind(file)
  const label = title || file.name
  const mediaClassName = compact ? 'max-h-64' : 'max-h-[28rem]'

  if (!file.url) {
    return (
      <p className={`text-sm text-slate-500 ${className}`}>
        No file URL is available.
      </p>
    )
  }

  return (
    <figure className={`space-y-2 ${className}`}>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span className="min-w-0 truncate font-medium text-slate-700">
          {file.name}
        </span>
        <span className="shrink-0 rounded-full bg-kassena-cream px-2 py-0.5 font-semibold text-kassena-green">
          {getTypeLabel(file)}
        </span>
      </figcaption>

      {kind === 'audio' ? (
        <div className="rounded-lg border border-kassena-cream bg-kassena-bg px-3 py-3">
          <audio controls preload="metadata" className="w-full">
            <source src={file.url} type={contentType || undefined} />
            Your browser does not support this audio file.
          </audio>
        </div>
      ) : null}

      {kind === 'video' ? (
        <video
          controls
          preload="metadata"
          className={`aspect-video w-full rounded-lg bg-slate-950 object-contain ${mediaClassName}`}
        >
          <source src={file.url} type={contentType || undefined} />
          Your browser does not support this video file.
        </video>
      ) : null}

      {kind === 'image' ? (
        <img
          src={file.url}
          alt={label}
          loading="lazy"
          className={`w-full rounded-lg object-cover ${compact ? 'h-40' : 'h-48'}`}
        />
      ) : null}

      {kind === 'file' ? (
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg border border-kassena-gold px-3 py-2 text-sm font-semibold text-kassena-green"
        >
          Open file
        </a>
      ) : (
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-semibold text-kassena-orange"
        >
          Open file in new tab
        </a>
      )}
    </figure>
  )
}
