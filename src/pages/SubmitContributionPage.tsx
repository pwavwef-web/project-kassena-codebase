import { useState } from 'react'
import { AlertMessage } from '../components/common/AlertMessage'
import {
  ContributionForm,
  type ContributionFormValues,
} from '../components/forms/ContributionForm'
import { useAuth } from '../hooks/useAuth'
import {
  createContribution,
  setContributionAttachedFiles,
} from '../lib/firestore'
import { uploadContributionFile } from '../lib/storage'

export const SubmitContributionPage = () => {
  const { firebaseUser, appUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

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
        englishText: values.englishText,
        kasemText: values.kasemText,
        englishExample: values.englishExample,
        kasemExample: values.kasemExample,
        dialect: values.dialect,
        partOfSpeech: values.partOfSpeech,
        category: values.category,
        notes: values.notes,
        contributorId: appUser.uid,
        contributorName: appUser.displayName,
        contributorEmail: appUser.email,
        status: 'pending',
        reviewNotes: '',
        reviewedBy: null,
        attachedFiles: [],
      })

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

      setFeedback({
        type: 'success',
        message: 'Contribution submitted for review.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Unable to submit contribution right now.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">
        Submit Contribution
      </h1>
      <p className="text-sm text-slate-600">
        All entries are reviewed by validators before publication.
      </p>
      {feedback ? (
        <AlertMessage type={feedback.type} message={feedback.message} />
      ) : null}
      <ContributionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </section>
  )
}
