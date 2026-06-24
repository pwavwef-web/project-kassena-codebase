import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { datasetTarget } from '../../content/roadmap'
import {
  fundingAllocations,
  governanceCommitments,
  milestones,
  publicDocuments,
} from '../../content/transparency'
import { events, track } from '../lib/analytics'
import { usePublicStats } from '../lib/usePublicStats'
import { Seo } from '../lib/seo'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { Glyph } from '../components/ui/Glyph'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const milestoneStatusStyles: Record<
  'done' | 'in-progress' | 'planned',
  { label: string; pill: string; dot: string }
> = {
  done: {
    label: 'Live',
    pill: 'bg-savannah-100 text-savannah-700 ring-savannah-200',
    dot: 'bg-savannah-500',
  },
  'in-progress': {
    label: 'In progress',
    pill: 'bg-kente-100 text-kente-800 ring-kente-200',
    dot: 'bg-kente-500',
  },
  planned: {
    label: 'Planned',
    pill: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500',
  },
}

export const TransparencyPage = () => {
  const stats = usePublicStats()

  const liveApproved = stats.dashboard?.approvedEntries ?? null
  const liveContributors = stats.dashboard?.activeContributors ?? null
  const livePending = stats.dashboard?.pendingReview ?? null

  // Only public documents are ever exposed. Confidential drafts are filtered out.
  const visibleDocuments = publicDocuments.filter(
    (doc) => doc.isPublic && doc.classification === 'public',
  )

  return (
    <>
      <Seo
        title="Transparency & Reports"
        description="How Project Kasena governs Kasem language data — community ownership, consent and attribution — with live progress counts, an illustrative use-of-funds breakdown and a registry of public reports."
        path="/transparency"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Transparency & Reports — Project Kasena',
            url: `${site.url}/transparency`,
            description:
              'Governance commitments, build milestones, live progress counts and public reports for Project Kasena.',
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-24 top-0 h-72 w-72 rounded-full bg-savannah-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Transparency &amp; reports
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                Built in the open, accountable to the{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  community
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                A language belongs to the people who speak it. This page shows how
                we govern Kasem language data, what we have built so far, and how we
                intend to direct effort and any funds raised — with honest status
                labels and live counts, not invented numbers.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to="#reports" variant="gold" size="lg">
                  View public reports
                </Button>
                <Button
                  to="#governance"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  Our commitments
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero quick facts */}
          <Reveal delay={0.2} className="relative">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kente-300">
                At a glance
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <dt className="text-xs font-medium text-cream-200/70">
                    Approved entries
                  </dt>
                  <dd className="mt-1 font-display text-fluid-xl font-bold text-cream-100">
                    {liveApproved !== null ? (
                      <AnimatedCounter value={liveApproved} />
                    ) : (
                      '—'
                    )}
                  </dd>
                  <dd className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-savannah-300">
                    {liveApproved !== null ? 'Live count' : 'Live count loading'}
                  </dd>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <dt className="text-xs font-medium text-cream-200/70">
                    Phase-1 target
                  </dt>
                  <dd className="mt-1 font-display text-fluid-xl font-bold text-cream-100">
                    {datasetTarget.min.toLocaleString()}+
                  </dd>
                  <dd className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-kente-300">
                    Project target
                  </dd>
                </div>
              </dl>
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-cream-200/70">
                <span className="mt-0.5 text-kente-400">
                  <Glyph name="shield" className="h-4 w-4" />
                </span>
                Live figures come directly from the platform. Targets are always
                labelled as targets.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================= LIVE STATS BAND ===================== */}
      <Section tone="cream" spacing="md">
        <SectionHeader
          eyebrow="Live progress"
          title="The numbers, stated honestly"
          description="Current counts are pulled live from the platform. Where a figure is a goal, it is clearly labelled as a project target — never presented as achieved."
          align="center"
          className="mx-auto"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <div className="h-full rounded-2xl border border-savannah-200 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-fluid-2xl font-bold text-savannah-700">
                {liveApproved !== null ? (
                  <AnimatedCounter value={liveApproved} />
                ) : (
                  '—'
                )}
              </p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                Approved entries
              </p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-savannah-600">
                {liveApproved !== null ? 'Current verified count' : 'Live count loading'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="h-full rounded-2xl border border-savannah-200 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-fluid-2xl font-bold text-savannah-700">
                {liveContributors !== null ? (
                  <AnimatedCounter value={liveContributors} />
                ) : (
                  '—'
                )}
              </p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                Active contributors
              </p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-savannah-600">
                {liveContributors !== null ? 'Live count' : 'Live count loading'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl border border-kente-200 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-fluid-2xl font-bold text-kente-700">
                {livePending !== null ? (
                  <AnimatedCounter value={livePending} />
                ) : (
                  '—'
                )}
              </p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                In validation
              </p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-kente-700">
                {livePending !== null ? 'Awaiting review' : 'Live count loading'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="h-full rounded-2xl border border-indigo-100 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-fluid-2xl font-bold text-indigo-800">
                <AnimatedCounter value={datasetTarget.max} suffix="" />
              </p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                Validated entries
              </p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal-muted">
                Phase-1 project target
              </p>
            </div>
          </Reveal>
        </div>
        {stats.unavailable ? (
          <Reveal className="mt-6 text-center">
            <p className="mx-auto max-w-2xl rounded-xl border border-indigo-100 bg-white px-4 py-3 text-xs text-charcoal-muted">
              Live counts are temporarily unavailable. Target figures shown above
              are clearly labelled as project targets.
            </p>
          </Reveal>
        ) : null}
      </Section>

      {/* ======================== MILESTONES ======================== */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow="Build progress"
          title="Milestones, in honest terms"
          description="What is live, what is in progress, and what is still a target. We do not present future work as finished."
        />
        <ol className="mt-12 space-y-4">
          {milestones.map((milestone, i) => {
            const style = milestoneStatusStyles[milestone.status]
            return (
              <Reveal as="li" key={milestone.id} delay={i * 0.05}>
                <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-cream-50 p-6 sm:flex-row sm:items-start">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                    <Glyph name={milestone.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-bold text-indigo-900">
                        {milestone.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.pill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                      {milestone.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600 sm:pt-1.5">
                    {milestone.period}
                  </span>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </Section>

      {/* ====================== GOVERNANCE ========================== */}
      <Section tone="indigo" spacing="lg" id="governance">
        <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow="Governance commitments"
            title="How we hold ourselves accountable"
            description="These are commitments we make to Kasem speakers — not claims of external audit or certification. They guide every decision about what is collected and how it is used."
            tone="dark"
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {governanceCommitments.map((commitment) => (
              <RevealItem
                key={commitment.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                  <Glyph name={commitment.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-cream-100">
                  {commitment.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/80">
                  {commitment.description}
                </p>
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="mt-8">
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-cream-200/80">
              <span className="font-semibold text-kente-300">
                Cultural care:{' '}
              </span>
              Sacred or restricted knowledge is not collected, and contributions
              are gathered with consent and attribution.{' '}
              <Link
                to="/heritage"
                className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
              >
                See how heritage is handled →
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ====================== USE OF FUNDS ======================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="Use of funds"
          title="Where effort and support are directed"
          description="An illustrative allocation showing how we intend to direct effort and any funds raised. These percentages are a clearly-labelled project target — not a reported budget — and contain no claimed money figures."
        />

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-soft">
            {/* Stacked allocation bar */}
            <div className="flex h-4 w-full overflow-hidden" role="presentation">
              {fundingAllocations.map((item) => (
                <div
                  key={item.id}
                  className={item.colorClass}
                  style={{ width: `${item.percent}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-indigo-700">
                Illustrative allocation · Project target
              </span>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {fundingAllocations.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span
                      className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${item.colorClass}`}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-bold text-indigo-900">
                          {item.label}
                        </h3>
                        <span className="font-display text-sm font-bold text-terracotta-600">
                          {item.percent}%
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-indigo-100 pt-4 text-xs text-charcoal-muted">
                Figures are indicative percentages only. Actual use of funds will
                be reported transparently in published reports as the project
                matures.{' '}
                <Link
                  to="/support"
                  className="pk-focus font-semibold text-terracotta-600 hover:underline"
                >
                  How support works →
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ====================== PUBLIC REPORTS ====================== */}
      <Section tone="white" spacing="lg" id="reports">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Public reports"
            title="Document registry"
            description="Only documents released for public access appear here. Confidential drafts are never listed."
          />
        </div>

        {visibleDocuments.length > 0 ? (
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleDocuments.map((doc) => (
              <RevealItem
                key={doc.id}
                className="group flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                    <Glyph name="data" className="h-5 w-5" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-savannah-100 px-2.5 py-1 text-xs font-semibold text-savannah-700 ring-1 ring-inset ring-savannah-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-savannah-500" />
                    Public
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                  {doc.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
                  {doc.description}
                </p>
                <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-muted">
                  <div className="flex gap-1">
                    <dt className="font-semibold text-indigo-900">Published</dt>
                    <dd>{doc.publicationDate}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold text-indigo-900">Version</dt>
                    <dd>{doc.version}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold text-indigo-900">Type</dt>
                    <dd>{doc.fileType}</dd>
                  </div>
                </dl>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track(events.reportDownload, {
                      report: doc.id,
                      type: doc.fileType,
                    })
                  }
                  className="pk-focus mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-indigo-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  <Glyph name="upload" className="h-4 w-4 rotate-180" />
                  View / download
                </a>
              </RevealItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-indigo-200 bg-cream-50 p-10 text-center sm:p-16">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <Glyph name="data" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-fluid-lg font-bold text-indigo-900">
                Public reports will appear here as they are released
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-charcoal-muted">
                We are still preparing our first public progress and governance
                reports. When a document is released for public access, it will be
                listed here with its publication date, version and a download link.
                Confidential drafts are never shown.
              </p>
              <div className="mt-7 flex justify-center">
                <ArrowLink to="/contact">Ask about an upcoming report</ArrowLink>
              </div>
            </div>
          </Reveal>
        )}
      </Section>

      {/* ========================= CLOSING CTA ====================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-kente-400" opacity={0.08} />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="text-kente-400">
            <Glyph name="shield" className="mx-auto h-8 w-8" />
          </span>
          <h2 className="mt-6 text-balance font-display text-fluid-3xl font-bold leading-[1.15] text-cream-100">
            Accountability is part of the work, not an afterthought
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-cream-200/80">
            Have a question about how we govern data, where support goes, or what we
            have published? We would rather you ask.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/contact"
              variant="gold"
              size="lg"
              onClick={() => track(events.contactSubmit, { source: 'transparency' })}
            >
              Ask the team
            </Button>
            <Button
              to="/support"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
              onClick={() => track(events.supportView, { source: 'transparency' })}
            >
              See how support works
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
