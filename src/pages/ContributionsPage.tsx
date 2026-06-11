import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppIcon } from '../components/common/AppIcon'
import {
  getDefaultCampaignMetrics,
  subscribeToCampaignMetrics,
} from '../lib/firestore'
import type { CampaignMetrics } from '../types'

const ArrowIcon = () => <AppIcon name="chevron-right" className="h-6 w-6" />

const UploadIcon = () => <AppIcon name="upload" className="h-full w-full" />

const DictionaryIcon = () => <AppIcon name="book" className="h-full w-full" />

const SupportIcon = () => (
  <span className="relative flex h-full w-full items-center justify-center">
    <AppIcon
      name="leaf"
      className="absolute h-9 w-9 translate-x-2 translate-y-1"
    />
    <AppIcon
      name="book"
      className="absolute h-7 w-7 -translate-x-2 translate-y-2"
    />
    <AppIcon name="heart" className="relative h-9 w-9 -translate-y-1" />
  </span>
)

const currencyFormatter = new Intl.NumberFormat('en-GH', {
  currency: 'GHS',
  maximumFractionDigits: 0,
  style: 'currency',
})

export const ContributionsPage = () => {
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics>(
    getDefaultCampaignMetrics(),
  )

  useEffect(
    () =>
      subscribeToCampaignMetrics(
        (metrics) => setCampaignMetrics(metrics),
        () => setCampaignMetrics(getDefaultCampaignMetrics()),
      ),
    [],
  )

  return (
    <section className="mx-auto max-w-[460px] space-y-5 md:max-w-6xl">
      <div className="rounded-[24px] bg-[#173323] p-5 text-white shadow-[0_24px_60px_rgba(20,83,45,0.22)] md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kassena-gold">
          Preserve Kasem
        </p>
        <h1 className="mt-2 text-3xl font-black">Contributions</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-kassena-cream/85">
          Choose how you want to help today. Upload source materials for review
          or add a dictionary contribution for validators to approve.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(20,83,45,0.09)] ring-1 ring-kassena-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-kassena-gold/20 text-[#6d5114] ring-1 ring-kassena-gold/20">
            <UploadIcon />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#173323]">
            Upload materials
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share audio, documents, field notes, or cultural files that can
            strengthen the Kasem language archive.
          </p>
          <Link
            to="/uploads"
            className="mt-5 flex items-center justify-between rounded-2xl bg-kassena-orange px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(201,106,45,0.22)] transition-transform active:scale-[0.98]"
          >
            Upload
            <ArrowIcon />
          </Link>
        </article>

        <article className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(20,83,45,0.09)] ring-1 ring-kassena-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-50 text-kassena-green ring-1 ring-emerald-100">
            <DictionaryIcon />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#173323]">
            Dictionary contributions
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add Kasem words, translations, examples, dialect notes, and cultural
            usage details for community validation.
          </p>
          <Link
            to="/submit"
            className="mt-5 flex items-center justify-between rounded-2xl bg-kassena-green px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(20,83,45,0.22)] transition-transform active:scale-[0.98]"
          >
            Add dictionary entry
            <ArrowIcon />
          </Link>
        </article>

        <article className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(20,83,45,0.09)] ring-1 ring-kassena-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-rose-50 text-kassena-orange ring-1 ring-rose-100">
            <SupportIcon />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#173323]">
            Support Project Kasena
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Help preserve the Kasem language by funding contributor rewards,
            validator activities, community data drives, and future AI
            development.
          </p>
          <div className="mt-4 grid gap-2 rounded-2xl bg-[#fffaf2] p-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-500">GHS Raised</span>
              <span className="font-black text-kassena-green">
                {currencyFormatter.format(campaignMetrics.totalRaised)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-500">
                Contributors Supported
              </span>
              <span className="font-black text-kassena-green">
                {campaignMetrics.contributorsFunded}
              </span>
            </div>
          </div>
          <Link
            to="/support"
            className="mt-5 flex items-center justify-between rounded-2xl bg-[#173323] px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(20,83,45,0.22)] transition-transform active:scale-[0.98]"
          >
            Support Now
            <ArrowIcon />
          </Link>
        </article>
      </div>
    </section>
  )
}
