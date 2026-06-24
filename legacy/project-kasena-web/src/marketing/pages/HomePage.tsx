import { Link } from 'react-router-dom'
import { home } from '../../content/home'
import { howItWorksSteps } from '../../content/howItWorks'
import { audiences, targetMetrics } from '../../content/impact'
import { products } from '../../content/products'
import { datasetTarget, roadmapPhases } from '../../content/roadmap'
import { site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { usePublicStats } from '../lib/usePublicStats'
import { Seo } from '../lib/seo'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { ProductStatusBadge } from '../components/ui/StatusBadge'
import { AnimatedWordNetwork } from '../components/visuals/AnimatedWordNetwork'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const marqueeTokens = [
  'Kasɛm',
  'verified data',
  'dialect-aware',
  'elder-validated',
  'naŋa',
  'open collaboration',
  'báláŋ',
  'community-owned',
  'wↄ́',
  'AI-ready',
  'proverbs',
  'tᵾ',
]

export const HomePage = () => {
  const stats = usePublicStats()
  const featuredProducts = products
    .filter((p) =>
      ['dictionary', 'contribution', 'validation', 'dialect', 'datasets', 'conversational-ai'].includes(
        p.id,
      ),
    )
    .slice(0, 6)

  const liveEntries = stats.dashboard?.approvedEntries ?? null

  return (
    <>
      <Seo
        title={site.name}
        description={site.description}
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: site.name,
            url: site.url,
            description: site.description,
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-24 top-10 h-72 w-72 rounded-full bg-savannah-500/30 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-terracotta-500/25 animate-aurora"
          style={{ animationDelay: '2s' }}
        />
        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:py-24">
          <div>
            <Reveal>
              <div className="flex flex-wrap gap-2">
                {home.hero.statusPills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-cream-200/85"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-kente-400" />
                    {pill}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.04] tracking-tight">
                {home.hero.headlineLead}{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  {home.hero.headlineEmphasis}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                {home.hero.supporting}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to={home.hero.primaryCta.to} variant="gold" size="lg">
                  {home.hero.primaryCta.label}
                </Button>
                <Button
                  href={home.hero.secondaryCta.to}
                  external={false}
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                  onClick={() => track(events.launchApp, { source: 'hero' })}
                >
                  {home.hero.secondaryCta.label}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <Link
                to={home.hero.tertiaryCta.to}
                onClick={() => track(events.contributeClick, { source: 'hero' })}
                className="pk-focus mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-kente-300 hover:text-kente-200"
              >
                {home.hero.tertiaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Hero visual */}
          <Reveal delay={0.2} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent backdrop-blur-sm" />
              <AnimatedWordNetwork className="relative h-full w-full" />
            </div>
          </Reveal>
        </div>

        {/* Concept marquee */}
        <div className="relative border-t border-white/10 py-4">
          <div className="pk-marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee gap-8 pr-8">
              {[...marqueeTokens, ...marqueeTokens].map((token, i) => (
                <span
                  key={`${token}-${i}`}
                  className={`flex items-center gap-8 text-sm font-medium ${
                    i % 2 === 0 ? 'text-cream-200/70' : 'font-kasem text-kente-300'
                  }`}
                >
                  {token}
                  <span aria-hidden="true" className="text-white/20">
                    ◆
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================== PROBLEM ========================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow={home.problem.eyebrow}
          title={home.problem.title}
          description={home.problem.body}
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {home.problem.points.map((point) => (
            <RevealItem
              key={point.title}
              className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
            >
              <h3 className="font-display text-lg font-bold text-indigo-900">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {point.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ====================== WHAT WE BUILD ======================= */}
      <Section tone="white" spacing="lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={home.building.eyebrow}
            title={home.building.title}
            description={home.building.description}
          />
          <Reveal className="shrink-0">
            <ArrowLink to="/build">See the full ecosystem</ArrowLink>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <RevealItem
              key={product.id}
              className="group flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                  <Glyph name={product.icon} className="h-5 w-5" />
                </span>
                <ProductStatusBadge status={product.status} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                {product.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
                {product.summary}
              </p>
              {product.cta ? (
                <Link
                  to={product.cta.to}
                  className="pk-focus mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
                >
                  {product.cta.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ) : null}
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ======================= HOW IT WORKS ======================= */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow={home.howItWorks.eyebrow}
          title={home.howItWorks.title}
          description={home.howItWorks.description}
          align="center"
          className="mx-auto"
        />
        <ol className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.slice(0, 8).map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 0.04}>
              <div className="relative h-full rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 font-display text-sm font-bold text-indigo-700">
                    {step.number}
                  </span>
                  <span className="text-indigo-700">
                    <Glyph name={step.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-indigo-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8 flex justify-center">
          <ArrowLink to="/how-it-works">See the full process</ArrowLink>
        </Reveal>
      </Section>

      {/* ===================== VALIDATION MODEL ===================== */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow={home.validation.eyebrow}
            title={home.validation.title}
            description={home.validation.description}
          />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {home.validation.pillars.map((pillar, i) => (
              <RevealItem
                key={pillar.title}
                className="rounded-2xl border border-indigo-100 bg-cream-50 p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-savannah-100 font-display text-sm font-bold text-savannah-700">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-indigo-900">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {pillar.description}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ======================== AI ROADMAP ======================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow={home.roadmap.eyebrow}
            title={home.roadmap.title}
            description={home.roadmap.description}
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roadmapPhases.map((phase, i) => (
              <Reveal key={phase.id} delay={i * 0.08}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-bold text-white/15">
                      0{phase.number}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        phase.status === 'in-progress'
                          ? 'bg-kente-500/20 text-kente-300'
                          : phase.status === 'planned'
                            ? 'bg-indigo-400/20 text-indigo-200'
                            : 'bg-terracotta-500/20 text-terracotta-200'
                      }`}
                    >
                      {phase.status === 'in-progress'
                        ? 'In progress'
                        : phase.status === 'planned'
                          ? 'Planned'
                          : 'Research phase'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-cream-100">
                    {phase.name}
                  </h3>
                  <p className="mt-2 text-sm text-cream-200/70">{phase.tagline}</p>
                  <ul className="mt-4 space-y-1.5">
                    {phase.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-center gap-2 text-sm text-cream-200/85"
                      >
                        <span className="text-kente-400">
                          <Glyph name="check" className="h-4 w-4" />
                        </span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-cream-200/80">
              <span className="font-semibold text-kente-300">
                Why verified data matters:{' '}
              </span>
              A smaller, carefully validated dataset is more valuable than a
              large, noisy one. Phase-1 targets {datasetTarget.min.toLocaleString()}
              –{datasetTarget.max.toLocaleString()} {datasetTarget.label}.{' '}
              <Link
                to="/ai-data"
                className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
                onClick={() => track(events.roadmapInteract, { source: 'home' })}
              >
                Explore the roadmap →
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ========================== IMPACT ========================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow={home.impact.eyebrow}
          title={home.impact.title}
          description={home.impact.description}
          align="center"
          className="mx-auto"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Live current count when available */}
          <Reveal>
            <div className="h-full rounded-2xl border border-savannah-200 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-fluid-2xl font-bold text-savannah-700">
                {liveEntries !== null ? (
                  <AnimatedCounter value={liveEntries} />
                ) : (
                  '—'
                )}
              </p>
              <p className="mt-1 text-sm font-semibold text-indigo-900">
                Approved entries
              </p>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-savannah-600">
                {liveEntries !== null ? 'Current verified count' : 'Live count loading'}
              </p>
            </div>
          </Reveal>
          {targetMetrics.map((metric, i) => (
            <Reveal key={metric.id} delay={(i + 1) * 0.06}>
              <div className="h-full rounded-2xl border border-indigo-100 bg-white p-6 text-center shadow-soft">
                <p className="font-display text-fluid-2xl font-bold text-indigo-800">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </p>
                <p className="mt-1 text-sm font-semibold text-indigo-900">
                  {metric.label}
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-charcoal-muted">
                  {metric.kind === 'in-progress' ? 'In progress' : 'Project target'}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center">
          <p className="text-xs text-charcoal-muted">
            Targets are labelled as targets. Live counts come directly from the
            platform.{' '}
            <Link
              to="/transparency"
              className="pk-focus font-semibold text-terracotta-600 hover:underline"
            >
              See transparency & reports →
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* ====================== CULTURAL STORY ====================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={home.culturalStory.eyebrow}
              title={home.culturalStory.title}
              description={home.culturalStory.body}
              tone="dark"
            />
            <Reveal className="mt-6">
              <ArrowLink to="/heritage" className="text-kente-300 hover:text-kente-200">
                Enter the cultural archive
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <figure className="rounded-3xl border border-white/10 bg-white/[0.05] p-8">
              <span aria-hidden="true" className="font-display text-5xl text-kente-400">
                “
              </span>
              <blockquote className="-mt-3 text-pretty font-display text-fluid-lg font-semibold leading-snug text-cream-100">
                {home.culturalStory.quote}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* ====================== COMMUNITY ========================== */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow={home.community.eyebrow}
          title={home.community.title}
          description={home.community.description}
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.slice(0, 6).map((audience) => (
            <RevealItem
              key={audience.title}
              className="rounded-2xl border border-indigo-100 bg-cream-50 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <Glyph name={audience.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-indigo-900">
                {audience.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                {audience.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="mt-8">
          <ArrowLink to="/impact">See community & impact</ArrowLink>
        </Reveal>
      </Section>

      {/* ======================== ALLIANCE ========================= */}
      <Section tone="cream" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer
              variant="sirigu"
              color="text-cream-100"
              opacity={0.06}
            />
            <div className="relative max-w-3xl">
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                {home.alliance.eyebrow}
              </Eyebrow>
              <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                {home.alliance.title}
              </h2>
              <p className="mt-4 text-pretty text-cream-200/85">
                {home.alliance.description}
              </p>
              <div className="mt-7">
                <Button
                  to="/alliance"
                  variant="gold"
                  size="md"
                  onClick={() => track(events.allianceView, { source: 'home' })}
                >
                  Read about the alliance
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ==================== PARTNERS + SUPPORT ==================== */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-indigo-100 bg-cream-50 p-8">
              <Eyebrow>{home.partners.eyebrow}</Eyebrow>
              <h3 className="mt-4 font-display text-fluid-xl font-bold text-indigo-900">
                {home.partners.title}
              </h3>
              <p className="mt-3 flex-1 text-charcoal-muted">
                {home.partners.description}
              </p>
              <div className="mt-6">
                <Button to="/partners" variant="primary">
                  Explore partnerships
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-terracotta-200 bg-terracotta-50 p-8">
              <Eyebrow className="border-terracotta-200 bg-white text-terracotta-700">
                {home.support.eyebrow}
              </Eyebrow>
              <h3 className="mt-4 font-display text-fluid-xl font-bold text-indigo-900">
                {home.support.title}
              </h3>
              <p className="mt-3 flex-1 text-charcoal-muted">
                {home.support.description}
              </p>
              <div className="mt-6">
                <Button
                  to="/support"
                  variant="secondary"
                  onClick={() => track(events.supportView, { source: 'home' })}
                >
                  Support the work
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================= MISSION ========================= */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-kente-400" opacity={0.08} />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <span className="text-kente-400">
            <Glyph name="sparkles" className="mx-auto h-8 w-8" />
          </span>
          <p className="mt-6 text-balance font-display text-fluid-3xl font-bold leading-[1.15] text-cream-100">
            {home.mission.statement}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              href={site.appLaunchPath}
              external={false}
              variant="gold"
              size="lg"
              onClick={() => track(events.launchApp, { source: 'mission' })}
            >
              Launch the app
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              Talk to the team
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
