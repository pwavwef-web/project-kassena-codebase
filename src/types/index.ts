import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'contributor' | 'validator' | 'admin'
export type UserStatus = 'active' | 'disabled'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
  role: UserRole
  community?: string
  dialect?: string
  dialects?: string[]
  phone?: string
  bio?: string
  contributionFocus?: string
  createdAt: Timestamp | null
  lastLoginAt: Timestamp | null
  status: UserStatus
}

export interface FileMetadata {
  name: string
  url: string
  storagePath: string
  contentType: string
  size: number
  uploadedAt: Timestamp | null
}

export interface Contribution {
  id: string
  englishText: string
  kasemText: string
  alternateKasemTerms: string
  englishExample: string
  kasemExample: string
  dialect: string
  partOfSpeech: string
  category: string
  notes: string
  wordUseRules?: string
  contributorId: string
  contributorName: string
  contributorEmail: string
  status: ReviewStatus
  reviewNotes: string
  reviewedBy: string | null
  reviewedAt: Timestamp | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  attachedFiles: FileMetadata[]
}

export interface DictionaryEntry {
  id: string
  englishText: string
  kasemText: string
  alternateKasemTerms?: string
  englishExample: string
  kasemExample: string
  dialect: string
  partOfSpeech: string
  category: string
  sourceContributionId?: string
  contributorId?: string
  approvedBy?: string
  approvedAt?: Timestamp | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  isPublished: boolean
}

export interface UploadRecord {
  id: string
  title: string
  description: string
  category: string
  dialect?: string
  consentStatus?: 'not_required' | 'pending' | 'received'
  culturalSensitivity?: 'public' | 'private_archive' | 'restricted'
  tags?: string
  fileName: string
  fileUrl: string
  storagePath: string
  contentType: string
  size: number
  uploadedBy: string
  uploadedByName: string
  status: ReviewStatus
  isPublished?: boolean
  createdAt: Timestamp | null
  reviewedBy: string | null
  reviewedAt: Timestamp | null
  reviewNotes: string
}

export interface AppSettings {
  appName: string
  launchMode: 'mvp' | 'open'
  allowPublicSubmissions: boolean
  updatedAt: Timestamp | null
}

export interface AuditLog {
  action:
    | 'CONTRIBUTION_APPROVED'
    | 'CONTRIBUTION_REJECTED'
    | 'USER_ROLE_UPDATED'
    | 'UPLOAD_APPROVED'
    | 'UPLOAD_REJECTED'
    | 'DICTIONARY_ENTRY_UPDATED'
    | 'DICTIONARY_ENTRY_UNPUBLISHED'
  actorId: string
  actorEmail: string
  targetCollection: string
  targetId: string
  details: Record<string, unknown>
  createdAt: Timestamp | null
}

export interface DashboardMetrics {
  totalUsers: number
  totalContributions: number
  pendingContributions: number
  approvedContributions: number
  rejectedContributions: number
  totalUploads: number
  pendingUploads: number
  approvedUploads: number
  approvedDictionaryEntries: number
}

export interface PublicDashboardMetrics {
  totalSubmissions: number
  approvedEntries: number
  pendingReview: number
  activeContributors: number
  approvedMediaItems: number
}
