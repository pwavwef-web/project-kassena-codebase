import {
  Campaign,
  ContentRecord,
  ContentStatus,
  ContentTier,
  ReviewTask,
  campaigns,
  reviewQueue,
} from '../data/studioData'
import { auth, db, firebaseConfigStatus } from '../lib/firebase'
import { studioFeatureFlags } from '../lib/featureFlags'
import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'

export interface DraftContributionInput {
  type: string
  title: string
  language: string
  dialect: string
  source: string
  consent: boolean
  contentTier: string
  permittedUses: string
}

export interface StudioService {
  listContent(): Promise<ContentRecord[]>
  listReviews(): Promise<ReviewTask[]>
  listCampaigns(): Promise<Campaign[]>
  saveDraft(input: DraftContributionInput): Promise<{ id: string; status: 'draft-saved' }>
}

export class LocalStudioService implements StudioService {
  async listContent() {
    return []
  }

  async listReviews() {
    return reviewQueue
  }

  async listCampaigns() {
    return campaigns
  }

  async saveDraft(
    input: DraftContributionInput,
  ): Promise<{ id: string; status: 'draft-saved' }> {
    throw new Error(
      `Firebase is required to save "${input.title || input.type}" drafts in this MVP.`,
    )
  }
}

const readableContributionStatuses = [
  'draft',
  'submitted',
  'pending_review',
  'approved',
  'rejected',
  'needs_revision',
  'archived',
] as const

const statusLabels: Record<string, ContentStatus> = {
  draft: 'draft',
  submitted: 'submitted',
  pending_review: 'pending review',
  approved: 'approved',
  rejected: 'rejected',
  needs_revision: 'pending review',
  archived: 'archived',
}

const tierLabels: Record<string, ContentTier> = {
  OPEN: 'Open',
  RESTRICTED: 'Restricted',
  SENSITIVE: 'Sensitive',
}

const consentLabels: Record<string, string> = {
  contributor_consented: 'Contributor consent recorded',
  pending: 'Consent pending',
  source_consented: 'Source consent recorded',
  not_required: 'Not required',
  withdrawn: 'Withdrawn',
  rejected: 'Rejected',
}

const validationLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  pending_review: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_revision: 'Needs revision',
  archived: 'Archived',
}

const toFirestoreText = (value: string, fallback: string) => {
  const trimmed = value.trim()

  return trimmed.length ? trimmed : fallback
}

const toDateLabel = (value: unknown) => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().slice(0, 10)
  }

  return new Date().toISOString().slice(0, 10)
}

const toPermittedUses = (value: string) => {
  const uses = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)

  return uses.length ? uses : ['Educational community review']
}

const toContentRecord = (id: string, data: DocumentData): ContentRecord => ({
  id,
  type: toFirestoreText(String(data.type ?? 'contribution'), 'contribution'),
  title: toFirestoreText(String(data.title ?? 'Untitled draft'), 'Untitled draft'),
  language: toFirestoreText(String(data.language ?? 'Kasem'), 'Kasem'),
  dialect: String(data.dialect ?? ''),
  status: statusLabels[String(data.validationStatus)] ?? 'draft',
  tier: tierLabels[String(data.contentTier)] ?? 'Open',
  contributor: toFirestoreText(String(data.attribution ?? 'You'), 'You'),
  source: toFirestoreText(String(data.source ?? 'Contributor supplied'), 'Contributor supplied'),
  consent: consentLabels[String(data.consentStatus)] ?? 'Consent pending',
  licence: toFirestoreText(String(data.licence ?? 'Community review required'), 'Community review required'),
  validation: validationLabels[String(data.validationStatus)] ?? 'Draft',
  updatedAt: toDateLabel(data.updatedAt),
})

class FirebaseStudioService implements StudioService {
  private readonly fallback = new LocalStudioService()

  async listContent() {
    if (
      !studioFeatureFlags.firestoreContributions ||
      !firebaseConfigStatus.isConfigured ||
      !db ||
      !auth?.currentUser
    ) {
      return this.fallback.listContent()
    }

    const contentQuery = query(
      collection(db, 'contributions'),
      where('contributorId', '==', auth.currentUser.uid),
      where('validationStatus', 'in', [...readableContributionStatuses]),
      orderBy('updatedAt', 'desc'),
      limit(50),
    )
    const snapshot = await getDocs(contentQuery)

    return snapshot.docs.map((documentSnapshot) =>
      toContentRecord(documentSnapshot.id, documentSnapshot.data()),
    )
  }

  async listReviews() {
    return this.fallback.listReviews()
  }

  async listCampaigns() {
    return this.fallback.listCampaigns()
  }

  async saveDraft(input: DraftContributionInput) {
    if (!studioFeatureFlags.firestoreContributions) {
      throw new Error('Firestore contribution writes are feature-flagged off.')
    }

    if (!firebaseConfigStatus.isConfigured || !db) {
      throw new Error(
        `Firebase is not configured. Missing ${firebaseConfigStatus.missingKeys.join(', ')}.`,
      )
    }

    const user = auth?.currentUser

    if (!user) {
      throw new Error('Sign in with Google before saving a contributor draft.')
    }

    const title = toFirestoreText(input.title, 'Untitled contribution draft')
    const attribution = user.displayName || user.email || 'TribeStudio contributor'

    const docRef = await addDoc(collection(db, 'contributions'), {
      title,
      type: input.type,
      text: title,
      literalTranslation: '',
      semanticMeaning: '',
      culturalContext: '',
      ageSuitability: '',
      language: toFirestoreText(input.language, 'Kasem'),
      dialect: input.dialect.trim(),
      community: 'Kasem / Kasena',
      source: toFirestoreText(input.source, 'Contributor supplied'),
      contributorId: user.uid,
      validatorId: '',
      validationStatus: 'draft',
      contentTier: 'OPEN',
      consentStatus: input.consent ? 'contributor_consented' : 'pending',
      licence: 'Community review required',
      permittedUses: toPermittedUses(input.permittedUses),
      aiTrainingPermission: false,
      commercialUsePermission: false,
      attribution,
      reviewHistory: [],
      takedownStatus: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      id: docRef.id,
      status: 'draft-saved' as const,
    }
  }
}

export const studioService: StudioService = new FirebaseStudioService()
