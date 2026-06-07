import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '../components/common/AlertMessage'
import {
  ContributionForm,
  type ContributionFormValues,
} from '../components/forms/ContributionForm'
import { useAuth } from '../hooks/useAuth'
import {
  createContribution,
  getLeaderboardRank,
  listApprovedDictionaryEntries,
  listRewardBounties,
  listUserContributions,
  listUserUploads,
  setContributionAttachedFiles,
  setContributionVoiceData,
} from '../lib/firestore'
import { uploadContributionFile, uploadPronunciationAudio } from '../lib/storage'
import type {
  Contribution,
  ContributionVoiceRecording,
  ContributionVoiceRecordingType,
  DictionaryEntry,
  RewardBounty,
  UploadRecord,
} from '../types'

const voiceRecordingLabels: Record<ContributionVoiceRecordingType, string> = {
  pronunciation: 'Pronunciation',
  exampleSentence: 'Example sentence',
  culturalExplanation: 'Cultural explanation',
}

const pointsForContribution = (contribution: Contribution) => {
  const hasExamples = Boolean(
    contribution.englishExample || contribution.kasemExample,
  )

  return 50 + (hasExamples ? 10 : 0)
}

const pointsForUpload = () => 100

export const SubmitContributionPage = () => {
  const { firebaseUser, appUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionComplete, setSubmissionComplete] = useState(false)
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>(
    [],
  )
  const [bounties, setBounties] = useState<RewardBounty[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [rank, setRank] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const [entries, activeBounties] = await Promise.all([
        listApprovedDictionaryEntries(),
        listRewardBounties(),
      ])

      if (active) {
        setDictionaryEntries(entries)
        setBounties(activeBounties)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setFeedback({
          type: 'error',
          message: 'Contribution helpers could not be loaded right now.',
        })
      }
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const hydrateImpact = async () => {
      if (!appUser) {
        return
      }

      const [userContributions, userUploads] = await Promise.all([
        listUserContributions(appUser.uid),
        listUserUploads(appUser.uid),
      ])

      if (active) {
        setContributions(userContributions)
        setUploads(userUploads)
      }
    }

    hydrateImpact().catch(() => {
      if (active) {
        setFeedback({
          type: 'error',
          message: 'Your contribution impact could not be loaded right now.',
        })
      }
    })

    return () => {
      active = false
    }
  }, [appUser])

  const impactStats = useMemo(() => {
    const approvedContributions = contributions.filter(
      (item) => item.status === 'approved',
    )
    const approvedUploads = uploads.filter((item) => item.status === 'approved')
    const calculatedPoints =
      approvedContributions.reduce(
        (total, contribution) => total + pointsForContribution(contribution),
        0,
      ) + approvedUploads.reduce((total) => total + pointsForUpload(), 0)
    const audioRecordings = contributions.reduce(
      (total, contribution) =>
        total +
        (contribution.voiceRecordings?.length ??
          (contribution.audioUrl ? 1 : 0)),
      0,
    )

    return {
      words: contributions.length,
      audioRecordings,
      points: appUser?.totalPoints ?? calculatedPoints,
      rank,
    }
  }, [appUser?.totalPoints, contributions, rank, uploads])

  useEffect(() => {
    let active = true

    if (!appUser) {
      return () => {
        active = false
      }
    }

    getLeaderboardRank('allTime', impactStats.points)
      .then((nextRank) => {
        if (active) {
          setRank(nextRank)
        }
      })
      .catch(() => {
        if (active) {
          setRank(null)
        }
      })

    return () => {
      active = false
    }
  }, [appUser, impactStats.points])

  const refreshImpact = async () => {
    if (!appUser) {
      return
    }

    const [userContributions, userUploads] = await Promise.all([
      listUserContributions(appUser.uid),
      listUserUploads(appUser.uid),
    ])
    setContributions(userContributions)
    setUploads(userUploads)
  }

  const handleSubmit = async (values: ContributionFormValues) => {
    if (!firebaseUser || !appUser) {
      setFeedback({
        type: 'error',
        message: 'Please sign in to submit a contribution.',
      })
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const contributionId = await createContribution({
        contributionType: values.contributionType,
        englishText: values.englishText,
        kasemText: values.kasemText,
        alternateKasemTerms: values.alternateKasemTerms,
        englishExample: values.englishExample,
        kasemExample: values.kasemExample,
        dialect: values.dialect,
        partOfSpeech: values.partOfSpeech,
        category: values.category,
        notes: values.notes,
        wordUseRules: values.wordUseRules ?? '',
        pronunciation: values.pronunciation,
        audioUrl: '',
        voiceRecordings: [],
        culturalNote: values.culturalNote,
        selectedBountyId: values.selectedBountyId,
        selectedBountyTitle: values.selectedBountyTitle,
        contributorId: appUser.uid,
        contributorName: appUser.displayName,
        contributorEmail: appUser.email,
        status: 'pending',
        reviewNotes: '',
        reviewedBy: null,
        attachedFiles: [],
      })

      if (values.voiceRecordings.length) {
        const voiceRecordings = await Promise.all(
          values.voiceRecordings.map(async (recording) => {
            const metadata = await uploadPronunciationAudio(
              firebaseUser.uid,
              contributionId,
              recording.file,
            )

            return {
              type: recording.type,
              label: voiceRecordingLabels[recording.type],
              url: metadata.url,
              storagePath: metadata.storagePath,
              fileName: recording.file.name,
              contentType: recording.file.type,
              size: recording.file.size,
              uploadedAt: null,
            } satisfies ContributionVoiceRecording
          }),
        )
        const pronunciationRecording = voiceRecordings.find(
          (recording) => recording.type === 'pronunciation',
        )

        await setContributionVoiceData(contributionId, {
          audioUrl: pronunciationRecording?.url,
          voiceRecordings,
        })
      }

      if (values.file) {
        const metadata = await uploadContributionFile(
          firebaseUser.uid,
          contributionId,
          values.file,
        )
        await setContributionAttachedFiles(contributionId, [
          {
            ...metadata,
            uploadedAt: null,
          },
        ])
      }

      await refreshImpact()
      setSubmissionComplete(true)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Unable to submit contribution right now.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const startAnother = () => {
    setSubmissionComplete(false)
    setFeedback(null)
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-[28px] bg-[#173323] p-5 text-white shadow-[0_24px_60px_rgba(20,83,45,0.22)] md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kassena-gold">
          Preserve Kasem
        </p>
        <h1 className="mt-2 text-3xl font-black">Submit Contribution</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-kassena-cream/85">
          Add the word and translation first. Examples, dialect details, audio,
          and cultural context can build a stronger submission when you have
          them.
        </p>
      </div>

      {feedback ? (
        <AlertMessage type={feedback.type} message={feedback.message} />
      ) : null}

      <ContributionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        dictionaryEntries={dictionaryEntries}
        bounties={bounties}
        impactStats={impactStats}
        submissionComplete={submissionComplete}
        onStartAnother={startAnother}
      />
    </section>
  )
}
