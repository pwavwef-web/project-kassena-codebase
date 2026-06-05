import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type {
  AppSettings,
  AuditLog,
  Contribution,
  DashboardMetrics,
  DictionaryEntry,
  FileMetadata,
  LeaderboardPeriod,
  LeaderboardProfile,
  PublicDashboardMetrics,
  RankedLeaderboardProfile,
  ReviewStatus,
  UploadRecord,
  UserRole,
  UserStatus,
} from '../types'

const publicDashboardMetricsRef = doc(db, 'publicStats', 'overview')
const contributionApprovalBasePoints = 50
const uploadApprovalPoints = 100
const leaderboardPointFieldByPeriod: Record<
  LeaderboardPeriod,
  keyof Pick<LeaderboardProfile, 'weeklyPoints' | 'monthlyPoints' | 'totalPoints'>
> = {
  week: 'weeklyPoints',
  month: 'monthlyPoints',
  allTime: 'totalPoints',
}

export const getBadgeTitleForPoints = (points: number): string => {
  if (points >= 2500) return 'Elder Approved'
  if (points >= 1000) return 'Kasem Champion'
  if (points >= 500) return 'Community Builder'
  if (points >= 100) return 'Language Helper'
  return 'New Contributor'
}

const asNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const normalizeLeaderboardProfile = (
  id: string,
  data: Record<string, unknown>,
): LeaderboardProfile => {
  const totalPoints = asNumber(data.totalPoints)

  return {
    uid: typeof data.uid === 'string' && data.uid ? data.uid : id,
    displayName:
      typeof data.displayName === 'string' && data.displayName.trim()
        ? data.displayName.trim()
        : 'Kasem Contributor',
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : '',
    totalPoints,
    weeklyPoints: asNumber(data.weeklyPoints),
    monthlyPoints: asNumber(data.monthlyPoints),
    approvedEntries: asNumber(data.approvedEntries),
    badgeTitle:
      typeof data.badgeTitle === 'string' && data.badgeTitle.trim()
        ? data.badgeTitle.trim()
        : getBadgeTitleForPoints(totalPoints),
    lastContributionAt:
      data.lastContributionAt && typeof data.lastContributionAt === 'object'
        ? (data.lastContributionAt as LeaderboardProfile['lastContributionAt'])
        : null,
    createdAt:
      data.createdAt && typeof data.createdAt === 'object'
        ? (data.createdAt as LeaderboardProfile['createdAt'])
        : null,
  }
}

const getActivePoints = (
  profile: LeaderboardProfile,
  period: LeaderboardPeriod,
): number => profile[leaderboardPointFieldByPeriod[period]]

const rankProfiles = (
  profiles: LeaderboardProfile[],
  period: LeaderboardPeriod,
): RankedLeaderboardProfile[] =>
  profiles.map((profile, index) => ({
    ...profile,
    rank: index + 1,
    activePoints: getActivePoints(profile, period),
  }))

const pointsForContributionApproval = (contribution: Contribution): number => {
  const hasExamples = Boolean(
    contribution.englishExample || contribution.kasemExample,
  )

  return contributionApprovalBasePoints + (hasExamples ? 10 : 0)
}

const updateLeaderboardPoints = async (
  userId: string,
  pointDelta: number,
  entryDelta: number,
): Promise<void> => {
  if (!userId || pointDelta === 0) {
    return
  }

  const userRef = doc(db, 'users', userId)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef)
    const data = snapshot.exists() ? snapshot.data() : {}
    const totalPoints = Math.max(0, asNumber(data.totalPoints) + pointDelta)
    const weeklyPoints = Math.max(0, asNumber(data.weeklyPoints) + pointDelta)
    const monthlyPoints = Math.max(0, asNumber(data.monthlyPoints) + pointDelta)
    const approvedEntries = Math.max(
      0,
      asNumber(data.approvedEntries) + entryDelta,
    )

    transaction.set(
      userRef,
      {
        totalPoints,
        weeklyPoints,
        monthlyPoints,
        approvedEntries,
        badgeTitle: getBadgeTitleForPoints(totalPoints),
        lastContributionAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })
}

export const subscribeToLeaderboard = (
  period: LeaderboardPeriod,
  onChange: (profiles: RankedLeaderboardProfile[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const pointField = leaderboardPointFieldByPeriod[period]
  const leaderboardQuery = query(
    collection(db, 'users'),
    orderBy(pointField, 'desc'),
    limit(50),
  )

  // Firebase live leaderboard listener; each tab limits reads to the top 50.
  return onSnapshot(
    leaderboardQuery,
    (snapshot) => {
      onChange(
        rankProfiles(
          snapshot.docs.map((item) =>
            normalizeLeaderboardProfile(item.id, item.data()),
          ),
          period,
        ),
      )
    },
    onError,
  )
}

export const subscribeToLeaderboardUser = (
  uid: string,
  onChange: (profile: LeaderboardProfile | null) => void,
  onError: (error: Error) => void,
): Unsubscribe =>
  onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      onChange(
        snapshot.exists()
          ? normalizeLeaderboardProfile(snapshot.id, snapshot.data())
          : null,
      )
    },
    onError,
  )

