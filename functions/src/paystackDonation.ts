import { getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'

const PAYSTACK_SECRET_KEY = defineSecret('PAYSTACK_SECRET_KEY')
const DEFAULT_CAMPAIGN_GOAL = 25000

if (!getApps().length) {
  initializeApp()
}

interface PaystackVerifyResponse {
  status: boolean
  message?: string
  data?: {
    amount?: number
    currency?: string
    paid_at?: string
    reference?: string
    status?: string
  }
}

const db = getFirestore()

const toGhs = (amountInPesewas?: number): number =>
  typeof amountInPesewas === 'number' && Number.isFinite(amountInPesewas)
    ? amountInPesewas / 100
    : 0

const getRequiredString = (
  payload: Record<string, unknown>,
  field: 'donationId' | 'reference',
): string => {
  const value = payload[field]

  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpsError('invalid-argument', `${field} is required.`)
  }

  return value.trim()
}

export const verifyPaystackDonation = onCall(
  { secrets: [PAYSTACK_SECRET_KEY] },
  async (request) => {
    const payload =
      request.data && typeof request.data === 'object'
        ? (request.data as Record<string, unknown>)
        : {}
    const donationId = getRequiredString(payload, 'donationId')
    const reference = getRequiredString(payload, 'reference')
    const secretKey = PAYSTACK_SECRET_KEY.value()

    if (!secretKey) {
      throw new HttpsError(
        'failed-precondition',
        'PAYSTACK_SECRET_KEY is not configured.',
      )
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    )
    const body = (await response.json()) as PaystackVerifyResponse

    if (!response.ok || !body.status) {
      logger.warn('Paystack verification failed.', {
        donationId,
        message: body.message,
        reference,
      })
      throw new HttpsError(
        'failed-precondition',
        body.message || 'Payment could not be verified.',
      )
    }

    const verifiedStatus = body.data?.status === 'success' ? 'paid' : 'failed'
    let verifiedAmount = toGhs(body.data?.amount)
    const donationRef = db.collection('donations').doc(donationId)
    const metricsRef = db.collection('campaignMetrics').doc('overview')
    const publicSupporterRef = db.collection('publicSupporters').doc(donationId)

    await db.runTransaction(async (transaction) => {
      const donationSnapshot = await transaction.get(donationRef)

      if (!donationSnapshot.exists) {
        throw new HttpsError('not-found', 'Donation record was not found.')
      }

      const donation = donationSnapshot.data() || {}

      if (donation.reference !== reference) {
        throw new HttpsError(
          'permission-denied',
          'Payment reference does not match the donation record.',
        )
      }

      const previousStatus = donation.status
      verifiedAmount =
        typeof donation.amount === 'number' && Number.isFinite(donation.amount)
          ? donation.amount
          : verifiedAmount

      transaction.update(donationRef, {
        paystackStatus: body.data?.status || 'unknown',
        paymentProvider: 'paystack',
        status: verifiedStatus,
        updatedAt: FieldValue.serverTimestamp(),
        verifiedAt: FieldValue.serverTimestamp(),
      })

      if (verifiedStatus === 'paid' && previousStatus !== 'paid') {
        transaction.set(
          metricsRef,
          {
            contributorsFunded: FieldValue.increment(
              verifiedAmount >= 50 ? 1 : 0,
            ),
            entriesSupported: FieldValue.increment(
              Math.max(1, Math.floor(verifiedAmount / 25) * 5),
            ),
            goalAmount: DEFAULT_CAMPAIGN_GOAL,
            totalRaised: FieldValue.increment(verifiedAmount),
            updatedAt: FieldValue.serverTimestamp(),
            validatorsFunded: FieldValue.increment(
              verifiedAmount >= 100 ? 1 : 0,
            ),
          },
          { merge: true },
        )
      }

      if (verifiedStatus === 'paid' && donation.publicDisplay === true) {
        transaction.set(
          publicSupporterRef,
          {
            amount: verifiedAmount,
            createdAt: FieldValue.serverTimestamp(),
            currency: 'GHS',
            donationId,
            name:
              typeof donation.name === 'string' && donation.name.trim()
                ? donation.name.trim()
                : 'Project Kasena Supporter',
            reference,
            tier:
              typeof donation.tier === 'string' && donation.tier
                ? donation.tier
                : 'custom',
          },
          { merge: true },
        )
      }
    })

    return {
      amount: verifiedAmount,
      paidAt: body.data?.paid_at,
      reference,
      status: verifiedStatus,
    }
  },
)
