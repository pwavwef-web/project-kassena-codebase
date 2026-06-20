import {
  governancePrinciples,
  heritageCategories,
  heritageCategoryById,
  publicCulturalRecords,
} from '../../content/heritage'
import type {
  ConsentStatus,
  HeritagePublicationStatus,
} from '../../content/heritage'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

const consentLabel: Record<ConsentStatus, string> = {
  public: 'Consent cleared',
  pending: 'Awaiting consent',
  restricted: 'Restricted',
}

const publicationLabel: Record<HeritagePublicationStatus, string> = {
  published: 'Published',
  'in-review': 'In review',
  draft: 'Draft',
}

export const HeritagePage = () => (
  <>
    <Seo
      title="Culture & Heritage"
      description="An editorial, consent-aware archive of Kasena language, proverbs, oral history and cultural knowledge — documented with attribution and care."
      path="/heritage"
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Culture & Heritage — Project Kasena',
          about: 'Kasena cultural knowledge and heritage',
          isAccessibleForFree: true,
        },
      ]}
    />

    {/* Hero */}
    <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
      <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.06} />
      <div
        aria-hidden="true"
        className="pk-aurora absolute -right-20 top-0 h-80 w-80 rounded-full bg-terracotta-500/25 animate-aurora"
      />
      <div className="container relative py-16 sm:py-24">
        <div className="max-w-2xl">
          <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
            Culture & heritage
          </Eyebrow>
          <h1 className="mt-5 text-balance font-display text-fluid-4xl font-bold leading-[1.05]">
            A living archive,{' '}
            <span className="bg-gradient-to-r from-kente-300 to-terracotta-300 bg-clip-text text-transparent">
              held in trust.
            </span>
          </h1>
          <p className="mt-5 text-pretty text-fluid-base text-cream-200/80">
            Kasena heritage is more than artefacts — it is language, proverbs,
            oral history and the everyday craft of living together. We document
            it like a museum and an editorial publication: with depth,
            attribution, and respect for what is not ours to share.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/contributions" variant="gold" size="lg">
              Contribute cultural knowledge
            </Button>
            <Button
              to="/legal/cultural-content"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              Our cultural content policy
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Cultural content notice / governance */}
    <Section tone="cream" spacing="md">
      <div className="rounded-3xl border border-kente-200 bg-white p-7 shadow-soft sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <Eyebrow className="border-kente-200 bg-kente-50 text-kente-800">
              A note on cultural content
            </Eyebrow>
            <h2 className="mt-4 font-display text-fluid-xl font-bold text-indigo-900">
              Documented with consent, attribution and care.
            </h2>
            <p className="mt-3 text-pretty text-charcoal-muted">
              We do not present restricted, sacred, private or unverified material.
              Every record can carry its source, region, contributor, validator,
              and consent or publication status — and anyone can request a
              correction or takedown.
            </p>
            <div className="mt-5">
              <ArrowLink to="/legal/takedown">
                Request a correction or takedown
              </ArrowLink>
            </div>
          </div>
          <Stagger className="grid w-full max-w-md gap-3 sm:grid-cols-2">
            {governancePrinciples.map((principle) => (
              <RevealItem
                key={principle.title}
                className="rounded-2xl border border-indigo-100 bg-cream-50 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-savannah-100 text-savannah-700">
                  <Glyph name={principle.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-indigo-900">
                  {principle.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">
                  {principle.description}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>

    {/* Category showcase */}
    <Section tone="white" spacing="lg">
      <SectionHeader
        eyebrow="The collection"
        title="Thirteen ways into Kasena culture."
        description="The archive is organised around the threads that carry identity — from language and proverbs to architecture, craft and community life."
      />
      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {heritageCategories.map((category) => (
          <RevealItem
            key={category.id}
            className="group flex items-start gap-4 rounded-2xl border border-indigo-100 bg-cream-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
              <Glyph name={category.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-indigo-900">
                {category.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">
                {category.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </Stagger>
    </Section>

    {/* Featured records */}
    <Section tone="cream" spacing="lg">
      <SectionHeader
        eyebrow="From the archive"
        title="Records, presented responsibly."
        description="A small set of illustrative, consent-cleared entries — shown to demonstrate how community-contributed knowledge will appear, with its governance visible."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {publicCulturalRecords.map((record, i) => {
          const category = heritageCategoryById[record.category]
          return (
            <Reveal key={record.id} delay={i * 0.05}>
              <article className="flex h-full flex-col rounded-3xl border border-indigo-100 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                    <Glyph name={category.icon} className="h-4 w-4" />
                    {category.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-savannah-50 px-2.5 py-1 text-[0.7rem] font-semibold text-savannah-700 ring-1 ring-inset ring-savannah-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-savannah-500" />
                    {consentLabel[record.consentStatus]}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-indigo-900">
                  {record.title}
                </h3>
                {record.kasemTerm ? (
                  <p className="mt-1 font-kasem text-sm font-semibold text-kente-700">
                    {record.kasemTerm}
                  </p>
                ) : null}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
                  {record.summary}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-indigo-50 pt-4 text-xs">
                  <div>
                    <dt className="font-semibold text-indigo-900">Region</dt>
                    <dd className="text-charcoal-muted">{record.region}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-indigo-900">Status</dt>
                    <dd className="text-charcoal-muted">
                      {publicationLabel[record.publicationStatus]}
                    </dd>
                  </div>
                  {record.contributor ? (
                    <div>
                      <dt className="font-semibold text-indigo-900">
                        Contributor
                      </dt>
                      <dd className="text-charcoal-muted">
                        {record.contributor}
                      </dd>
                    </div>
                  ) : null}
                  {record.validator ? (
                    <div>
                      <dt className="font-semibold text-indigo-900">
                        Validator
                      </dt>
                      <dd className="text-charcoal-muted">{record.validator}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="mt-4 text-[0.7rem] italic leading-relaxed text-sand-500">
                  {record.sourceAttribution}
                </p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>

    {/* Closing CTA */}
    <Section tone="indigo" spacing="lg">
      <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.06} />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-fluid-2xl font-bold text-cream-100">
          Help build a heritage record the community is proud of.
        </h2>
        <p className="mt-4 text-pretty text-cream-200/80">
          Share a proverb, a story or a craft tradition — or tell us where we’ve
          got something wrong. The archive grows, and corrects, with its people.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/contributions" variant="gold" size="lg">
            Start contributing
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
