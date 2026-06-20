import { useEffect } from 'react'
import { datasetTarget, roadmapPhases } from '../../content/roadmap'
import type { RoadmapPhase } from '../../content/roadmap'
import { events, track } from '../lib/analytics'
import { Seo } from '../lib/seo'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const statusStyle: Record<RoadmapPhase['status'], string> = {
  'in-progress': 'bg-kente-500/20 text-kente-300 ring-kente-400/30',
  planned: 'bg-indigo-400/20 text-indigo-100 ring-indigo-300/30',
  research: 'bg-terracotta-500/20 text-terracotta-200 ring-terracotta-300/30',
}

const statusText: Record<RoadmapPhase['status'], string> = {
  'in-progress': 'In progress',
  planned: 'Planned',
  research: 'Research phase',
}

export const AiDataPage = () => {
  useEffect(() => {
    track(events.roadmapInteract, { source: 'ai-data-page' })
  }, [])

  return (
    <>
      <Seo
        title="AI & Data Roadmap"
        description="Three honest phases to Kasem voice AI — a verified language foundation first, then conversational intelligence, then voice. A smaller, carefully validated dataset beats a large, noisy one."
        path="/ai-data"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Project Kasena AI & Data Roadmap',
            about: 'Responsible AI and language data for Kasem',
          },
        ]}
      />

      {/* Hero */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.06} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-16 top-8 h-72 w-72 rounded-full bg-savannah-500/25 animate-aurora"
        />
        <div className="container relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
              AI & data roadmap
            </Eyebrow>
            <h1 className="mt-5 text-balance font-display text-fluid-4xl font-bold leading-[1.05]">
              Three honest phases to{' '}
              <span className="bg-gradient-to-r from-kente-300 to-terracotta-300 bg-clip-text text-transparent">
                Kasem voice AI.
              </span>
            </h1>
            <p className="mt-5 text-pretty text-fluid-base text-cream-200/80">
              We are deliberate about sequence: a strong, verified foundation
              first. No phase is finished, and no AI here is operational today —
              we will say plainly where each capability stands.
            </p>
            <div className="mt-8">
              <Button to="/contributions" variant="gold" size="lg">
                Help build the foundation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Phases */}
      <Section tone="dark" spacing="lg">
        <SectionHeader
          eyebrow="The roadmap"
          title="From verified words to a digital voice."
          description="Each phase builds on the last. Status labels are honest — in progress, planned, or research."
          tone="dark"
        />
        <div className="relative mt-12">
          {/* connecting rail (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[27px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-kente-400/60 via-indigo-300/30 to-terracotta-400/40 lg:block"
          />
          <div className="space-y-6">
            {roadmapPhases.map((phase, i) => (
              <Reveal key={phase.id} delay={i * 0.06}>
                <div className="relative grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[3.5rem_1fr]">
                  <div className="flex lg:block">
                    <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-700 font-display text-xl font-bold text-cream-100 ring-4 ring-indigo-950">
                      0{phase.number}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-fluid-xl font-bold text-cream-100">
                        {phase.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle[phase.status]}`}
                      >
                        {statusText[phase.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-pretty text-cream-200/75">
                      {phase.tagline}
                    </p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-kente-300">
                          What it builds on
                        </h4>
                        <ul className="mt-3 space-y-1.5">
                          {phase.focus.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-cream-200/85"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-savannah-300">
                          What it produces
                        </h4>
                        <ul className="mt-3 space-y-1.5">
                          {phase.outcomes.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-cream-200/85"
                            >
                              <span className="mt-0.5 text-savannah-300">
                                <Glyph name="check" className="h-4 w-4" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Why verified data matters */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Why verified data matters"
              title="A smaller, carefully validated dataset is more valuable than a large, noisy one."
              description="Language models inherit the quality of their data. For an under-resourced language, accuracy and consent matter more than raw volume — a noisy corpus teaches mistakes, embeds disrespect, and is hard to fix later."
            />
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: 'shield',
                  title: 'Trust by design',
                  body: 'Every entry is reviewed by qualified speakers before it counts.',
                },
                {
                  icon: 'data',
                  title: 'Documented & governed',
                  body: 'Dialect, source and consent travel with the data.',
                },
                {
                  icon: 'refresh',
                  title: 'Correctable',
                  body: 'Errors can be found, fixed and re-validated over time.',
                },
                {
                  icon: 'community',
                  title: 'Community-owned',
                  body: 'The corpus is held in trust, not sold off.',
                },
              ].map((item) => (
                <RevealItem
                  key={item.title}
                  className="rounded-2xl border border-indigo-100 bg-white p-5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <Glyph name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-indigo-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">
                    {item.body}
                  </p>
                </RevealItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                Phase-1 target
              </p>
              <p className="mt-3 font-display text-fluid-3xl font-bold text-indigo-800">
                <AnimatedCounter value={datasetTarget.min} />–
                <AnimatedCounter value={datasetTarget.max} />
              </p>
              <p className="mt-2 text-sm font-semibold text-indigo-900">
                {datasetTarget.label}
              </p>
              <p className="mt-3 text-xs text-charcoal-muted">
                A clearly-stated target — not a current count. Live progress is
                published on the transparency page.
              </p>
              <div className="mt-6">
                <Button to="/transparency" variant="outline" size="sm">
                  See live progress
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Closing CTA */}
      <Section tone="indigo" spacing="lg">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-fluid-2xl font-bold text-cream-100">
            The AI starts with the data. The data starts with the community.
          </h2>
          <p className="mt-4 text-pretty text-cream-200/80">
            Every validated word and sentence is a brick in the foundation for
            future Kasem AI. Add yours.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/contributions" variant="gold" size="lg">
              Start contributing
            </Button>
            <Button
              to="/build"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              See what we’re building
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
