import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AudioPlayer } from './AudioPlayer'
import { WordShareCard } from './WordShareCard'
import { AppIcon } from './AppIcon'
import { useAuth } from '../../hooks/useAuth'
import {
  toggleFavorite,
  isFavorited,
  listRelatedWords,
  addRecentlyViewed,
} from '../../lib/firestore'
import type { DictionaryEntry } from '../../types'

interface ExpandableDictionaryCardProps {
  entry: DictionaryEntry
  isExpanded: boolean
  onToggleExpand: () => void
}

export const ExpandableDictionaryCard = ({
  entry,
  isExpanded,
  onToggleExpand,
}: ExpandableDictionaryCardProps) => {
  const { appUser, firebaseUser } = useAuth()
  const [favorited, setFavorited] = useState(false)
  const [relatedWords, setRelatedWords] = useState<DictionaryEntry[]>([])
  const [showShareCard, setShowShareCard] = useState(false)
  const userId = firebaseUser?.uid

  useEffect(() => {
    if (!userId || !isExpanded) return
    let cancelled = false
    isFavorited(userId, entry.id).then((result) => {
      if (!cancelled) setFavorited(result)
    }).catch(() => {})
    addRecentlyViewed(userId, entry.id).catch(() => {})
    return () => { cancelled = true }
  }, [entry.id, isExpanded, userId])

  useEffect(() => {
    if (!isExpanded) return
    listRelatedWords(entry.category, entry.dialect, entry.id)
      .then(setRelatedWords)
      .catch(() => {})
  }, [isExpanded, entry.category, entry.dialect, entry.id])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!appUser || !userId) return

    try {
      const newState = await toggleFavorite(userId, entry.id)
      setFavorited(newState)
    } catch (error) {
      console.error('Failed to update favorite', error)
    }
  }

  return (
    <article
      className={`rounded-2xl bg-white shadow-sm transition-all ${
        isExpanded
          ? 'ring-2 ring-kassena-green/30 shadow-md'
          : 'hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-kassena-green">
              {entry.englishText} — {entry.kasemText}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {entry.partOfSpeech} • {entry.dialect} • {entry.category}
            </p>
            {entry.pronunciation && (
              <p className="mt-1 text-sm text-slate-500">
                /{entry.pronunciation}/
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {entry.audioUrl && (
              <AudioPlayer
                src={entry.audioUrl}
                compact
              />
            )}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`rounded-full p-2 transition-all hover:scale-110 ${
                favorited
                  ? ''
                  : 'grayscale opacity-65 hover:grayscale-0 hover:opacity-100'
              }`}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <AppIcon name="heart" className="h-6 w-6" />
            </button>
            <AppIcon
              name="chevron-right"
              className={`h-6 w-6 transition-transform ${
                isExpanded ? '-rotate-90' : 'rotate-90'
              }`}
            />
          </div>
        </div>

        {!isExpanded && (entry.englishExample || entry.kasemExample) && (
          <p className="mt-2 text-sm text-slate-700 line-clamp-1">
            Example: {entry.englishExample} / {entry.kasemExample}
          </p>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-kassena-cream px-4 pb-4 pt-4 space-y-4">
          {entry.pronunciation && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pronunciation</h3>
              <p className="text-sm text-slate-700">/{entry.pronunciation}/</p>
            </div>
          )}

          {entry.audioUrl && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Audio</h3>
              <AudioPlayer src={entry.audioUrl} label="Listen to pronunciation" />
            </div>
          )}

          {entry.alternateKasemTerms && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Alternative Spellings</h3>
              <p className="text-sm text-slate-700">{entry.alternateKasemTerms}</p>
            </div>
          )}

          {(entry.englishExample || entry.kasemExample) && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Example Sentences</h3>
              {entry.englishExample && (
                <p className="text-sm text-slate-700"><span className="font-semibold">EN:</span> {entry.englishExample}</p>
              )}
              {entry.kasemExample && (
                <p className="text-sm text-slate-700"><span className="font-semibold">KS:</span> {entry.kasemExample}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Part of Speech</span>
              <p className="text-slate-700">{entry.partOfSpeech}</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dialect</span>
              <p className="text-slate-700">{entry.dialect}</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</span>
              <p className="text-slate-700">{entry.category}</p>
            </div>
            {entry.contributorName && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contributor</span>
                <p className="text-slate-700">{entry.contributorName}</p>
              </div>
            )}
          </div>

          {entry.approvedAt && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Approved</span>
              <p className="text-sm text-slate-700">
                {entry.approvedAt.toDate?.().toLocaleDateString?.() ?? 'N/A'}
              </p>
            </div>
          )}

          {entry.culturalNote && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Cultural Note</h3>
              <p className="text-sm text-amber-800">{entry.culturalNote}</p>
            </div>
          )}

          {entry.wordUseRules && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Usage Rules</h3>
              <p className="text-sm text-blue-800">{entry.wordUseRules}</p>
            </div>
          )}

          {relatedWords.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Related Words</h3>
              <div className="flex flex-wrap gap-2">
                {relatedWords.map((related) => (
                  <span
                    key={related.id}
                    className="inline-flex items-center gap-1 rounded-full bg-kassena-cream px-3 py-1 text-xs font-semibold text-kassena-green"
                  >
                    {related.kasemText} ({related.englishText})
                  </span>
                ))}
              </div>
            </div>
          )}

          {showShareCard && (
            <div className="rounded-xl border border-kassena-cream bg-slate-50 p-4">
              <WordShareCard
                data={{
                  kasemWord: entry.kasemText,
                  pronunciation: entry.pronunciation,
                  englishMeaning: entry.englishText,
                  exampleSentence: entry.kasemExample || entry.englishExample,
                  dialect: entry.dialect,
                }}
                onShareComplete={() => setShowShareCard(false)}
                viewerId={userId}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-kassena-cream">
            <button
              type="button"
              onClick={() => setShowShareCard(!showShareCard)}
              className="inline-flex items-center gap-1.5 rounded-full bg-kassena-green px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-kassena-dark"
            >
              <AppIcon name="share" className="h-4 w-4" />
              Share
            </button>
            <Link
              to={`/submit?correction=${entry.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-full border border-kassena-orange px-3 py-1.5 text-xs font-semibold text-kassena-orange transition-all hover:bg-kassena-orange/5"
            >
              <AppIcon name="edit" className="h-4 w-4" />
              Suggest Correction
            </Link>
          </div>
        </div>
      )}
    </article>
  )
}
