import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AudioPlayer } from './AudioPlayer'
import { WordShareCard } from './WordShareCard'
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
  const { appUser } = useAuth()
  const [favorited, setFavorited] = useState(false)
  const [relatedWords, setRelatedWords] = useState<DictionaryEntry[]>([])
  const [showShareCard, setShowShareCard] = useState(false)

  useEffect(() => {
    if (!appUser || !isExpanded) return
    isFavorited(appUser.uid, entry.id).then(setFavorited)
    addRecentlyViewed(appUser.uid, entry.id).catch(() => {})
  }, [appUser, entry.id, isExpanded])

  useEffect(() => {
    if (!isExpanded) return
    listRelatedWords(entry.category, entry.dialect, entry.id)
      .then(setRelatedWords)
      .catch(() => {})
  }, [isExpanded, entry.category, entry.dialect, entry.id])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!appUser) return
    const newState = await toggleFavorite(appUser.uid, entry.id)
    setFavorited(newState)
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
              className={`rounded-full p-2 transition-all ${
                favorited
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-slate-400 hover:text-red-400'
              }`}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="h-5 w-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <svg
              className={`h-5 w-5 text-slate-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-kassena-cream">
            <button
              type="button"
              onClick={() => setShowShareCard(!showShareCard)}
              className="inline-flex items-center gap-1.5 rounded-full bg-kassena-green px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-kassena-dark"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <Link
              to={`/submit?correction=${entry.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-full border border-kassena-orange px-3 py-1.5 text-xs font-semibold text-kassena-orange transition-all hover:bg-kassena-orange/5"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Suggest Correction
            </Link>
          </div>
        </div>
      )}
    </article>
  )
}
