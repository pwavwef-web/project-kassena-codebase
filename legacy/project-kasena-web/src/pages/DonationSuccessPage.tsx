import { useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AppIcon } from '../components/common/AppIcon'
import type { DonationTier } from '../types'

interface DonationSuccessState {
  amount?: number
  reference?: string
  status?: string
  tier?: DonationTier
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GH', {
    currency: 'GHS',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Math.max(0, value))

export const DonationSuccessPage = () => {
  const [params] = useSearchParams()
  const location = useLocation()
  const state = (location.state || {}) as DonationSuccessState
  const [shareMessage, setShareMessage] = useState('')

  const amount = Number(state.amount || params.get('amount') || 0)
  const reference = state.reference || params.get('reference') || 'Pending'
  const status = state.status || params.get('status') || 'pending'
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    [],
  )
  const estimatedEntries = Math.max(1, Math.floor(amount / 25) * 5)

  const shareProject = async () => {
    const url = `${window.location.origin}/support`
    const text =
      'I supported Project Kasena to help preserve the Kasem language for future generations.'

    try {
      if (navigator.share) {
        await navigator.share({
          text,
          title: 'Support Project Kasena',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setShareMessage('Project link copied.')
      }
    } catch {
      setShareMessage('Share was not completed.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-10 text-[#13231a] sm:px-6">
      <section className="mx-auto max-w-4xl rounded-lg border border-[#eadcc7] bg-white p-5 text-center shadow-[0_22px_60px_rgba(88,55,22,0.1)] sm:p-8">
        <div className="mx-auto grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-[#173323] via-kassena-green to-[#c96a2d] p-5 shadow-[0_20px_50px_rgba(20,83,45,0.24)]">
          <div className="relative h-full w-full">
            <span className="absolute inset-x-8 bottom-5 h-16 rounded-t-full bg-[#7a4a1d]" />
            <span className="absolute inset-x-2 bottom-16 h-16 rounded-full border-[18px] border-kassena-gold/90" />
            <span className="absolute left-1/2 top-8 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
              <AppIcon name="book" className="h-8 w-8" />
            </span>
            <span className="absolute bottom-8 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
              <AppIcon name="heart" className="h-7 w-7" />
            </span>
            <span className="absolute bottom-8 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
              <AppIcon name="leaf" className="h-7 w-7" />
            </span>
          </div>
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
          Donation {status === 'paid' ? 'Verified' : 'Received'}
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#13231a] sm:text-4xl">
          Thank You For Supporting Project Kasena
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Your contribution helps preserve the Kasem language and empowers
          future generations.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
          <ReceiptItem label="Amount" value={formatCurrency(amount)} />
          <ReceiptItem label="Reference" value={reference} />
          <ReceiptItem label="Date" value={dateLabel} />
          <ReceiptItem
            label="Estimated Impact"
            value={`${estimatedEntries} entries`}
          />
        </div>

        {status !== 'paid' ? (
          <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            Payment verification is pending. The campaign total updates after
            Paystack verification completes.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/support"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-kassena-green px-5 text-sm font-black text-white transition hover:bg-[#0f4325]"
          >
            <AppIcon name="analytics" className="h-5 w-5" />
            View Project Impact
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#d8cbb8] px-5 text-sm font-black text-kassena-green transition hover:bg-[#fffaf0]"
          >
            <AppIcon name="home" className="h-5 w-5" />
            Return Home
          </Link>
          <button
            type="button"
            onClick={shareProject}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-kassena-orange px-5 text-sm font-black text-kassena-orange transition hover:bg-orange-50"
          >
            <AppIcon name="share" className="h-5 w-5" />
            Share Project
          </button>
        </div>
        {shareMessage ? (
          <p className="mt-4 text-sm font-bold text-kassena-green">
            {shareMessage}
          </p>
        ) : null}
      </section>
    </div>
  )
}

const ReceiptItem = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-lg border border-[#eadcc7] bg-[#fffaf0] p-3">
    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-black text-[#13231a]">
      {value}
    </p>
  </article>
)
