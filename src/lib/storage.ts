import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../config/firebase'
import { validateFile } from './validators'

export const uploadContributionFile = async (
  uid: string,
  contributionId: string,
  file: File,
) => {
  const validation = validateFile(file)
  if (validation) {
    throw new Error(validation)
  }

  const storagePath = `contributions/${uid}/${contributionId}/${file.name}`
  const fileRef = ref(storage, storagePath)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)

  return {
    name: file.name,
    url,
    storagePath,
    contentType: file.type,
    size: file.size,
  }
}

export const uploadGeneralFile = async (
  uid: string,
  uploadId: string,
  file: File,
) => {
  const validation = validateFile(file)
  if (validation) {
    throw new Error(validation)
  }

  const storagePath = `uploads/${uid}/${uploadId}/${file.name}`
  const fileRef = ref(storage, storagePath)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)

  return {
    fileName: file.name,
    fileUrl: url,
    storagePath,
    contentType: file.type,
    size: file.size,
  }
}
