import { Link } from 'react-router-dom'
import { howItWorksSteps } from '../../content/howItWorks'
import type { HowItWorksStep } from '../../content/howItWorks'
import { datasetTarget } from '../../content/roadmap'
import { site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { usePublicStats } from '../lib/usePublicStats'
import { Seo } from '../lib/seo'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

/** Visual treatment per actor — keeps the "who does this" badge consistent. */
const actorStyles: Record<HowItWorksStep['actor'], { badge: string; dot: string }> = {
  You: {
    badge: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    dot: 'bg-indigo-500',
  },
  Community: {
    badge: 'border-terracotta-200 bg-terracotta-50 text-terracotta-700',
    dot: 'bg-terracotta-500',
  },
  System: {
    badge: 'border-savannah-200 bg-savannah-50 text-savannah-700',
    dot: 'bg-savannah-500',
  },
  Validators: {
    badge: 'border-kente-300 bg-kente-50 text-kente-700',
    dot: 'bg-kente-500',
  },
  Everyone: {
    badge: 'border-indigo-200 bg-white text-indigo-700',
    dot: 'bg-indigo-700',
  },
}

const actorLegend: Array<{ actor: HowItWorksStep['actor']; note: string }> = [
  { actor: 'You', note: 'Learners & speakers using the dictionary' },
  { actor: 'Community', note: 'Contributors adding words & corrections' },
  { actor: 'Validators', note: 'Qualified Kasem teachers & elders' },
  { actor: 'System', note: 'Automated checks & the verified dataset' },
  { actor: 'Everyone', note: 'Education, research & future tools' },
]

const whyItMatters = [
  {
    icon: 'shield',
    title: 'Community validation, not crowd noise',
    description:
      'Every record is reviewed by qualified Kasem teachers and elders before it is trusted. Accuracy and cultural appropriateness come first.',
  },
  {
    icon: 'check',
    title: 'Verified beats voluminous',
    description:
      'A smaller, carefully validated dataset is more valuable than a large, noisy one. We optimise for trust, not raw volume.',
  },
  {
    icon: 'reward',
    title: 'Recognition for real work',
    description:
      'Contributors earn points, achievements and eligible rewards only for approved work — so the incentive points toward quality.',
  },
  {
    icon: 'leaf',
    title: 'Built to outlast the project',
    description:
      'The verified dataset becomes durable language infrastructure: it can power education, research, translation and future AI.',
  },
]

export const HowItWorksPage = () => {
  const stats = usePublicStats()
  const liveEntries = stats.dashboard?.approvedEntries ?? null

  return (
    <>
      <Seo
        title="How It Works"
        description="From a single search to a verified dataset — see the eight-step community process behind Project Kasena, where every Kasem word is reviewed by qualified teachers and elders before it is trusted."
        path="/how-it-works"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How Project Kasena verifies the Kasem language',
            description:
              'The eight-step community process that turns a contribution into a verified record in the Kasem dataset.',
            step: howItWorksSteps.map((step) => ({
              '@type': 'HowToStep',
              position: step.number,
              name: step.title,
              text: step.description,
            })),
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-20 top-0 h-72 w-72 rounded-full bg-savannah-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-terracotta-500/20 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                The process
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.04] tracking-tight">
                One word at a time, from a search to a{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  verified record
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                Project Kasena turns everyday contributions into trustworthy
                language data through eight clear steps. Nothing enters the
                dataset until qualified Kasem teachers and elders have reviewed
                it — accuracy and consent come first.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  to="/contributions"
                  variant="gold"
                  size="lg"
                  onClick={() => track(events.contributeClick, { source: 'how-it-works-hero' })}
                >
                  Start contributing
                </Button>
                <Button
                  to="/dictionary"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                  onClick={() => track(events.launchApp, { source: 'how-it-works-hero' })}
                >
                  Explore the dictionary
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero visual — a compact, animated "pipeline" motif */}
          <Reveal delay={0.2} className="relative">
            <div className="relative mx-auto w-full max-w-[26rem] rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-200/60">
                The pipeline
              </p>
              <ol className="mt-5 space-y-4">
                {[
                  { label: 'Contribution', icon: 'upload', actor: 'Community' as const },
                  { label: 'Automated checks', icon: 'refresh', actor: 'System' as const },
                  { label: 'Elder & teacher review', icon: 'shield', actor: 'Validators' as const },
                  { label: 'Verified dataset', icon: 'data', actor: 'System' as const },
                ].map((node, i) => (
                  <li key={node.label} className="relative flex items-center gap-4">
                    {i < 3 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[1.4rem] top-12 h-4 w-px bg-gradient-to-b from-white/30 to-white/5"
                      />
                    ) : null}
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-kente-300">
                      <Glyph name={node.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-cream-100">
                        {node.label}
                      </p>
                      <p className="text-xs text-cream-200/60">{node.actor}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== ACTOR LEGEND ======================= */}
      <Section tone="white" spacing="sm">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-600">
            Who does what
          </p>
        </Reveal>
        <Stagger className="mt-5 flex flex-wrap gap-3">
          {actorLegend.map((entry) => (
            <RevealItem
              key={entry.actor}
              className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 ${actorStyles[entry.actor].badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${actorStyles[entry.actor].dot}`} />
              <span className="text-sm font-semibold">{entry.actor}</span>
              <span className="hidden text-xs opacity-70 sm:inline">
                · {entry.note}
              </span>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ===================== THE 8 STEPS ========================= */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="The eight steps"
          title="How a word becomes verified Kasem"
          description="Follow the path of a single contribution. Each step adds a layer of trust before anything reaches the dictionary."
          align="center"
          className="mx-auto"
        />

        {/* Mobile / small screens: clean vertical timeline */}
        <ol className="relative mx-auto mt-12 max-w-xl lg:hidden">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[1.45rem] top-4 w-px bg-indigo-200"
          />
          {howItWorksSteps.map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 0.04} className="relative pb-8 pl-16 last:pb-0">
              <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-100 bg-white font-display text-base font-bold text-indigo-700 shadow-soft">
                {step.number}
              </span>
              <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                    <Glyph name={step.icon} className="h-5 w-5" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${actorStyles[step.actor].badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${actorStyles[step.actor].dot}`} />
                    {step.actor}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-indigo-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Desktop: connected zig-zag process diagram (two rows) */}
        <div className="mx-auto mt-14 hidden max-w-6xl lg:block">
          <ProcessRow steps={howItWorksSteps.slice(0, 4)} />
          <div className="relative my-2 flex justify-end pr-[6%]">
            {/* connector that carries the flow down into the second row */}
            <span
              aria-hidden="true"
              className="block h-10 w-px bg-gradient-to-b from-indigo-300 to-savannah-300"
            />
          </div>
          <ProcessRow steps={howItWorksSteps.slice(4, 8)} reverse />
        </div>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-pretty text-sm text-charcoal-muted">
            Sources and consent are tracked at every stage. Dialect, restricted
            or sacred material is handled according to the wishes of the
            community it comes from — it is never published without permission.
          </p>
        </Reveal>
      </Section>

      {/* ===================== WHY THIS MATTERS ===================== */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeader
            eyebrow="Why this matters"
            title="A small, carefully validated dataset beats a large, noisy one"
            description="The slow part — human review by qualified teachers and elders — is the part that makes the data worth trusting. That is the whole point of the process."
          />
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {whyItMatters.map((item) => (
              <RevealItem
                key={item.title}
                className="rounded-2xl border border-indigo-100 bg-cream-50 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                  <Glyph name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-indigo-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {item.description}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ===================== PROGRESS STRIP ====================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
              Where the process leads
            </Eyebrow>
            <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight text-cream-100">
              Every approved record is a step toward an AI-ready Kasem foundation
            </h2>
            <p className="mt-4 text-pretty text-cream-200/80">
              The first phase focuses on the lexical bedrock: validated word and
              sentence pairs with dialect and context. It is the foundation
              everything else is built on.
            </p>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-cream-200/85">
              <span className="font-semibold text-kente-300">Phase-1 target: </span>
              {datasetTarget.min.toLocaleString()}–
              {datasetTarget.max.toLocaleString()} {datasetTarget.label}.{' '}
              <Link
                to="/ai-data"
                className="pk-focus font-semibold text-kente-300 underline-offset-4 hover:underline"
                onClick={() => track(events.roadmapInteract, { source: 'how-it-works' })}
              >
                See the full roadmap →
              </Link>
            </p>
          </div>
          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center">
                <p className="font-display text-fluid-2xl font-bold text-kente-300">
                  {liveEntries !== null ? <AnimatedCounter value={liveEntries} /> : '—'}
                </p>
                <p className="mt-1 text-sm font-semibold text-cream-100">
                  Approved entries
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-cream-200/60">
                  {liveEntries !== null ? 'Current verified count' : 'Live count loading'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center">
                <p className="font-display text-fluid-2xl font-bold text-kente-300">
                  8
                </p>
                <p className="mt-1 text-sm font-semibold text-cream-100">
                  Steps to verification
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-cream-200/60">
                  From search to dataset
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================= CLOSING CTA ===================== */}
      <Section tone="cream" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.06} />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-2xl">
                <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                  Take part
                </Eyebrow>
                <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                  Add a word, or look one up
                </h2>
                <p className="mt-4 text-pretty text-cream-200/85">
                  The process only works because people take part. Contribute a
                  word, sentence or correction — or explore what the community
                  has already verified.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  to="/contributions"
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={() => track(events.contributeClick, { source: 'how-it-works-cta' })}
                >
                  Contribute knowledge
                </Button>
                <Button
                  href={site.appLaunchPath}
                  external={false}
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                  onClick={() => track(events.launchApp, { source: 'how-it-works-cta' })}
                >
                  Open the dictionary
                </Button>
              </div>
            </div>
            <div className="relative mt-8 border-t border-white/15 pt-6">
              <ArrowLink to="/ai-data" className="text-kente-300 hover:text-kente-200">
                See how verified data powers future AI
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}

/**
 * One row of the desktop process diagram: four step cards joined by horizontal
 * connectors. `reverse` lays the row out right-to-left so the two rows form a
 * continuous zig-zag (boustrophedon) flow.
 */
const ProcessRow = ({
  steps,
  reverse = false,
}: {
  steps: HowItWorksStep[]
  reverse?: boolean
}) => (
  <ol className={`flex items-stretch ${reverse ? 'flex-row-reverse' : ''}`}>
    {steps.map((step, i) => (
      <li key={step.number} className="flex flex-1 items-stretch">
        <Reveal delay={i * 0.06} className="flex-1">
          <article className="group relative flex h-full flex-col rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-card">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-display text-sm font-bold text-indigo-700">
                {step.number}
              </span>
              <span className="text-indigo-700 transition-transform duration-300 group-hover:scale-110">
                <Glyph name={step.icon} className="h-6 w-6" />
              </span>
            </div>
            <h3 className="mt-4 font-display text-sm font-bold leading-snug text-indigo-900">
              {step.title}
            </h3>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-charcoal-muted">
              {step.description}
            </p>
            <span
              className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${actorStyles[step.actor].badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${actorStyles[step.actor].dot}`} />
              {step.actor}
            </span>
          </article>
        </Reveal>
        {i < steps.length - 1 ? (
          <span
            aria-hidden="true"
            className="flex w-6 items-center justify-center self-center xl:w-10"
          >
            <span className="relative block h-px w-full bg-gradient-to-r from-indigo-200 to-savannah-200">
              <span
                className={`absolute top-1/2 -translate-y-1/2 text-xs text-savannah-400 ${reverse ? 'left-0 -scale-x-100' : 'right-0'}`}
              >
                ▶
              </span>
            </span>
          </span>
        ) : null}
      </li>
    ))}
  </ol>
)
