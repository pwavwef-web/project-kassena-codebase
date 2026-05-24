import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type {
  AppSettings,
  AuditLog,
  Contribution,
  DashboardMetrics,
  DictionaryEntry,
  FileMetadata,
  ReviewStatus,
  UploadRecord,
  UserRole,
  UserStatus,
} from '../types'

export const createContribution = async (
  payload: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt' | 'reviewedAt'>,
): Promise<string> => {
  const contributionRef = await addDoc(collection(db, 'contributions'), {
    ...payload,
    reviewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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

  await updateDoc(contributionRef, {
    status: 'approved',
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
    reviewNotes: '',
    updatedAt: serverTimestamp(),
  })

  const dictionaryRef = doc(db, 'dictionaryEntries', contributionId)
  await setDoc(dictionaryRef, {
    englishText: contribution.englishText,
    kasemText: contribution.kasemText,
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
  await updateDoc(doc(db, 'contributions', contributionId), {
    status: 'rejected',
    reviewNotes,
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

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
  await updateDoc(doc(db, 'uploads', uploadId), {
    status,
    reviewNotes,
    reviewedBy: actor.id,
    reviewedAt: serverTimestamp(),
  })

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

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const [
    users,
    totalContributions,
    pendingContributions,
    approvedContributions,
    rejectedContributions,
    uploads,
    pendingUploads,
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
