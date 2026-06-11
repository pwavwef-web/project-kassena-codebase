import { motion } from 'framer-motion'
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { AppIcon } from '../components/common/AppIcon'
import {
  createSponsorLead,
  getDefaultCampaignMetrics,
  subscribeToCampaignMetrics,
  subscribeToPublicDashboardMetrics,
  subscribeToRecentSupporters,
} from '../lib/firestore'
import type {
  CampaignMetrics,
  PublicDashboardMetrics,
  PublicSupporter,
} from '../types'

type DonationTierCard = {
  id:
    | 'language-friend'
    | 'community-supporter'
    | 'language-champion'
    | 'cultural-guardian'
  title: string
  amount: number
  impact: string
  recommended?: boolean
}

type SponsorPackage = {
  title: string
  amount: number
  packageName: string
  benefits: string[]
}

const publicStatsDefault: PublicDashboardMetrics = {
  activeContributors: 0,
  approvedEntries: 0,
  approvedMediaItems: 0,
  pendingReview: 0,
  totalSubmissions: 0,
}

const donationTiers: DonationTierCard[] = [
  {
    id: 'language-friend',
    title: 'Language Friend',
    amount: 10,
    impact: 'Provides data access for a contributor.',
  },
  {
    id: 'community-supporter',
    title: 'Community Supporter',
    amount: 25,
    impact: 'Funds 5 verified entries.',
  },
  {
    id: 'language-champion',
    title: 'Language Champion',
    amount: 50,
    impact: 'Sponsors one student contributor.',
    recommended: true,
  },
  {
    id: 'cultural-guardian',
    title: 'Cultural Guardian',
    amount: 100,
    impact: 'Supports elder validation.',
  },
]

const sponsorPackages: SponsorPackage[] = [
  {
    title: 'School Data Drive',
    amount: 1000,
    packageName: 'school-data-drive',
    benefits: ['Recognition', 'Impact report', 'Sponsor listing'],
  },
  {
    title: 'Community Data Drive',
    amount: 2500,
    packageName: 'community-data-drive',
    benefits: ['Featured sponsor', 'Project report', 'Community recognition'],
  },
  {
    title: 'Language Preservation Partner',
    amount: 5000,
    packageName: 'language-preservation-partner',
    benefits: [
      'Strategic partner status',
      'Quarterly reports',
      'Public recognition',
      'Future collaboration opportunities',
    ],
  },
]

const transparencyRows = [
  { label: 'Contributor Rewards', value: 40, color: '#c96a2d' },
  { label: 'Validators', value: 32, color: '#14532d' },
  { label: 'Community Outreach', value: 16, color: '#caa54a' },
  { label: 'Technology Operations', value: 12, color: '#2563eb' },
]

const faqItems = [
  {
    question: 'How are donations used?',
    answer:
      'Donations support contributor rewards, validator time, community outreach, data drives, hosting, tooling, and responsible AI readiness work.',
  },
  {
    question: 'Can I sponsor a specific initiative?',
    answer:
      'Yes. Organizations can sponsor school data drives, community data drives, validation work, or strategic preservation initiatives.',
  },
  {
    question: 'Can organizations partner?',
    answer:
      'Yes. Schools, NGOs, assemblies, companies, alumni groups, and cultural organizations can partner through the data-drive sponsorship packages.',
  },
  {
    question: 'Are donations refundable?',
    answer:
      'Refund requests are reviewed case by case. Project Kasena will publish clear donor support contacts before public fundraising launches.',
  },
  {
    question: 'How can I receive impact reports?',
    answer:
      'Sponsors can request reports through the inquiry form. Individual donors can include a message and email to receive future updates.',
  },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GH', {
    currency: 'GHS',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Math.max(0, value))

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(Math.max(0, Math.round(value)))

const useCountUp = (target: number, duration = 1100) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frameId = 0
    const startedAt = performance.now()

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      setValue(Math.round(target * progress))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [duration, target])

  return value
}

const heroPattern = {
  backgroundImage:
    'linear-gradient(135deg, rgba(255,255,255,0.08) 12.5%, transparent 12.5%, transparent 50%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.08) 62.5%, transparent 62.5%, transparent 100%)',
  backgroundSize: '44px 44px',
}

