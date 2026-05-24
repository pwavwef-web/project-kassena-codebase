declare module 'firebase/storage' {
  export function getStorage(app?: any): any
  export function ref(storage: any, path: string): any
  export function uploadBytes(ref: any, data: any): Promise<any>
  export function getDownloadURL(ref: any): Promise<string>
}
