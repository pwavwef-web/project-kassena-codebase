import { useRef, useState } from 'react'
import { AppIcon } from './AppIcon'

interface AudioPlayerProps {
  src: string
  label?: string
  className?: string
  compact?: boolean
}

export const AudioPlayer = ({
  src,
  label,
  className = '',
  compact = false,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={togglePlay}
        className={`flex items-center justify-center rounded-full bg-kassena-green text-white transition-all hover:bg-kassena-dark active:scale-95 ${
          compact ? 'h-8 w-8' : 'h-10 w-10'
        }`}
        aria-label={isPlaying ? 'Pause pronunciation' : 'Play pronunciation'}
      >
        <AppIcon
          name={isPlaying ? 'pause' : 'play'}
          className="h-full w-full"
        />
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      {label && (
        <span className="text-sm text-slate-600">{label}</span>
      )}
    </div>
  )
}