export const getLeaderboardRank = async (
  period: LeaderboardPeriod,
  activePoints: number,
): Promise<number> => {
  const pointField = leaderboardPointFieldByPeriod[period]
  const higherRankedSnapshot = await getCountFromServer(
    query(collection(db, 'users'), where(pointField, '>', activePoints)),
  )

  return higherRankedSnapshot.data().count + 1
}

const syncPublicDashboardMetrics = async (
  updates: Partial<Record<keyof PublicDashboardMetrics, unknown>>,
): Promise<void> => {
  await setDoc(publicDashboardMetricsRef, updates, { merge: true })
}

export const createContribution = async (
  payload: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt' | 'reviewedAt'>,
): Promise<string> => {
  const contributionRef = await addDoc(collection(db, 'contributions'), {
    ...payload,
    reviewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await syncPublicDashboardMetrics({
    totalSubmissions: increment(1),
    pendingReview: increment(1),
  })

  return contributionRef.id
}

export const setContributionAttachedFiles = async (
  contributionId: string,
  attachedFiles: FileMetadata[],
): Promise<void> => {
  await updateDoc(doc(db, 'contributions', contributionId), {
    attachedFiles,
    updatedAt: serverTimestamp(),
  })
}

export const listApprovedDictionaryEntries = async (
  search = '',
): Promise<DictionaryEntry[]> => {
  const entriesQuery = query(
    collection(db, 'dictionaryEntries'),
    where('isPublished', '==', true),
    orderBy('englishText'),
    limit(200),
  )

  const snapshot = await getDocs(entriesQuery)
  const keyword = search.trim().toLowerCase()

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as DictionaryEntry)
    .filter((item) => {
      if (!keyword) {
        return true
      }

      return (
        item.englishText.toLowerCase().includes(keyword) ||
        item.kasemText.toLowerCase().includes(keyword) ||
        item.alternateKasemTerms?.toLowerCase().includes(keyword) ||
        item.dialect.toLowerCase().includes(keyword) ||
        item.partOfSpeech.toLowerCase().includes(keyword)
      )
    })
}

export const listContributions = async (
  status?: ReviewStatus,
): Promise<Contribution[]> => {
  const baseQuery = status
    ? query(
        collection(db, 'contributions'),
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
      )
    : query(collection(db, 'contributions'), orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(baseQuery)
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as Contribution,
  )
}

export const listUserContributions = async (
  userId: string,
): Promise<Contribution[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'contributions'),
      where('contributorId', '==', userId),
    ),
  )

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Contribution)
    .sort(
      (first, second) =>
        (second.createdAt?.toMillis() ?? 0) -
        (first.createdAt?.toMillis() ?? 0),
    )
}

export const approveContribution = async (
  contributionId: string,
  actor: { id: string; email: string },
): Promise<void> => {
  const contributionRef = doc(db, 'contributions', contributionId)
  const contributionSnapshot = await getDoc(contributionRef)

  if (!contributionSnapshot.exists()) {
    throw new Error('Contribution not found.')
  }

  const contribution = contributionSnapshot.data() as Contribution
  const wasAlreadyApproved = contribution.status === 'approved'

  await updateDoc(contributionRef, {
    status: 'approved',
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
    reviewNotes: '',
    updatedAt: serverTimestamp(),
  })

  await syncPublicDashboardMetrics({
    approvedEntries: increment(1),
    pendingReview: increment(-1),
  })

  const dictionaryRef = doc(db, 'dictionaryEntries', contributionId)
  await setDoc(dictionaryRef, {
    englishText: contribution.englishText,
    kasemText: contribution.kasemText,
    alternateKasemTerms: contribution.alternateKasemTerms ?? '',
    englishExample: contribution.englishExample,
    kasemExample: contribution.kasemExample,
    dialect: contribution.dialect,
    partOfSpeech: contribution.partOfSpeech,
    category: contribution.category,
    wordUseRules: contribution.wordUseRules ?? '',
    sourceContributionId: contributionId,
    contributorId: contribution.contributorId,
    approvedBy: actor.id,
    approvedAt: serverTimestamp(),
    createdAt: contribution.createdAt,
    updatedAt: serverTimestamp(),
    isPublished: true,
  })

  if (!wasAlreadyApproved) {
    await updateLeaderboardPoints(
      contribution.contributorId,
      pointsForContributionApproval(contribution),
      1,
    )
  }

  await createAuditLog({
    action: 'CONTRIBUTION_APPROVED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'contributions',
    targetId: contributionId,
    details: { status: 'approved' },
    createdAt: null,
  })
}

