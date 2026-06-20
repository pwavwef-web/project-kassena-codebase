import { useEffect } from 'react'
import {
  allianceContrasts,
  allianceParties,
  alliancePrinciples,
  allianceResponsibilities,
  allianceStatusItems,
  ecosystemLayers,
} from '../../content/alliance'
import { allianceStatement, site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { ProductStatusBadge } from '../components/ui/StatusBadge'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const [kasenaParty, indigenParty] = allianceParties

const kasenaWork = allianceResponsibilities.filter((r) => r.party === 'kasena')
const indigenWork = allianceResponsibilities.filter((r) => r.party === 'indigen')

const stewardStyles: Record<string, string> = {
  Community: 'bg-indigo-400/20 text-indigo-100 ring-indigo-300/30',
  'Project Kasena': 'bg-savannah-400/20 text-savannah-100 ring-savannah-300/30',
  'Indigen World': 'bg-terracotta-400/20 text-terracotta-100 ring-terracotta-300/30',
  Shared: 'bg-kente-400/20 text-kente-100 ring-kente-300/30',
}

export const AlliancePage = () => {
  useEffect(() => {
    track(events.allianceView, { source: 'alliance_page' })
  }, [])

  return (
    <>
      <Seo
        title="The Alliance"
        description="Project Kasena builds the language engine. Indigen World builds the wider cultural experience — a disciplined strategic alliance with clear governance and data boundaries."
        path="/alliance"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Project Kasena × Indigen World',
            url: `${site.url}/alliance`,
            description: allianceStatement,
            about: [
              { '@type': 'Organization', name: 'Project Kasena' },
              { '@type': 'Organization', name: 'Indigen World' },
            ],
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-20 top-0 h-72 w-72 rounded-full bg-savannah-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-terracotta-500/20 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />

        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Project Kasena × Indigen World
              </Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                Two projects, one{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  disciplined alliance
                </span>
                .
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                {allianceStatement} The two are strategically aligned — and
                deliberately kept distinct, with clear governance and firm data
                boundaries between them.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to="/partners" variant="gold" size="lg">
                  Explore partnerships
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
          </div>

          {/* Hero visual — the two engines side by side */}
          <Reveal delay={0.2} className="relative">
            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-5 backdrop-blur-sm sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {allianceParties.map((party) => (
                  <div
                    key={party.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                      <Glyph name={party.icon} className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 font-display text-base font-bold text-cream-100">
                      {party.name}
                    </h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-kente-300">
                      {party.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-cream-200/75">
                      {party.focus}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {allianceStatusItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-cream-200/60">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-cream-100">
                      {item.value}
                    </p>
                    <span className="mt-2 inline-flex">
                      <ProductStatusBadge status={item.status} />
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[0.7rem] text-cream-200/50">
                Draft framing — pending team review.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== IS / IS NOT ======================= */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="A clear understanding"
          title="An alliance — not a merger."
          description="Strategic alignment lets each project do what it does best. It does not collapse two distinct projects, or two distinct sets of responsibilities, into one."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {allianceContrasts.map((contrast) => (
            <RevealItem
              key={contrast.isLabel}
              className="flex flex-col rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-savannah-100 px-2.5 py-1 text-xs font-semibold text-savannah-700">
                  <Glyph name="check" className="h-3.5 w-3.5" />
                  It is
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-indigo-900">
                  {contrast.isLabel}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {contrast.isText}
                </p>
              </div>
              <div className="mt-5 border-t border-indigo-100 pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-2.5 py-1 text-xs font-semibold text-terracotta-700">
                  <span aria-hidden="true">×</span>
                  It is not
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-indigo-900">
                  {contrast.notLabel}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {contrast.notText}
                </p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ======================== WHO DOES WHAT ======================== */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow="Who does what"
          title="A clean division of responsibility."
          description="Project Kasena owns the language layer. Indigen World owns the cultural experience layer. Keeping these distinct is what makes the alliance trustworthy."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Project Kasena column */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-savannah-200 bg-cream-50 p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                  <Glyph name={kasenaParty.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-fluid-lg font-bold text-indigo-900">
                    {kasenaParty.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-savannah-700">
                    {kasenaParty.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
                {kasenaParty.focus}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-4">
                {kasenaWork.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-2xl border border-indigo-100 bg-white p-4"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-savannah-100 text-savannah-700">
                      <Glyph name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">
                        {item.description}
                      </p>
                      {item.note ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-2.5 py-1 text-[0.7rem] font-semibold text-terracotta-700">
                          <Glyph name="spark" className="h-3 w-3" />
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Indigen World column */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-terracotta-200 bg-terracotta-50 p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-500 text-white">
                  <Glyph name={indigenParty.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-fluid-lg font-bold text-indigo-900">
                    {indigenParty.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
                    {indigenParty.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
                {indigenParty.focus}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-4">
                {indigenWork.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-2xl border border-terracotta-100 bg-white p-4"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracotta-100 text-terracotta-700">
                      <Glyph name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">
                        {item.description}
                      </p>
                      {item.note ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[0.7rem] font-semibold text-indigo-700">
                          <Glyph name="spark" className="h-3 w-3" />
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <p className="rounded-2xl border border-indigo-100 bg-cream-50 px-5 py-4 text-sm text-charcoal-muted">
            <span className="font-semibold text-indigo-900">
              The boundary is the point.{' '}
            </span>
            The language engine and the cultural experience are kept in separate
            hands on purpose — so community-controlled data is never treated as
            unrestricted commercial content.
          </p>
        </Reveal>
      </Section>

      {/* ====================== ECOSYSTEM DIAGRAM ====================== */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative">
          <SectionHeader
            eyebrow="The layered ecosystem"
            title="From community governance to future commerce."
            description="The whole system stacks on one foundation: the community. Each layer above it adds capability without ever bypassing the consent and governance below."
            tone="dark"
            align="center"
            className="mx-auto"
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <Stagger className="flex flex-col gap-3" as="ol">
              {ecosystemLayers
                .slice()
                .sort((a, b) => b.order - a.order)
                .map((layer) => (
                  <RevealItem as="li" key={layer.id}>
                    <div
                      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r ${layer.accent} p-0.5`}
                    >
                      <div className="flex items-start gap-4 rounded-[0.9rem] bg-indigo-950/55 p-5 backdrop-blur-sm">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cream-100">
                          <Glyph name={layer.icon} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                            <span className="font-display text-sm font-bold text-white/40">
                              0{layer.order}
                            </span>
                            <h3 className="font-display text-base font-bold text-cream-100">
                              {layer.title}
                            </h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset ${
                                stewardStyles[layer.steward]
                              }`}
                            >
                              {layer.steward}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-cream-200/80">
                            {layer.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                ))}
            </Stagger>

            <Reveal className="mt-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <span className="text-kente-400">
                  <Glyph name="shield" className="h-5 w-5" />
                </span>
                <p className="text-sm text-cream-200/80">
                  <span className="font-semibold text-kente-300">
                    Foundation first.{' '}
                  </span>
                  Community governance sits beneath everything — every layer
                  above inherits its consent rules and data boundaries.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ====================== GOVERNANCE PRINCIPLES ====================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="Governance & data boundaries"
          title="What keeps the alliance disciplined."
          description="These are the guardrails that let two projects collaborate without blurring the lines that protect the community's language and culture."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
          {alliancePrinciples.map((principle) => (
            <RevealItem
              key={principle.title}
              className="flex gap-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                <Glyph name={principle.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-indigo-900">
                  {principle.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-muted">
                  {principle.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ====================== CULTURAL STORY / FRAMING ====================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Why this structure"
              title="Alignment with accountability."
              description="The strongest way to serve a language is to let specialists go deep — while making sure no specialist quietly redraws the rules the community set. That balance is the whole design."
              tone="dark"
            />
            <Reveal className="mt-6">
              <ArrowLink to="/transparency" className="text-kente-300 hover:text-kente-200">
                See how we stay transparent
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <figure className="rounded-3xl border border-white/10 bg-white/[0.05] p-8">
              <span aria-hidden="true" className="font-display text-5xl text-kente-400">
                “
              </span>
              <blockquote className="-mt-3 text-pretty font-display text-fluid-lg font-semibold leading-snug text-cream-100">
                {allianceStatement}
              </blockquote>
              <figcaption className="mt-4 text-sm text-cream-200/70">
                The shared, public framing of the alliance.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* ============================ CLOSING CTA ============================ */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-kente-400" opacity={0.08} />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="text-kente-400">
            <Glyph name="community" className="mx-auto h-8 w-8" />
          </span>
          <h2 className="mt-6 text-balance font-display text-fluid-3xl font-bold leading-[1.15] text-cream-100">
            Want to build with the alliance?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-cream-200/80">
            Whether you bring distribution, research, education or cultural
            stewardship, there is a clear and respectful way to take part — with
            the boundaries already drawn.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/partners"
              variant="gold"
              size="lg"
              onClick={() => track(events.allianceView, { source: 'alliance_cta' })}
            >
              Explore partnerships
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              Contact the team
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
