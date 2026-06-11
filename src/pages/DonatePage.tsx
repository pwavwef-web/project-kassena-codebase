import { type FormEvent, type ReactNode, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AppIcon } from '../components/common/AppIcon'
import { useAuth } from '../hooks/useAuth'
import {
  initializePayment,
  isPaystackConfigured,
  recordDonation,
} from '../services/paystack'
import type { DonationTier } from '../types'

const tierLabels: Record<DonationTier, string> = {
  'community-supporter': 'Community Supporter',
  'cultural-guardian': 'Cultural Guardian',
  'data-drive': 'Data Drive Sponsor',
  custom: 'Strategic Supporter',
  'language-champion': 'Language Champion',
  'language-friend': 'Language Friend',
  'strategic-supporter': 'Strategic Supporter',
}

const tierIds = Object.keys(tierLabels) as DonationTier[]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GH', {
    currency: 'GHS',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Math.max(0, value))

const getDonationTier = (value: string | null): DonationTier =>
  value && tierIds.includes(value as DonationTier)
    ? (value as DonationTier)
    : 'custom'

const createReference = () =>
  `PK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

export const DonatePage = () => {
  const { appUser, firebaseUser } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialTier = useMemo(
    () => getDonationTier(searchParams.get('tier')),
    [searchParams],
  )
  const initialAmount = Math.max(10, Number(searchParams.get('amount')) || 50)
  const [form, setForm] = useState({
    amount: String(initialAmount),
    anonymous: false,
    country: 'Ghana',
    email: appUser?.email || firebaseUser?.email || '',
    message: '',
    name: appUser?.displayName || firebaseUser?.displayName || '',
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const amount = Math.max(10, Number(form.amount) || 10)

  const updateForm = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isPaystackConfigured()) {
      setStatusMessage(
        'Secure payment is not configured yet. Add VITE_PAYSTACK_PUBLIC_KEY to enable Paystack.',
      )
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Preparing secure payment...')

    const reference = createReference()

    try {
      const donationId = await recordDonation({
        amount,
        anonymous: form.anonymous,
        country: form.country.trim(),
        currency: 'GHS',
        email: form.email.trim(),
        message: form.message.trim(),
        name: form.name.trim(),
        publicDisplay: !form.anonymous,
        reference,
        status: 'pending',
        tier: initialTier,
        userId: firebaseUser?.uid ?? null,
      })

      await initializePayment({
        amount,
        donationId,
        email: form.email.trim(),
        fullName: form.name.trim(),
        metadata: {
          donationId,
          message: form.message.trim(),
          tier: initialTier,
        },
        onClose: () => {
          setIsSubmitting(false)
          setStatusMessage('Payment window closed.')
        },
        onFailure: (result) => {
          setIsSubmitting(false)
          setStatusMessage(result.message || 'Payment was not completed.')
        },
        onSuccess: (result) => {
          setIsSubmitting(false)
          const params = new URLSearchParams({
            amount: String(result.amount || amount),
            reference: result.reference,
            status: result.status,
            tier: initialTier,
          })

          navigate(`/support/success?${params.toString()}`, {
            state: {
              amount: result.amount || amount,
              reference: result.reference,
              status: result.status,
              tier: initialTier,
            },
          })
        },
        reference,
      })
    } catch (error) {
      setIsSubmitting(false)
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Donation checkout could not be started.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-8 text-[#13231a] sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-[#eadcc7] bg-white p-5 shadow-[0_18px_46px_rgba(88,55,22,0.08)] sm:p-6">
          <Link
            to="/support"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8cbb8] px-3 text-sm font-black text-kassena-green transition hover:bg-[#fffaf0]"
          >
            <AppIcon name="arrow-left" className="h-4 w-4" />
            Support hub
          </Link>
          <div className="mt-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
              Secure Donation
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#13231a]">
              Continue Your Support
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Your donation will be recorded as pending, then verified through
              Paystack before it is counted toward the preservation campaign.
            </p>
          </div>

          <form onSubmit={submitDonation} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  className="min-h-12 rounded-lg border border-[#d8cbb8] px-3 font-medium outline-none focus:border-kassena-green"
                />
              </Field>
              <Field label="Email Address">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm('email', event.target.value)}
                  className="min-h-12 rounded-lg border border-[#d8cbb8] px-3 font-medium outline-none focus:border-kassena-green"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Country">
                <input
                  required
                  value={form.country}
                  onChange={(event) =>
                    updateForm('country', event.target.value)
                  }
                  className="min-h-12 rounded-lg border border-[#d8cbb8] px-3 font-medium outline-none focus:border-kassena-green"
                />
              </Field>
              <Field label="Amount">
                <div className="flex min-h-12 items-center rounded-lg border border-[#d8cbb8] bg-white px-3 focus-within:border-kassena-green">
                  <span className="text-sm font-black text-slate-500">GHS</span>
                  <input
                    required
                    min={10}
                    type="number"
                    value={form.amount}
                    onChange={(event) =>
                      updateForm('amount', event.target.value)
                    }
                    className="w-full bg-transparent px-2 font-black outline-none"
                  />
                </div>
              </Field>
            </div>

            <Field label="Message (Optional)">
              <textarea
                value={form.message}
                rows={4}
                onChange={(event) => updateForm('message', event.target.value)}
                className="rounded-lg border border-[#d8cbb8] px-3 py-2 font-medium outline-none focus:border-kassena-green"
              />
            </Field>

            <label className="flex items-center gap-3 rounded-lg border border-[#eadcc7] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.anonymous}
                onChange={(event) =>
                  updateForm('anonymous', event.target.checked)
                }
                className="h-5 w-5 accent-kassena-green"
              />
              Make my donation anonymous
            </label>

            {statusMessage ? (
              <p className="rounded-lg bg-[#fffaf0] px-4 py-3 text-sm font-bold text-kassena-green">
                {statusMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-kassena-orange px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(201,106,45,0.22)] transition hover:bg-[#b95e25] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <AppIcon name="shield" className="h-5 w-5" />
              {isSubmitting
                ? 'Opening Secure Payment...'
                : 'Continue To Secure Payment'}
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <article className="rounded-lg border border-[#eadcc7] bg-[#173323] p-5 text-white shadow-[0_18px_46px_rgba(20,83,45,0.16)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-kassena-gold">
              Donation Summary
            </p>
            <h2 className="mt-3 text-2xl font-black">
              {tierLabels[initialTier]}
            </h2>
            <p className="mt-2 text-4xl font-black text-kassena-gold">
              {formatCurrency(amount)}
            </p>
            <p className="mt-4 text-sm leading-6 text-kassena-cream">
              This support helps fund contributor rewards, validator work,
              community data drives, and future AI-ready Kasem resources.
            </p>
          </article>

          <article className="rounded-lg border border-[#eadcc7] bg-white p-5">
            <h2 className="font-black text-[#13231a]">Estimated Impact</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-slate-700">
              <ImpactLine
                label="Verified entries"
                value={Math.max(1, Math.floor(amount / 25) * 5)}
              />
              <ImpactLine
                label="Contributor access days"
                value={Math.max(1, Math.floor(amount / 10))}
              />
              <ImpactLine
                label="Validation support units"
                value={Math.max(1, Math.floor(amount / 100))}
              />
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}

const Field = ({ children, label }: { children: ReactNode; label: string }) => (
  <label className="grid gap-1 text-sm font-bold text-[#13231a]">
    {label}
    {children}
  </label>
)

const ImpactLine = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg bg-[#fffaf0] px-3 py-2">
    <span>{label}</span>
    <span className="text-kassena-green">{value}</span>
  </div>
)