export const rejectContribution = async (
  contributionId: string,
  actor: { id: string; email: string },
  reviewNotes: string,
): Promise<void> => {
  const contributionRef = doc(db, 'contributions', contributionId)
  const contributionSnapshot = await getDoc(contributionRef)
  const contribution = contributionSnapshot.exists()
    ? (contributionSnapshot.data() as Contribution)
    : null

  await updateDoc(contributionRef, {
    status: 'rejected',
    reviewNotes,
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await syncPublicDashboardMetrics({
    pendingReview: increment(-1),
  })

  if (contribution?.status === 'approved') {
    await updateLeaderboardPoints(
      contribution.contributorId,
      -pointsForContributionApproval(contribution),
      -1,
    )
  }

  await createAuditLog({
    action: 'CONTRIBUTION_REJECTED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'contributions',
    targetId: contributionId,
    details: { reviewNotes },
    createdAt: null,
  })
}

export const updateUserRoleAndStatus = async (
  userId: string,
  role: UserRole,
  status: UserStatus,
  actor: { id: string; email: string },
): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    role,
    status,
    updatedAt: serverTimestamp(),
  })

  await createAuditLog({
    action: 'USER_ROLE_UPDATED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'users',
    targetId: userId,
    details: { role, status },
    createdAt: null,
  })
}

export const createUploadRecord = async (
  payload: Omit<UploadRecord, 'id' | 'createdAt' | 'reviewedAt'>,
): Promise<string> => {
  const uploadRef = await addDoc(collection(db, 'uploads'), {
    ...payload,
    isPublished: payload.isPublished ?? false,
    reviewedAt: null,
    createdAt: serverTimestamp(),
  })

  return uploadRef.id
}

export const reviewUpload = async (
  uploadId: string,
  status: Extract<ReviewStatus, 'approved' | 'rejected'>,
  reviewNotes: string,
  actor: { id: string; email: string },
): Promise<void> => {
  const uploadRef = doc(db, 'uploads', uploadId)
  const uploadSnapshot = await getDoc(uploadRef)
  const upload = uploadSnapshot.exists()
    ? (uploadSnapshot.data() as UploadRecord)
    : null
  const wasPublished = upload?.isPublished ?? false
  const shouldPublish =
    status === 'approved' &&
    upload?.culturalSensitivity !== 'private_archive' &&
    upload?.culturalSensitivity !== 'restricted' &&
    upload?.consentStatus !== 'pending'
  const wasAlreadyApproved = upload?.status === 'approved'

  await updateDoc(uploadRef, {
    status,
    isPublished: shouldPublish,
    reviewNotes,
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
  })

  if (!wasPublished && shouldPublish) {
    await syncPublicDashboardMetrics({
      approvedMediaItems: increment(1),
    })
  }

  if (wasPublished && !shouldPublish) {
    await syncPublicDashboardMetrics({
      approvedMediaItems: increment(-1),
    })
  }

  if (status === 'approved' && upload && !wasAlreadyApproved) {
    await updateLeaderboardPoints(upload.uploadedBy, uploadApprovalPoints, 1)
  }

  if (status === 'rejected' && upload && wasAlreadyApproved) {
    await updateLeaderboardPoints(upload.uploadedBy, -uploadApprovalPoints, -1)
  }

  await createAuditLog({
    action: status === 'approved' ? 'UPLOAD_APPROVED' : 'UPLOAD_REJECTED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'uploads',
    targetId: uploadId,
    details: { status, reviewNotes },
    createdAt: null,
  })
}

export const listUploads = async (): Promise<UploadRecord[]> => {
  const snapshot = await getDocs(
    query(collection(db, 'uploads'), orderBy('createdAt', 'desc')),
  )
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as UploadRecord,
  )
}

export const listUserUploads = async (
  userId: string,
): Promise<UploadRecord[]> => {
  const snapshot = await getDocs(
    query(collection(db, 'uploads'), where('uploadedBy', '==', userId)),
  )

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as UploadRecord)
    .sort(
      (first, second) =>
        (second.createdAt?.toMillis() ?? 0) -
        (first.createdAt?.toMillis() ?? 0),
    )
}

export const listApprovedUploads = async (): Promise<UploadRecord[]> => {
  const snapshot = await getDocs(
    query(collection(db, 'uploads'), where('isPublished', '==', true)),
  )

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as UploadRecord)
    .sort(
      (first, second) =>
        (second.createdAt?.toMillis() ?? 0) -
        (first.createdAt?.toMillis() ?? 0),
    )
}

export const listUsers = async (): Promise<
  Array<{
    id: string
    displayName: string
    email: string
    role: UserRole
    status: UserStatus
  }>
