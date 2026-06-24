import { useEffect, useRef, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { KasemKeyboard } from '../../components/KasemKeyboard'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../hooks/useAuth'
import {
  listApprovedDictionaryEntries,
  unpublishDictionaryEntry,
  upsertDictionaryEntry,
} from '../../lib/firestore'
import type { DictionaryEntry } from '../../types'

export const AdminDictionaryPage = () => {
  const { appUser } = useAuth()
  const editKasemTextRef = useRef<HTMLInputElement>(null)
  const editPronunciationRef = useRef<HTMLInputElement>(null)
  const editAlternateTermsRef = useRef<HTMLTextAreaElement>(null)
  const editKasemExampleRef = useRef<HTMLTextAreaElement>(null)
  const editCulturalNoteRef = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null)
  const [editValues, setEditValues] = useState({
    englishText: '',
    kasemText: '',
    alternateKasemTerms: '',
    englishExample: '',
    kasemExample: '',
    dialect: 'Other',
    partOfSpeech: 'Other',
    category: 'General vocabulary',
    pronunciation: '',
    culturalNote: '',
  })

  const load = async () => {
    setEntries(await listApprovedDictionaryEntries())
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const dictionaryEntries = await listApprovedDictionaryEntries()
      if (active) {
        setEntries(dictionaryEntries)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const actor = { id: appUser?.uid ?? '', email: appUser?.email ?? '' }

  const addManualEntry = async () => {
    if (appUser?.role !== 'admin') return

    const englishText = window.prompt('English text')
    const kasemText = window.prompt('Kasem text')
    const pronunciation = window.prompt('Pronunciation (phonetic guide)') ?? ''

    if (!englishText || !kasemText) return

    const id = crypto.randomUUID()
    await upsertDictionaryEntry(
      id,
      {
        englishText,
        kasemText,
        alternateKasemTerms: '',
        englishExample: '',
        kasemExample: '',
        dialect: 'Other',
        partOfSpeech: 'Other',
        category: 'General vocabulary',
        pronunciation,
        audioUrl: '',
        culturalNote: '',
        isPublished: true,
      },
      actor,
    )
    await load()
  }

  const openEditModal = (entry: DictionaryEntry) => {
    if (appUser?.role !== 'admin') return
    setEditingEntry(entry)
    setEditValues({
      englishText: entry.englishText,
      kasemText: entry.kasemText,
      alternateKasemTerms: entry.alternateKasemTerms ?? '',
      englishExample: entry.englishExample,
      kasemExample: entry.kasemExample,
      dialect: entry.dialect,
      partOfSpeech: entry.partOfSpeech,
      category: entry.category,
      pronunciation: entry.pronunciation ?? '',
      culturalNote: entry.culturalNote ?? '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editingEntry || appUser?.role !== 'admin') return

    await upsertDictionaryEntry(
      editingEntry.id,
      {
        englishText: editValues.englishText,
        kasemText: editValues.kasemText,
        alternateKasemTerms: editValues.alternateKasemTerms,
        englishExample: editValues.englishExample,
        kasemExample: editValues.kasemExample,
        dialect: editValues.dialect,
        partOfSpeech: editValues.partOfSpeech,
        category: editValues.category,
        pronunciation: editValues.pronunciation,
        audioUrl: editingEntry.audioUrl ?? '',
        culturalNote: editValues.culturalNote,
        sourceContributionId: editingEntry.sourceContributionId,
        contributorId: editingEntry.contributorId,
        contributorName: editingEntry.contributorName,
        approvedBy: editingEntry.approvedBy,
        approvedAt: editingEntry.approvedAt,
        isPublished: editingEntry.isPublished,
      },
      actor,
    )
    setEditingEntry(null)
    await load()
  }

  const handleUnpublish = async (id: string) => {
    if (appUser?.role !== 'admin') return
    await unpublishDictionaryEntry(id, actor)
    await load()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-kassena-green">
          Dictionary Management
        </h1>
        <button
          type="button"
          onClick={addManualEntry}
          disabled={appUser?.role !== 'admin'}
          className="rounded-lg bg-kassena-orange px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          Add entry manually
        </button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : entries.length ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <h2 className="font-semibold text-kassena-green">
                {entry.englishText} — {entry.kasemText}
              </h2>
              <p className="text-sm text-slate-600">
                {entry.dialect} • {entry.partOfSpeech} • {entry.category}
              </p>
              {entry.pronunciation && (
                <p className="text-xs text-slate-500">/{entry.pronunciation}/</p>
              )}
              {entry.culturalNote && (
                <p className="mt-1 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                  Cultural note: {entry.culturalNote}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(entry)}
                  disabled={appUser?.role !== 'admin'}
                  className="rounded-lg border border-kassena-gold px-3 py-1 text-sm text-kassena-green disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleUnpublish(entry.id)}
                  disabled={appUser?.role !== 'admin'}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-sm text-white disabled:opacity-60"
                >
                  Unpublish
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No approved dictionary entries available." />
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-kassena-green">Edit Entry</h2>
            <div className="space-y-3">
              <label className="space-y-1 text-sm">
                <span>English text</span>
                <input
                  value={editValues.englishText}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, englishText: e.target.value }))}
                  className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                />
              </label>
              <div>
                <label className="space-y-1 text-sm">
                  <span>Kasem text</span>
                  <input
                    ref={editKasemTextRef}
                    value={editValues.kasemText}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, kasemText: e.target.value }))}
                    className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                  />
                </label>
                <KasemKeyboard
                  inputRef={editKasemTextRef}
                  context="admin_dictionary_kasem_text"
                />
              </div>
              <div>
                <label className="space-y-1 text-sm">
                  <span>Pronunciation</span>
                  <input
                    ref={editPronunciationRef}
                    value={editValues.pronunciation}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, pronunciation: e.target.value }))}
                    placeholder="/lam/"
                    className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                  />
                </label>
                <KasemKeyboard
                  inputRef={editPronunciationRef}
                  context="admin_dictionary_pronunciation"
                />
              </div>
              <div>
                <label className="space-y-1 text-sm">
                  <span>Alternative spellings</span>
                  <textarea
                    ref={editAlternateTermsRef}
                    value={editValues.alternateKasemTerms}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, alternateKasemTerms: e.target.value }))}
                    className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                  />
                </label>
                <KasemKeyboard
                  inputRef={editAlternateTermsRef}
                  context="admin_dictionary_alternate_terms"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm">
                  <span>English example</span>
                  <textarea
                    value={editValues.englishExample}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, englishExample: e.target.value }))}
                    className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                  />
                </label>
                <div>
                  <label className="space-y-1 text-sm">
                    <span>Kasem example</span>
                    <textarea
                      ref={editKasemExampleRef}
                      value={editValues.kasemExample}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, kasemExample: e.target.value }))}
                      className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                    />
                  </label>
                  <KasemKeyboard
                    inputRef={editKasemExampleRef}
                    context="admin_dictionary_kasem_example"
                  />
                </div>
              </div>
              <div>
                <label className="space-y-1 text-sm">
                  <span>Cultural note</span>
                  <textarea
                    ref={editCulturalNoteRef}
                    value={editValues.culturalNote}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, culturalNote: e.target.value }))}
                    className="w-full rounded-lg border border-kassena-cream px-3 py-2"
                  />
                </label>
                <KasemKeyboard
                  inputRef={editCulturalNoteRef}
                  context="admin_dictionary_cultural_note"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-kassena-orange px-4 py-2 text-sm font-semibold text-white"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
