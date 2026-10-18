import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore'

const requiredEnv = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
} as const

type FirebaseConfigKey = keyof typeof requiredEnv

const rawConfig: Record<FirebaseConfigKey | 'measurementId', string | undefined> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const isUsableValue = (value: string | undefined): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  !value.trim().startsWith('your_')

const missingKeys = Object.entries(requiredEnv)
  .filter(([configKey]) => !isUsableValue(rawConfig[configKey as FirebaseConfigKey]))
  .map(([, envKey]) => envKey)

export const firebaseConfigStatus = {
  isConfigured: missingKeys.length === 0,
  missingKeys,
}

const createFirebaseConfig = (): FirebaseOptions => ({
  apiKey: rawConfig.apiKey,
  authDomain: rawConfig.authDomain,
  projectId: rawConfig.projectId,
  storageBucket: rawConfig.storageBucket,
  messagingSenderId: rawConfig.messagingSenderId,
  appId: rawConfig.appId,
  measurementId: rawConfig.measurementId,
})

const app: FirebaseApp | null = firebaseConfigStatus.isConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(createFirebaseConfig())
  : null

export const firebaseApp = app
export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null

let emulatorsConnected = false

if (
  app &&
  auth &&
  db &&
  import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true' &&
  typeof window !== 'undefined' &&
  !emulatorsConnected
) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  emulatorsConnected = true
}
