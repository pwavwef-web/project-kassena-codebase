import { getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { defineSecret } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import {
  DONATION_EMAIL_SMTP_PASS,
  sendDonationThankYouEmail,
} from './sendDonationThankYouEmail.js'

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

type DonationThankYouPayload = {
  amount: number
  date: string
  email: string
  name: string
  reference: string
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

const getOptionalString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const getThankYouEmailStatus = (value: unknown): string => {
  if (!value || typeof value !== 'object' || !('status' in value)) {
    return ''
  }

  const status = (value as { status?: unknown }).status

  return typeof status === 'string' ? status : ''
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

export const verifyPaystackDonation = onCall(
  { secrets: [PAYSTACK_SECRET_KEY, DONATION_EMAIL_SMTP_PASS] },
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
    const paidAt = body.data?.paid_at || new Date().toISOString()
    let thankYouEmailPayload: DonationThankYouPayload | null = null
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
      const thankYouEmailStatus = getThankYouEmailStatus(
        donation.thankYouEmail,
      )
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

      if (verifiedStatus === 'paid' && thankYouEmailStatus !== 'sent') {
        const donorEmail = getOptionalString(donation.email)

        if (donorEmail) {
          thankYouEmailPayload = {
            amount: verifiedAmount,
            date: paidAt,
            email: donorEmail,
            name:
              getOptionalString(donation.name) || 'Project Kasena Supporter',
            reference,
          }
        } else {
          logger.warn(
            'Donation paid but no donor email found; thank-you email skipped.',
            {
              donationId,
              reference,
            },
          )
        }
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

    if (thankYouEmailPayload) {
      try {
        const delivery = await sendDonationThankYouEmail(thankYouEmailPayload)

        await donationRef.set(
          {
            thankYouEmail: {
              attempts: delivery.attempts,
              messageId: delivery.messageId || null,
              sentAt: FieldValue.serverTimestamp(),
              status: 'sent',
              updatedAt: FieldValue.serverTimestamp(),
            },
          },
          { merge: true },
        )

        logger.info('Donation thank-you email delivery recorded.', {
          attempts: delivery.attempts,
          donationId,
          reference,
        })
      } catch (error) {
        logger.error('Donation thank-you email could not be delivered.', {
          donationId,
          error: getErrorMessage(error),
          reference,
        })

        await donationRef
          .set(
            {
              thankYouEmail: {
                attempts: 3,
                error: getErrorMessage(error),
                failedAt: FieldValue.serverTimestamp(),
                status: 'failed',
                updatedAt: FieldValue.serverTimestamp(),
              },
            },
            { merge: true },
          )
          .catch((statusError) => {
            logger.error(
              'Failed to record donation thank-you email status.',
              {
                donationId,
                error: getErrorMessage(statusError),
                reference,
              },
            )
          })
      }
    }

    return {
      amount: verifiedAmount,
      paidAt: body.data?.paid_at,
      reference,
      status: verifiedStatus,
    }
  },
)
