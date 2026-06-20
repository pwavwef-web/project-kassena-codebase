import { Link } from 'react-router-dom'
import { audiences, impactCategories, targetMetrics } from '../../content/impact'
import { site } from '../../content/site'
import type { MetricKind } from '../../content/site'
import { Seo } from '../lib/seo'
import { usePublicStats } from '../lib/usePublicStats'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { MetricLabel } from '../components/ui/StatusBadge'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

/** A single figure rendered in the statistics band. */
interface StatTile {
  key: string
  value: number | null
  prefix?: string
  suffix?: string
  label: string
  kind: MetricKind
  caption: string
}

export const ImpactPage = () => {
  const stats = usePublicStats()
  const { dashboard, campaign, loading, unavailable } = stats

  // ── LIVE figures (read directly from the platform; never fabricated). ──────
  const liveTiles: StatTile[] = []
  if (dashboard) {
    liveTiles.push({
      key: 'approved-entries',
      value: dashboard.approvedEntries,
      label: 'Approved entries',
      kind: 'current',
      caption: 'Validated words live in the dictionary right now.',
    })
    liveTiles.push({
      key: 'active-contributors',
      value: dashboard.activeContributors,
      label: 'Active contributors',
      kind: 'current',
      caption: 'People adding and reviewing Kasem this period.',
    })
  }
  if (campaign && campaign.communitiesReached > 0) {
    liveTiles.push({
      key: 'communities',
      value: campaign.communitiesReached,
      label: 'Communities reached',
      kind: 'current',
      caption: 'Towns and villages touched by data drives.',
    })
  }

  // ── TARGET figures (always labelled as targets / in-progress). ────────────
  const targetTiles: StatTile[] = targetMetrics.map((metric) => ({
    key: metric.id,
    value: metric.value,
    prefix: metric.prefix,
    suffix: metric.suffix,
    label: metric.label,
    kind: metric.kind,
    caption: metric.caption,
  }))

  return (
    <>
      <Seo
        title="Community & Impact"
        description="Project Kasena serves Kasem speakers, students, elders, researchers and communities. See who the project is for, the change it aims to create, and live counts alongside clearly-labelled targets."
        path="/impact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Community & Impact — Project Kasena',
            url: `${site.url}/impact`,
            description:
              'Who Project Kasena serves, the impact it aims to create, and honest live counts versus targets.',
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-700 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.06} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-20 -top-10 h-72 w-72 rounded-full bg-kente-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-terracotta-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Community &amp; Impact
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                A language kept alive{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  by the people who speak it
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/85">
                Project Kasena exists for real people — speakers and families,
                students and teachers, elders and researchers. This is who the
                work serves, the change it aims to create, and how progress is
                measured honestly.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to="/contributions" variant="gold" size="lg">
                  Become a contributor
                </Button>
                <Button
                  to="/partners"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  Partner with us
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero stat preview card */}
          <Reveal delay={0.2} className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kente-300">
                Live from the platform
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="font-display text-fluid-3xl font-bold text-cream-100">
                    {dashboard ? (
                      <AnimatedCounter value={dashboard.approvedEntries} />
                    ) : (
                      <span aria-hidden="true">—</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cream-100">
                    Approved entries
                  </p>
                  <p className="mt-1">
                    <MetricLabel
                      kind={dashboard ? 'current' : 'in-progress'}
                      className="text-kente-300"
                    />
                  </p>
                </div>
                <div>
                  <p className="font-display text-fluid-3xl font-bold text-cream-100">
                    {dashboard ? (
                      <AnimatedCounter value={dashboard.activeContributors} />
                    ) : (
                      <span aria-hidden="true">—</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cream-100">
                    Active contributors
                  </p>
                  <p className="mt-1">
                    <MetricLabel
                      kind={dashboard ? 'current' : 'in-progress'}
                      className="text-kente-300"
                    />
                  </p>
                </div>
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-xs text-cream-200/70">
                {loading
                  ? 'Loading live counts…'
                  : dashboard
                    ? 'Real counts read directly from the platform. No numbers are invented.'
                    : 'Live counts are unavailable right now. Targets below are clearly labelled as targets.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== WHO WE SERVE ======================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="Who the project serves"
          title="Built with — and for — the Kasem community"
          description="Project Kasena is shaped around the people who carry the language forward. Each group has a role, and each has something to gain."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <RevealItem
              key={audience.title}
              className="group flex flex-col rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <Glyph name={audience.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                {audience.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {audience.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ==================== IMPACT CATEGORIES ===================== */}
      <Section tone="white" spacing="lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="The change we aim to create"
            title="Six kinds of impact, one shared foundation"
            description="These are the outcomes the project is working toward. They describe intended impact and direction, not claims of completed achievement."
          />
          <Reveal className="shrink-0">
            <ArrowLink to="/contributions">Help make it happen</ArrowLink>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {impactCategories.map((category, i) => (
            <RevealItem
              key={category.title}
              className="relative flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6"
            >
              <span className="font-display text-3xl font-bold text-indigo-200">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-indigo-900">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {category.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ==================== STATISTICS BAND ====================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow="By the numbers"
            title="Live counts and honest targets"
            description="Current figures are read directly from the platform. Targets are clearly labelled as targets — never presented as numbers already achieved."
            align="center"
            tone="dark"
            className="mx-auto"
          />

          {/* Live current counts (only rendered when real data exists). */}
          {liveTiles.length > 0 ? (
            <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liveTiles.map((tile, i) => (
                <Reveal key={tile.key} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-kente-500/30 bg-white/[0.05] p-6 text-center">
                    <p className="font-display text-fluid-3xl font-bold text-kente-300">
                      <AnimatedCounter
                        value={tile.value ?? 0}
                        prefix={tile.prefix}
                        suffix={tile.suffix}
                      />
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-cream-100">
                      {tile.label}
                    </p>
                    <p className="mt-1">
                      <MetricLabel kind={tile.kind} className="text-kente-300" />
                    </p>
                    <p className="mt-2 text-xs text-cream-200/70">{tile.caption}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto mt-10 max-w-2xl">
              <p
                role="status"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-sm text-cream-200/80"
              >
                {loading
                  ? 'Loading live counts from the platform…'
                  : 'Live counts are unavailable right now. The figures below are clearly-labelled targets, not achieved numbers.'}
              </p>
            </Reveal>
          )}

          {/* Target figures — always labelled. */}
          <div className="mx-auto mt-6 grid max-w-5xl gap-5 sm:grid-cols-3">
            {targetTiles.map((tile, i) => (
              <Reveal key={tile.key} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <p className="font-display text-fluid-3xl font-bold text-cream-100">
                    <AnimatedCounter
                      value={tile.value ?? 0}
                      prefix={tile.prefix}
                      suffix={tile.suffix}
                    />
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-cream-100">
                    {tile.label}
                  </p>
                  <p className="mt-1">
                    <MetricLabel
                      kind={tile.kind}
                      className={
                        tile.kind === 'in-progress'
                          ? 'text-kente-300'
                          : 'text-cream-200/70'
                      }
                    />
                  </p>
                  <p className="mt-2 text-xs text-cream-200/70">{tile.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center">
            <p className="text-xs text-cream-200/70">
              {unavailable
                ? 'Note: live counts could not be loaded — only targets are shown above.'
                : 'Targets are labelled as targets. Live counts come directly from the platform.'}{' '}
              <Link
                to="/transparency"
                className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
              >
                See transparency &amp; reports →
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ==================== CONSENT & CARE ======================= */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="Impact done responsibly"
            title="Knowledge shared with consent, attribution and care"
            description="Reaching people is only part of the goal. The project is built so that cultural knowledge is contributed willingly, credited to its source, and never used to expose sacred or restricted material."
          />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            <RevealItem className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Glyph name="shield" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-indigo-900">
                Consent first
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                Contributions are shared willingly, and contributors keep a say
                in how their knowledge is used.
              </p>
            </RevealItem>
            <RevealItem className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-savannah-100 text-savannah-700">
                <Glyph name="user" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-indigo-900">
                Attribution
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                Sources and validators are recognised, so credit stays with the
                people who carry the language.
              </p>
            </RevealItem>
            <RevealItem className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <Glyph name="leaf" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-indigo-900">
                Respect for the sacred
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                Sacred or restricted material is not collected or published — the
                archive holds shareable language, not secrets.
              </p>
            </RevealItem>
            <RevealItem className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-kente-100 text-kente-800">
                <Glyph name="check" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-indigo-900">
                Community validation
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                Entries are reviewed by speakers and custodians before they count
                as verified.
              </p>
            </RevealItem>
          </Stagger>
        </div>
      </Section>

      {/* ======================= CLOSING CTA ======================= */}
      <Section tone="white" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer
              variant="sirigu"
              color="text-cream-100"
              opacity={0.06}
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-2xl">
                <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                  Join the work
                </Eyebrow>
                <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                  Impact is something a community builds together
                </h2>
                <p className="mt-4 text-pretty text-cream-200/85">
                  Whether you speak Kasem, teach it, research it, or want to back
                  the people who do — there is a place for you. Add verified words
                  as a contributor, or help the project grow as a partner.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button to="/contributions" variant="gold" size="lg" fullWidth>
                  Become a contributor
                </Button>
                <Button
                  to="/partners"
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-white/25 bg-white/10 text-cream-100 hover:bg-white/20"
                >
                  Explore partnerships
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
