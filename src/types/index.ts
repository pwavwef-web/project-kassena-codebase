import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'contributor' | 'validator' | 'admin'
export type UserStatus = 'active' | 'disabled'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
  totalPoints?: number
  weeklyPoints?: number
  monthlyPoints?: number
  approvedEntries?: number
  badgeTitle?: string
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

export type LeaderboardPeriod = 'week' | 'month' | 'allTime'

export interface LeaderboardProfile {
  uid: string
  displayName: string
  photoURL: string
  community?: string
  totalPoints: number
  weeklyPoints: number
  monthlyPoints: number
  approvedEntries: number
  badgeTitle: string
  lastContributionAt: Timestamp | null
  createdAt: Timestamp | null
}

export interface RankedLeaderboardProfile extends LeaderboardProfile {
  rank: number
  activePoints: number
}

export interface RewardCatalogItem {
  id: string
  title: string
  subtitle: string
  cost: number
  icon: string
  category?: string
  isActive: boolean
  sortOrder: number
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type RewardAchievementRequirement =
  | 'firstContribution'
  | 'approvedEntries'
  | 'uploads'
  | 'totalPoints'
  | 'elderApproved'

export interface RewardAchievement {
  id: string
  title: string
  description: string
  icon: string
  requirementType: RewardAchievementRequirement
  target: number
  isActive: boolean
  sortOrder: number
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface RewardBounty {
  id: string
  title: string
  description: string
  pointsPerContribution: number
  currentContributions: number
  targetContributions: number
  deadlineLabel: string
  sponsorName: string
  icon: string
  isActive: boolean
  sortOrder: number
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface ContributorLevel {
  id: string
  title: string
  description: string
  icon: string
  minPoints: number
  maxPoints: number | null
  isActive: boolean
  sortOrder: number
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface CommunityRecognition {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  scope: string
  awardedAt: Timestamp | null
  isActive: boolean
  sortOrder: number
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface RewardRedemption {
  id: string
  userId: string
  rewardId: string
  title: string
  cost: number
  status: string
  createdAt: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface Announcement {
  id: string
  title: string
  body: string
  category: string
  actionLabel?: string
  actionUrl?: string
  isPublished: boolean
  createdBy: string
  createdByEmail: string
  createdByName: string
  publishedAt: Timestamp | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export interface AdminUserSummary {
  id: string
  displayName: string
  email: string
  photoURL: string
  role: UserRole
  status: UserStatus
  lastLoginAt: Timestamp | null
}

export interface FileMetadata {
  name: string
  url: string
  storagePath: string
  contentType: string
  size: number
  uploadedAt: Timestamp | null
}

export type ContributionVoiceRecordingType =
  | 'pronunciation'
  | 'exampleSentence'
  | 'culturalExplanation'

export interface ContributionVoiceRecording {
  type: ContributionVoiceRecordingType
  label: string
  url: string
  storagePath: string
  fileName: string
  contentType: string
  size: number
  uploadedAt: Timestamp | null
}

export interface Contribution {
  id: string
  contributionType?: string
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
  pronunciation?: string
  audioUrl?: string
  voiceRecordings?: ContributionVoiceRecording[]
  culturalNote?: string
  selectedBountyId?: string
  selectedBountyTitle?: string
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
  pronunciation?: string
  audioUrl?: string
  culturalNote?: string
  relatedWordIds?: string[]
  wordUseRules?: string
  sourceContributionId?: string
  contributorId?: string
  contributorName?: string
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
  updatedAt?: Timestamp | null
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
    | 'ANNOUNCEMENT_SENT'
    | 'ANNOUNCEMENT_DELETED'
  actorId: string
  actorEmail: string
  targetCollection: string
  targetId: string
  details: Record<string, unknown>
  createdAt: Timestamp | null
}

export interface AuditLogRecord extends AuditLog {
  id: string
}

export interface DashboardMetrics {
  totalUsers: number
  activeContributors: number
  activeValidators: number
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

export interface UserFavorite {
  id: string
  userId: string
  entryId: string
  createdAt: Timestamp | null
}

export interface RecentlyViewedWord {
  id: string
  userId: string
  entryId: string
  viewedAt: Timestamp | null
}

export interface SearchHistoryEntry {
  id: string
  userId: string
  query: string
  searchedAt: Timestamp | null
}

export interface DictionaryAnalytics {
  totalSearches: number
  totalViews: number
  totalFavorites: number
  totalCorrections: number
  mostViewedWords: Array<{ entryId: string; englishText: string; kasemText: string; viewCount: number }>
  mostFavoritedWords: Array<{ entryId: string; englishText: string; kasemText: string; favCount: number }>
}
