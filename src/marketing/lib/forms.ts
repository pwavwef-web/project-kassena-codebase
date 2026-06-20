import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../config/firebase'
import { site } from '../../content/site'

export interface FormResult {
  ok: boolean
  error?: string
}

export type EnquiryType =
  | 'general'
  | 'partnership'
  | 'research'
  | 'media'
  | 'data-drive'
  | 'technical'
  | 'funding'
  | 'cultural-correction'
  | 'data-protection'

export interface ContactPayload {
  name: string
  email: string
  enquiryType: EnquiryType
  organization?: string
  subject?: string
  message: string
  /** Honeypot — if filled, silently drop (bot). */
  website?: string
}

const fallbackError = `We could not submit your message right now. Please email us at ${site.contact.generalEmail}.`

/** Newsletter / updates opt-in. Writes to Firestore when configured. */
export const subscribeToUpdates = async (
  email: string,
  source = 'website',
): Promise<FormResult> => {
  if (!isFirebaseConfigured) {
    return {
      ok: false,
      error: `Subscriptions are not available right now. Please email ${site.contact.generalEmail}.`,
    }
  }
  try {
    await addDoc(collection(db, 'newsletterSubscribers'), {
      email,
      source,
      createdAt: serverTimestamp(),
    })
    return { ok: true }
  } catch {
    return { ok: false, error: fallbackError }
  }
}

/** Contact / partnership / enquiry submissions. */
export const submitContactMessage = async (
  payload: ContactPayload,
): Promise<FormResult> => {
  // Honeypot: pretend success so bots don't retry, but write nothing.
  if (payload.website && payload.website.trim().length > 0) {
    return { ok: true }
  }
  if (!isFirebaseConfigured) {
    return { ok: false, error: fallbackError }
  }
  try {
    await addDoc(collection(db, 'contactMessages'), {
      name: payload.name.trim(),
      email: payload.email.trim(),
      enquiryType: payload.enquiryType,
      organization: payload.organization?.trim() ?? '',
      subject: payload.subject?.trim() ?? '',
      message: payload.message.trim(),
      status: 'new',
      createdAt: serverTimestamp(),
    })
    return { ok: true }
  } catch {
    return { ok: false, error: fallbackError }
  }
}
