declare module 'firebase/storage' {
  type FirebaseStorage = unknown
  type StorageReference = unknown
  type UploadData = Blob | Uint8Array | ArrayBuffer

  export function getStorage(app?: unknown): FirebaseStorage
  export function ref(storage: FirebaseStorage, path: string): StorageReference
  export function uploadBytes(
    ref: StorageReference,
    data: UploadData,
  ): Promise<unknown>
  export function getDownloadURL(ref: StorageReference): Promise<string>
}
