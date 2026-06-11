import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'
import { createDonation } from '../lib/firestore'
import type { Donation } from '../types'

type PaystackStatus = 'paid' | 'pending' | 'failed'

interface PaystackSetupOptions {
  key: string
  email: string
  amount: number
  currency: 'GHS'
  ref: string
  firstname?: string
  lastname?: string
  metadata?: Record<string, unknown>
  callback: (response: {
    reference?: string
    trans?: string
    status?: string
  }) => void
  onClose: () => void
}

interface PaystackPopApi {
  setup: (options: PaystackSetupOptions) => {
    openIframe: () => void
  }
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopApi
  }
}

export type DonationRecordPayload = Omit<
  Donation,
  'id' | 'createdAt' | 'updatedAt'
>

export interface PaymentVerificationResult {
  status: PaystackStatus
  reference: string
  amount?: number
  paidAt?: string
  message?: string
}

interface PaymentInitializationPayload {
  amount: number
  donationId: string
  email: string
  fullName: string
  metadata?: Record<string, unknown>
  onClose?: () => void
  onFailure?: (result: PaymentVerificationResult) => void
  onSuccess?: (result: PaymentVerificationResult) => void
  reference: string
}

const paystackScriptUrl = 'https://js.paystack.co/v1/inline.js'

let paystackScriptPromise: Promise<void> | null = null

const getPaystackPublicKey = () =>
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim() ?? ''

export const isPaystackConfigured = () => Boolean(getPaystackPublicKey())

const loadPaystackScript = (): Promise<void> => {
  if (window.PaystackPop) {
    return Promise.resolve()
  }

  if (paystackScriptPromise) {
    return paystackScriptPromise
  }

  paystackScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${paystackScriptUrl}"]`,
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Paystack could not be loaded.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = paystackScriptUrl
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Paystack could not be loaded.'))
    document.head.appendChild(script)
  })

  return paystackScriptPromise
}

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const [firstname, ...rest] = parts

  return {
    firstname: firstname ?? 'Project',
    lastname: rest.join(' ') || 'Kasena Supporter',
  }
}

export const recordDonation = async (
  payload: DonationRecordPayload,
): Promise<string> => createDonation(payload)

export const verifyTransaction = async (
  donationId: string,
  reference: string,
): Promise<PaymentVerificationResult> => {
  const verifyDonation = httpsCallable<
    { donationId: string; reference: string },
    PaymentVerificationResult
  >(functions, 'verifyPaystackDonation')

  try {
    const result = await verifyDonation({ donationId, reference })
    return result.data
  } catch (error) {
    return {
      status: 'pending',
      reference,
      message:
        error instanceof Error
          ? error.message
          : 'Payment verification could not be completed.',
    }
  }
}

export const handleSuccess = async ({
  donationId,
  reference,
}: {
  donationId: string
  reference: string
}): Promise<PaymentVerificationResult> =>
  verifyTransaction(donationId, reference)

export const handleFailure = (
  reference: string,
  message = 'Payment was not completed.',
): PaymentVerificationResult => ({
  status: 'failed',
  reference,
  message,
})

export const initializePayment = async ({
  amount,
  donationId,
  email,
  fullName,
  metadata,
  onClose,
  onFailure,
  onSuccess,
  reference,
}: PaymentInitializationPayload): Promise<void> => {
  const publicKey = getPaystackPublicKey()

  if (!publicKey) {
    throw new Error('VITE_PAYSTACK_PUBLIC_KEY is not configured.')
  }

  await loadPaystackScript()

  if (!window.PaystackPop) {
    throw new Error('Paystack is unavailable. Please try again.')
  }

  const { firstname, lastname } = splitName(fullName)
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(amount * 100),
    currency: 'GHS',
    ref: reference,
    firstname,
    lastname,
    metadata,
    callback: (response) => {
      const paymentReference = response.reference || reference

      void handleSuccess({ donationId, reference: paymentReference })
        .then((result) => onSuccess?.(result))
        .catch((error) => {
          onFailure?.(
            handleFailure(
              paymentReference,
              error instanceof Error
                ? error.message
                : 'Payment verification failed.',
            ),
          )
        })
    },
    onClose: () => {
      onClose?.()
      onFailure?.(handleFailure(reference, 'Payment window was closed.'))
    },
  })

  handler.openIframe()
}
