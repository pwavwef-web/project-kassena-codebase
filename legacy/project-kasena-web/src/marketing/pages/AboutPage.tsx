import { Link } from 'react-router-dom'
import { about } from '../../content/about'
import { site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { Glyph } from '../components/ui/Glyph'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const statusStyle: Record<string, string> = {
  'in-progress': 'bg-kente-500/20 text-kente-300',
  planned: 'bg-indigo-400/20 text-indigo-200',
  research: 'bg-terracotta-500/20 text-terracotta-200',
}

const statusLabel: Record<string, string> = {
  'in-progress': 'In progress',
  planned: 'Planned',
  research: 'Research phase',
}

export const AboutPage = () => {
  return (
    <>
      <Seo
        title="About"
        description="The story behind Project Kasena — its origin, mission, vision, values and the community building a verified digital future for the Kasem language."
        path="/about"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Project Kasena',
            url: `${site.url}/about`,
            description:
              'The origin, mission, vision and values of Project Kasena, a community-led effort to give the Kasem language a verified digital foundation.',
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-24 top-0 h-72 w-72 rounded-full bg-terracotta-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-savannah-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                {about.hero.eyebrow}
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                {about.hero.headlineLead}{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  {about.hero.headlineEmphasis}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                {about.hero.supporting}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  to={about.hero.primaryCta.to}
                  variant="gold"
                  size="lg"
                  onClick={() => track(events.contributeClick, { source: 'about-hero' })}
                >
                  {about.hero.primaryCta.label}
                </Button>
                <Button
                  to={about.hero.secondaryCta.to}
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  {about.hero.secondaryCta.label}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero visual — Kasem wordmark panel */}
          <Reveal delay={0.2} className="relative">
            <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-8 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                {site.shortName}
              </span>
              <p className="mt-4 font-kasem text-fluid-3xl font-bold leading-tight text-cream-100">
                Kasɛm
              </p>
              <p className="mt-2 text-sm text-cream-200/70">
                A living language of the Kasena-Nankana area of northern Ghana and
                southern Burkina Faso.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-display text-base font-bold text-cream-100">
                    Community-owned
                  </p>
                  <p className="mt-1 text-xs text-cream-200/70">
                    Held in trust for its speakers
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-display text-base font-bold text-cream-100">
                    Elder-validated
                  </p>
                  <p className="mt-1 text-xs text-cream-200/70">
                    Accuracy is a community decision
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ ORIGIN ============================ */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeader eyebrow={about.origin.eyebrow} title={about.origin.title} />
          <div>
            <Stagger className="space-y-5">
              {about.origin.paragraphs.map((paragraph) => (
                <RevealItem key={paragraph.slice(0, 24)}>
                  <p className="text-pretty text-fluid-base leading-relaxed text-charcoal-muted">
                    {paragraph}
                  </p>
                </RevealItem>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="mt-7 rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-sm leading-relaxed text-charcoal-muted">
                <span className="font-semibold uppercase tracking-wider text-terracotta-600">
                  Note:{' '}
                </span>
                {about.origin.note}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ============================ PROBLEM ============================ */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow={about.problem.eyebrow}
          title={about.problem.title}
          description={about.problem.body}
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {about.problem.points.map((point) => (
            <RevealItem
              key={point.title}
              className="rounded-2xl border border-indigo-100 bg-cream-50 p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                <Glyph name={point.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {point.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ======================= MISSION & VISION ======================= */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow={about.missionVision.eyebrow}
            title="Why Project Kasena exists, in two sentences."
            tone="dark"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-8">
                <span className="text-kente-400">
                  <Glyph name="target" className="h-8 w-8" />
                </span>
                <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                  {about.missionVision.missionLabel}
                </figcaption>
                <p className="mt-3 text-pretty font-display text-fluid-lg font-semibold leading-snug text-cream-100">
                  {about.missionVision.mission}
                </p>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-8">
                <span className="text-kente-400">
                  <Glyph name="globe" className="h-8 w-8" />
                </span>
                <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                  {about.missionVision.visionLabel}
                </figcaption>
                <p className="mt-3 text-pretty font-display text-fluid-lg font-semibold leading-snug text-cream-100">
                  {about.missionVision.vision}
                </p>
              </figure>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ====================== STRATEGIC OBJECTIVES ===================== */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow={about.objectives.eyebrow}
          title={about.objectives.title}
          description={about.objectives.description}
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
          {about.objectives.items.map((objective) => (
            <RevealItem
              key={objective.number}
              className="group flex gap-5 rounded-2xl border border-indigo-100 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="font-display text-fluid-2xl font-bold leading-none text-indigo-200">
                {objective.number}
              </span>
              <div>
                <div className="flex items-center gap-2 text-indigo-700">
                  <Glyph name={objective.icon} className="h-5 w-5" />
                  <h3 className="font-display text-lg font-bold text-indigo-900">
                    {objective.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  {objective.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ========================== WHY KASEM ========================== */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeader
            eyebrow={about.whyKasem.eyebrow}
            title={about.whyKasem.title}
            description={about.whyKasem.body}
          />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {about.whyKasem.reasons.map((reason) => (
              <RevealItem
                key={reason.title}
                className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-savannah-100 text-savannah-700">
                  <Glyph name={reason.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-indigo-900">
                  {reason.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {reason.description}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ====================== HIGHLIGHTED QUOTE ====================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="sirigu" color="text-kente-400" opacity={0.07} />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <figure>
            <span aria-hidden="true" className="font-display text-6xl leading-none text-kente-400">
              “
            </span>
            <blockquote className="-mt-4 text-balance font-display text-fluid-3xl font-bold leading-[1.15] text-cream-100">
              {about.quote.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cream-200/70">
              {about.quote.attribution}
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* ======================== MISSION & VALUES ======================= */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow={about.values.eyebrow}
          title={about.values.title}
          description={about.values.description}
          align="center"
          className="mx-auto"
        />
        <Stagger className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.items.map((value) => (
            <RevealItem
              key={value.title}
              className="flex h-full flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <Glyph name={value.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-indigo-900">
                {value.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-charcoal-muted">
                {value.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* =========================== WHO BUILDS IT ======================= */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow={about.roles.eyebrow}
          title={about.roles.title}
          description={about.roles.description}
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {about.roles.items.map((role) => (
            <RevealItem
              key={role.group}
              className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Glyph name={role.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-indigo-900">
                  {role.group}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
                {role.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ============================ TIMELINE =========================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow={about.timeline.eyebrow}
            title={about.timeline.title}
            description={about.timeline.description}
            tone="dark"
          />
          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {about.timeline.stages.map((stage, i) => (
              <Reveal as="li" key={stage.title} delay={i * 0.08}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-cream-200/60">
                      {stage.marker}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[stage.status]}`}
                    >
                      {statusLabel[stage.status]}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-display text-sm font-bold text-kente-300">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-lg font-bold text-cream-100">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-cream-200/75">
                    {stage.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-8">
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-cream-200/80">
              <span className="font-semibold text-kente-300">A deliberate order: </span>
              No phase is presented as complete, and no AI is presented as trained or
              operational.{' '}
              <Link
                to="/ai-data"
                className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
                onClick={() => track(events.roadmapInteract, { source: 'about' })}
              >
                Explore the full roadmap →
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ========================= LONG-TERM AMBITION ==================== */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={about.ambition.eyebrow}
              title={about.ambition.title}
              description={about.ambition.body}
            />
            <Reveal className="mt-6">
              <ArrowLink to="/build">See what we are building</ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-10">
              <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.07} />
              <div className="relative">
                <span className="text-kente-300">
                  <Glyph name="sparkles" className="h-8 w-8" />
                </span>
                <p className="mt-5 text-pretty font-display text-fluid-xl font-bold leading-snug">
                  {site.tagline}
                </p>
                <p className="mt-4 text-sm text-cream-200/85">
                  A proven, community-owned model for one language can light the way
                  for many others still waiting to be heard online.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================== CLOSING CTA ========================= */}
      <Section tone="cream" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-950 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.06} />
            <div className="relative mx-auto max-w-2xl text-center">
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Be part of the story
              </Eyebrow>
              <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                Help Kasem claim its place in the digital future.
              </h2>
              <p className="mt-4 text-pretty text-cream-200/85">
                Whether you contribute a word, validate an entry, or partner with the
                project — the language grows when its people build it together.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  to="/contributions"
                  variant="gold"
                  size="lg"
                  onClick={() => track(events.contributeClick, { source: 'about-cta' })}
                >
                  Contribute to the language
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
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