> => {
  const snapshot = await getDocs(
    query(collection(db, 'users'), orderBy('displayName')),
  )
  return snapshot.docs.map((item) => {
    const data = item.data() as {
      displayName: string
      email: string
      role: UserRole
      status: UserStatus
    }
    return {
      id: item.id,
      displayName: data.displayName,
      email: data.email,
      role: data.role,
      status: data.status,
    }
  })
}

export const upsertDictionaryEntry = async (
  entryId: string,
  payload: Omit<DictionaryEntry, 'id' | 'createdAt' | 'updatedAt'>,
  actor: { id: string; email: string },
): Promise<void> => {
  const entryRef = doc(db, 'dictionaryEntries', entryId)
  await setDoc(
    entryRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )

  await createAuditLog({
    action: 'DICTIONARY_ENTRY_UPDATED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'dictionaryEntries',
    targetId: entryId,
    details: { isPublished: payload.isPublished },
    createdAt: null,
  })
}

export const unpublishDictionaryEntry = async (
  entryId: string,
  actor: { id: string; email: string },
): Promise<void> => {
  await updateDoc(doc(db, 'dictionaryEntries', entryId), {
    isPublished: false,
    updatedAt: serverTimestamp(),
  })

  await createAuditLog({
    action: 'DICTIONARY_ENTRY_UNPUBLISHED',
    actorId: actor.id,
    actorEmail: actor.email,
    targetCollection: 'dictionaryEntries',
    targetId: entryId,
    details: { isPublished: false },
    createdAt: null,
  })
}

export const getPublicDashboardMetrics =
  async (): Promise<PublicDashboardMetrics> => {
    const snapshot = await getDoc(publicDashboardMetricsRef)

    if (!snapshot.exists()) {
      return {
        totalSubmissions: 0,
        approvedEntries: 0,
        pendingReview: 0,
        activeContributors: 0,
        approvedMediaItems: 0,
      }
    }

    const data = snapshot.data() as Partial<PublicDashboardMetrics>

    return {
      totalSubmissions: data.totalSubmissions ?? 0,
      approvedEntries: data.approvedEntries ?? 0,
      pendingReview: data.pendingReview ?? 0,
      activeContributors: data.activeContributors ?? 0,
      approvedMediaItems: data.approvedMediaItems ?? 0,
    }
  }

export const setPublicDashboardMetrics = async (
  metrics: PublicDashboardMetrics,
): Promise<void> => {
  await setDoc(publicDashboardMetricsRef, metrics, { merge: true })
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const [
    users,
    totalContributions,
    pendingContributions,
    approvedContributions,
    rejectedContributions,
    uploads,
    pendingUploads,
    approvedUploads,
    approvedEntries,
  ] = await Promise.all([
    getCountFromServer(collection(db, 'users')),
    getCountFromServer(collection(db, 'contributions')),
    getCountFromServer(
      query(collection(db, 'contributions'), where('status', '==', 'pending')),
    ),
    getCountFromServer(
      query(collection(db, 'contributions'), where('status', '==', 'approved')),
    ),
    getCountFromServer(
      query(collection(db, 'contributions'), where('status', '==', 'rejected')),
    ),
    getCountFromServer(collection(db, 'uploads')),
    getCountFromServer(
      query(collection(db, 'uploads'), where('status', '==', 'pending')),
    ),
    getCountFromServer(
      query(collection(db, 'uploads'), where('isPublished', '==', true)),
    ),
    getCountFromServer(
      query(
        collection(db, 'dictionaryEntries'),
        where('isPublished', '==', true),
      ),
    ),
  ])

  return {
    totalUsers: users.data().count,
    totalContributions: totalContributions.data().count,
    pendingContributions: pendingContributions.data().count,
    approvedContributions: approvedContributions.data().count,
    rejectedContributions: rejectedContributions.data().count,
    totalUploads: uploads.data().count,
    pendingUploads: pendingUploads.data().count,
    approvedUploads: approvedUploads.data().count,
    approvedDictionaryEntries: approvedEntries.data().count,
  }
}

export const getRecentContributions = async (): Promise<Contribution[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'contributions'),
      orderBy('createdAt', 'desc'),
      limit(5),
    ),
  )

  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as Contribution,
  )
}

export const getAppSettings = async (): Promise<AppSettings | null> => {
  const snapshot = await getDoc(doc(db, 'settings', 'app'))
  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data() as AppSettings
}

export const upsertAppSettings = async (
  payload: Omit<AppSettings, 'updatedAt'>,
): Promise<void> => {
  await setDoc(
    doc(db, 'settings', 'app'),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const createAuditLog = async (payload: AuditLog): Promise<void> => {
  await addDoc(collection(db, 'auditLogs'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
}
