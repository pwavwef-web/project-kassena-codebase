import { useCallback, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { recordAchievementShare } from '../../lib/achievements'

interface WordShareCardData {
  kasemWord: string
  pronunciation?: string
  englishMeaning: string
  exampleSentence?: string
  dialect?: string
}

interface WordShareCardProps {
  data: WordShareCardData
  onShareComplete?: () => void
  viewerId?: string | null
}

export const WordShareCard = ({
  data,
  onShareComplete,
  viewerId,
}: WordShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAndShare = useCallback(async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    const downloadImage = (canvas: HTMLCanvasElement) => {
      const link = document.createElement('a')
      link.download = `${data.kasemWord}-tribestudio.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `${data.kasemWord}-tribestudio.png`, {
          type: 'image/png',
        })

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: `${data.kasemWord} - TribeStudio`,
              text: `${data.kasemWord} (${data.englishMeaning}) - Learn Kasem on TribeStudio!`,
              files: [file],
            })
            recordAchievementShare(viewerId)
          } catch {
            downloadImage(canvas)
            recordAchievementShare(viewerId)
          }
        } else {
          downloadImage(canvas)
          recordAchievementShare(viewerId)
        }

        onShareComplete?.()
      }, 'image/png')
    } catch {
      console.error('Failed to generate share card')
    } finally {
      setIsGenerating(false)
    }
  }, [data, onShareComplete, viewerId])

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          width: '600px',
          padding: '48px',
          background: 'linear-gradient(135deg, #0b4b2b 0%, #1a6b42 50%, #0b4b2b 100%)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(212,160,56,0.15)',
            filter: 'blur(40px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(212,160,56,0.2)',
                color: '#f5c84b',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              TribeStudio
            </div>
            {data.dialect && (
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {data.dialect}
              </div>
            )}
          </div>

          <h1
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {data.kasemWord}
          </h1>

          {data.pronunciation && (
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.5)',
                margin: '8px 0 0',
                fontWeight: 500,
              }}
            >
              {data.pronunciation}
            </p>
          )}

          <p
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#f5c84b',
              margin: '24px 0 0',
            }}
          >
            {data.englishMeaning}
          </p>

          {data.exampleSentence && (
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                margin: '16px 0 0',
                fontStyle: 'italic',
                borderLeft: '3px solid rgba(245,200,75,0.3)',
                paddingLeft: '16px',
              }}
            >
              &ldquo;{data.exampleSentence}&rdquo;
            </p>
          )}

          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 600,
              }}
            >
              Preserving the Kasem Language
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 600,
              }}
            >
              tribestudio.com
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={generateAndShare}
        disabled={isGenerating}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-kassena-green px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-kassena-dark active:scale-95 disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <img
              src="/icons/share-impact.png"
              alt=""
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            Share as Image
          </>
        )}
      </button>
    </div>
  )
}