export const SupportPage = () => {
  const navigate = useNavigate()
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics>(
    getDefaultCampaignMetrics(),
  )
  const [publicStats, setPublicStats] =
    useState<PublicDashboardMetrics>(publicStatsDefault)
  const [supporters, setSupporters] = useState<PublicSupporter[]>([])
  const [customAmount, setCustomAmount] = useState('150')
  const [activeTransparency, setActiveTransparency] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<SponsorPackage | null>(
    null,
  )
  const [sponsorForm, setSponsorForm] = useState({
    contactEmail: '',
    contactName: '',
    message: '',
    organization: '',
  })
  const [sponsorStatus, setSponsorStatus] = useState('')

  useEffect(
    () =>
      subscribeToCampaignMetrics(
        (metrics) => setCampaignMetrics(metrics),
        () => setCampaignMetrics(getDefaultCampaignMetrics()),
      ),
    [],
  )

  useEffect(
    () =>
      subscribeToPublicDashboardMetrics(
        (metrics) => setPublicStats(metrics),
        () => setPublicStats(publicStatsDefault),
      ),
    [],
  )

  useEffect(
    () =>
      subscribeToRecentSupporters(
        (items) => setSupporters(items),
        () => setSupporters([]),
      ),
    [],
  )

  const liveMetrics = useMemo(
    () => [
      {
        label: 'Words Collected',
        value: campaignMetrics.wordsCollected || publicStats.totalSubmissions,
      },
      {
        label: 'Validated Entries',
        value: campaignMetrics.validatedEntries || publicStats.approvedEntries,
      },
      {
        label: 'Contributors',
        value: campaignMetrics.contributors || publicStats.activeContributors,
      },
      {
        label: 'Communities Reached',
        value:
          campaignMetrics.communitiesReached || campaignMetrics.schoolsReached,
      },
    ],
    [campaignMetrics, publicStats],
  )

  const goalAmount = campaignMetrics.goalAmount || 25000
  const raisedAmount = campaignMetrics.totalRaised
  const percentComplete = Math.min(100, (raisedAmount / goalAmount) * 100)
  const remainingAmount = Math.max(0, goalAmount - raisedAmount)

  const openDonation = (amount?: number, tier = 'custom') => {
    const params = new URLSearchParams()
    params.set('tier', tier)

    if (amount) {
      params.set('amount', String(amount))
    }

    navigate(`/support/donate?${params.toString()}`)
  }

  const submitSponsorLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedPackage) return

    setSponsorStatus('Sending inquiry...')

    try {
      await createSponsorLead({
        amount: selectedPackage.amount,
        contactEmail: sponsorForm.contactEmail.trim(),
        contactName: sponsorForm.contactName.trim(),
        message: sponsorForm.message.trim(),
        organization: sponsorForm.organization.trim(),
        package: selectedPackage.packageName,
      })
      setSponsorStatus('Inquiry received. The project team can follow up.')
      setSponsorForm({
        contactEmail: '',
        contactName: '',
        message: '',
        organization: '',
      })
    } catch (error) {
      setSponsorStatus(
        error instanceof Error
          ? error.message
          : 'Sponsor inquiry could not be sent.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#13231a]">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#042616] via-[#14532d] to-[#3b2812] text-white">
        <div
          className="absolute inset-0 opacity-30 mix-blend-soft-light"
          style={heroPattern}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fffaf0] to-transparent" />
        <div className="relative mx-auto grid min-h-[min(760px,92vh)] max-w-6xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-center lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <span className="inline-flex rounded-full border border-kassena-gold/60 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-kassena-gold backdrop-blur">
              Preserve Language &bull; Empower People
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.03] sm:text-5xl lg:text-6xl">
              Help Preserve Kasem For Future Generations
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-kassena-cream/90 sm:text-lg">
              Project Kasena is building the first community-powered digital
              infrastructure for the Kasem language. Every contribution supports
              language preservation, cultural documentation, contributor
              rewards, elder validation, and future AI systems.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openDonation()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-kassena-orange px-5 text-sm font-black text-white shadow-[0_18px_36px_rgba(201,106,45,0.26)] transition hover:bg-[#b95e25] active:scale-[0.98]"
              >
                <AppIcon name="heart" className="h-5 w-5" />
                Donate Now
              </button>
              <a
                href="#data-drive"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
              >
                <AppIcon name="community" className="h-5 w-5" />
                Sponsor A Data Drive
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.65 }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            {liveMetrics.map((metric) => (
              <LiveMetric
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#fffaf0] px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="rounded-lg border border-[#eadcc7] bg-white p-5 shadow-[0_18px_46px_rgba(88,55,22,0.08)] sm:p-6"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
              Current Preservation Campaign
            </p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#13231a]">
                  Kasem Language Preservation Fund
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Funding goal: {formatCurrency(goalAmount)}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl font-black text-kassena-green">
                  {formatCurrency(raisedAmount)}
                </p>
                <p className="text-sm font-bold text-slate-500">
                  {percentComplete.toFixed(0)}% Complete
                </p>
              </div>
            </div>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-[#f4ebd7]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-kassena-orange via-kassena-gold to-kassena-green transition-all duration-700"
                style={{
                  width: `${Math.max(raisedAmount ? 2 : 0, percentComplete)}%`,
                }}
              />
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-600">
              <span>{formatCurrency(remainingAmount)} remaining</span>
              <span>Realtime Firebase campaign updates</span>
            </div>
          </motion.div>

          <ProjectedImpact metrics={campaignMetrics} />
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
                Donation Tiers
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#13231a]">
                Choose Your Impact
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Every cedi helps move a word, story, recording, or validation
              session into the permanent Kasem language archive.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {donationTiers.map((tier) => (
              <DonationTier
                key={tier.id}
                tier={tier}
                onDonate={() => openDonation(tier.amount, tier.id)}
              />
            ))}
            <article className="rounded-lg border border-[#eadcc7] bg-[#fffaf0] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-[#13231a]">
                  Strategic Supporter
                </h3>
                <AppIcon name="target" className="h-9 w-9" />
              </div>
              <label className="mt-5 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Custom Amount
              </label>
              <div className="mt-2 flex items-center rounded-lg border border-[#d8cbb8] bg-white px-3">
                <span className="text-sm font-black text-slate-500">GHS</span>
                <input
                  value={customAmount}
                  min={10}
                  type="number"
                  onChange={(event) => setCustomAmount(event.target.value)}
                  className="min-h-12 w-full bg-transparent px-2 text-xl font-black outline-none"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Minimum GHS 10.
              </p>
              <button
                type="button"
                onClick={() =>
                  openDonation(Number(customAmount) || 10, 'custom')
                }
                className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#13231a] px-4 text-sm font-black text-white transition hover:bg-kassena-green"
              >
                Donate Custom Amount
              </button>
            </article>
          </div>
        </div>
      </section>

      {supporters.length ? (
        <section className="bg-[#fffaf0] px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
              Recent Supporters
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {supporters.map((supporter) => (
                <article
                  key={supporter.id}
                  className="rounded-lg border border-[#eadcc7] bg-white p-4 shadow-sm"
                >
                  <p className="font-black text-[#13231a]">{supporter.name}</p>
                  <p className="mt-1 text-sm font-bold text-kassena-green">
                    {formatCurrency(supporter.amount)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
            Impact Dashboard
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#13231a]">
            Measurable Preservation Work
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'reward',
                label: 'Contributor Rewards Paid',
                value:
                  campaignMetrics.contributorRewardsPaid ||
                  Math.round(campaignMetrics.totalRaised * 0.4),
                currency: true,
              },
              {
                icon: 'shield',
                label: 'Validators Supported',
                value: campaignMetrics.validatorsFunded,
              },
              {
                icon: 'words',
                label: 'Words Preserved',
                value:
                  campaignMetrics.entriesSupported ||
                  publicStats.approvedEntries,
              },
              {
                icon: 'book',
                label: 'Stories Documented',
                value: campaignMetrics.storiesDocumented,
              },
              {
                icon: 'home',
                label: 'Schools Engaged',
                value: campaignMetrics.schoolsReached,
              },
              {
                icon: 'audio',
                label: 'Audio Hours Recorded',
                value: campaignMetrics.audioHoursRecorded,
              },
            ].map((item) => (
              <ImpactCard key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="data-drive" className="bg-[#fffaf0] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
              Sponsor A Data Drive
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#13231a]">
              Fund Community Collection At Scale
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Built for organizations, NGOs, assemblies, schools, and corporate
              sponsors who want a visible preservation partnership.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {sponsorPackages.map((item) => (
              <article
                key={item.packageName}
                className="rounded-lg border border-[#eadcc7] bg-white p-5 shadow-sm"
              >
                <h3 className="text-xl font-black text-[#13231a]">
                  {item.title}
                </h3>
                <p className="mt-2 text-2xl font-black text-kassena-green">
                  {item.amount >= 5000
                    ? `${formatCurrency(item.amount)}+`
                    : formatCurrency(item.amount)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {item.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <AppIcon name="check" className="h-4 w-4" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(item)
                    setSponsorStatus('')
                  }}
                  className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg border border-kassena-green px-4 text-sm font-black text-kassena-green transition hover:bg-kassena-green hover:text-white"
                >
                  Contact Project Team
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
              Transparency Center
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#13231a]">
              Where Your Donation Goes
            </h2>
            <div
              className="mt-6 aspect-square rounded-full"
              style={{
                background:
                  'conic-gradient(#c96a2d 0 40%, #14532d 40% 72%, #caa54a 72% 88%, #2563eb 88% 100%)',
              }}
            />
          </div>
          <div className="space-y-3">
            {[
              {
                title: 'Where Does My Donation Go?',
                body: (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {transparencyRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-2 rounded-lg bg-[#fffaf0] px-3 py-2"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="text-sm font-bold text-slate-700">
                          {row.label} {row.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: 'How Are Contributions Verified?',
                body: (
                  <p>
                    Community submissions are reviewed by validators, checked
                    against dialect context, and promoted only after approval.
                    Elder validation supports culturally sensitive entries.
                  </p>
                ),
              },
              {
                title: 'How Is Money Managed?',
                body: (
                  <p>
                    Campaign metrics, sponsor leads, and donation records live
                    in Firebase. Admin reporting, CSV exports, and impact
                    summaries make funding activity reviewable.
                  </p>
                ),
              },
            ].map((item, index) => (
              <Disclosure
                key={item.title}
                body={item.body}
                isOpen={activeTransparency === index}
                title={item.title}
                onToggle={() =>
                  setActiveTransparency(
                    activeTransparency === index ? -1 : index,
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-kassena-orange">
            FAQ
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-[#eadcc7] bg-white p-4"
              >
                <h3 className="font-black text-[#13231a]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedPackage ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 px-4 py-6">
          <button
            type="button"
            aria-label="Close sponsor inquiry"
            className="absolute inset-0 h-full w-full"
            onClick={() => setSelectedPackage(null)}
          />
          <motion.form
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={submitSponsorLead}
            className="relative z-10 w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-kassena-orange">
                  Sponsor Inquiry
                </p>
                <h2 className="mt-1 text-xl font-black text-[#13231a]">
                  {selectedPackage.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#eadcc7]"
                aria-label="Close"
              >
                <AppIcon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                ['organization', 'Organization'],
                ['contactName', 'Contact Name'],
                ['contactEmail', 'Email Address'],
              ].map(([name, label]) => (
                <label key={name} className="grid gap-1 text-sm font-bold">
                  {label}
                  <input
                    required
                    type={name === 'contactEmail' ? 'email' : 'text'}
                    value={sponsorForm[name as keyof typeof sponsorForm]}
                    onChange={(event) =>
                      setSponsorForm((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }))
                    }
                    className="min-h-11 rounded-lg border border-[#d8cbb8] px-3 font-medium outline-none focus:border-kassena-green"
                  />
                </label>
              ))}
              <label className="grid gap-1 text-sm font-bold">
                Message
                <textarea
                  value={sponsorForm.message}
                  onChange={(event) =>
                    setSponsorForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={4}
                  className="rounded-lg border border-[#d8cbb8] px-3 py-2 font-medium outline-none focus:border-kassena-green"
                />
              </label>
            </div>
            {sponsorStatus ? (
              <p className="mt-3 text-sm font-bold text-kassena-green">
                {sponsorStatus}
              </p>
            ) : null}
            <button
              type="submit"
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-lg bg-kassena-green px-4 text-sm font-black text-white transition hover:bg-[#0f4325]"
            >
              Send Sponsor Inquiry
            </button>
          </motion.form>
        </div>
      ) : null}
    </div>
  )
}

const LiveMetric = ({ label, value }: { label: string; value: number }) => {
  const count = useCountUp(value)

  return (
    <article className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
      <p className="text-3xl font-black text-kassena-gold">
        {formatNumber(count)}
      </p>
      <p className="mt-1 text-sm font-bold text-kassena-cream">{label}</p>
    </article>
  )
}

const ProjectedImpact = ({ metrics }: { metrics: CampaignMetrics }) => (
  <article className="rounded-lg border border-[#eadcc7] bg-[#173323] p-5 text-white shadow-[0_18px_46px_rgba(20,83,45,0.16)]">
    <p className="text-xs font-black uppercase tracking-[0.16em] text-kassena-gold">
      Projected Impact
    </p>
    <ul className="mt-4 space-y-3 text-sm leading-6 text-kassena-cream">
      <li>
        {formatNumber(metrics.entriesSupported || 17000)} additional entries
      </li>
      <li>{formatNumber(metrics.validatorsFunded || 4)} validators</li>
      <li>{formatNumber(metrics.schoolsReached || 3)} community drives</li>
    </ul>
  </article>
)

const DonationTier = ({
  onDonate,
  tier,
}: {
  onDonate: () => void
  tier: DonationTierCard
}) => (
  <article
    className={`relative rounded-lg border p-4 shadow-sm ${
      tier.recommended
        ? 'border-kassena-orange bg-[#fff8ee]'
        : 'border-[#eadcc7] bg-white'
    }`}
  >
    {tier.recommended ? (
      <span className="absolute right-3 top-3 rounded-full bg-kassena-orange px-2 py-1 text-[11px] font-black uppercase text-white">
        Recommended
      </span>
    ) : null}
    <AppIcon name="heart" className="h-10 w-10" />
    <h3 className="mt-4 pr-16 text-lg font-black text-[#13231a]">
      {tier.title}
    </h3>
    <p className="mt-2 text-3xl font-black text-kassena-green">
      {formatCurrency(tier.amount)}
    </p>
    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
      {tier.impact}
    </p>
    <button
      type="button"
      onClick={onDonate}
      className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-kassena-green px-4 text-sm font-black text-white transition hover:bg-[#0f4325]"
    >
      Donate GHS {tier.amount}
    </button>
  </article>
)

const ImpactCard = ({
  currency,
  icon,
  label,
  value,
}: {
  currency?: boolean
  icon: string
  label: string
  value: number
}) => (
  <article className="rounded-lg border border-[#eadcc7] bg-[#fffaf0] p-4">
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
        <AppIcon name={icon} className="h-8 w-8" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-black text-[#13231a]">
          {currency ? formatCurrency(value) : formatNumber(value)}
        </p>
        <p className="text-sm font-bold text-slate-600">{label}</p>
      </div>
    </div>
  </article>
)

const Disclosure = ({
  body,
  isOpen,
  onToggle,
  title,
}: {
  body: ReactNode
  isOpen: boolean
  onToggle: () => void
  title: string
}) => (
  <article className="rounded-lg border border-[#eadcc7] bg-[#fffaf0]">
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left font-black text-[#13231a]"
    >
      <span>{title}</span>
      <AppIcon name={isOpen ? 'close' : 'chevron-right'} className="h-5 w-5" />
    </button>
    {isOpen ? (
      <div className="border-t border-[#eadcc7] px-4 py-4 text-sm leading-6 text-slate-600">
        {body}
      </div>
    ) : null}
  </article>
)
