import { Link } from 'react-router-dom'
import { products } from '../../content/products'
import type { ProductModule } from '../../content/products'
import { productStatusLabels, site } from '../../content/site'
import type { ProductStatus } from '../../content/site'
import { events, track } from '../lib/analytics'
import { usePublicStats } from '../lib/usePublicStats'
import { Seo } from '../lib/seo'
import { AnimatedCounter } from '../components/motion/AnimatedCounter'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { ProductStatusBadge } from '../components/ui/StatusBadge'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

type Category = ProductModule['category']

/** The display order and editorial framing for each product category. */
const categoryOrder: readonly Category[] = [
  'Language',
  'Community',
  'Education',
  'Data',
  'Future AI',
]

const categoryMeta: Record<
  Category,
  { eyebrow: string; description: string; icon: string }
> = {
  Language: {
    eyebrow: 'The core',
    description:
      'The dictionary and translation surfaces people use directly — the front door to Kasem online.',
    icon: 'book',
  },
  Community: {
    eyebrow: 'The engine',
    description:
      'How living knowledge becomes structured, validated data — owned and reviewed by the community.',
    icon: 'community',
  },
  Education: {
    eyebrow: 'The next generation',
    description:
      'Cultural and learning resources that pass Kasem on, grounded in verified records.',
    icon: 'leaf',
  },
  Data: {
    eyebrow: 'The foundation',
    description:
      'The structured, documented dataset that everything else is built on — and that others can build on, ethically.',
    icon: 'data',
  },
  'Future AI': {
    eyebrow: 'The horizon',
    description:
      'Capabilities we are researching for when the verified data is ready. None of these are operational today.',
    icon: 'spark',
  },
}

/** Honest legend describing every status used across the ecosystem. */
const statusLegend: ReadonlyArray<{
  status: ProductStatus
  meaning: string
}> = [
  {
    status: 'available',
    meaning:
      'Shipped and usable in the web application today. Every published record has passed community review.',
  },
  {
    status: 'in-development',
    meaning:
      'Actively being built. Some of it works now and grows as the verified dataset expands.',
  },
  {
    status: 'planned',
    meaning:
      'Committed on the roadmap and scoped, but not yet started. Designed with teachers and the community.',
  },
  {
    status: 'research',
    meaning:
      'Future capability under exploration. Dependent on verified data and never presented as operational.',
  },
]

const statusAccent: Record<ProductStatus, string> = {
  available: 'border-savannah-200 bg-savannah-50',
  'in-development': 'border-kente-200 bg-kente-50',
  planned: 'border-indigo-200 bg-indigo-50',
  research: 'border-terracotta-200 bg-terracotta-50',
}

const statusDot: Record<ProductStatus, string> = {
  available: 'bg-savannah-500',
  'in-development': 'bg-kente-500',
  planned: 'bg-indigo-500',
  research: 'bg-terracotta-500',
}

const ProductCard = ({ product }: { product: ProductModule }) => (
  <RevealItem
    className="group flex h-full flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
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
    <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
      {product.description}
    </p>

    <dl className="mt-5 space-y-3 border-t border-indigo-100/70 pt-4 text-sm">
      <div className="flex gap-2">
        <dt className="flex shrink-0 items-center gap-1.5 font-semibold text-indigo-800">
          <span className="text-terracotta-600">
            <Glyph name="users" className="h-4 w-4" />
          </span>
          For
        </dt>
        <dd className="text-charcoal-muted">{product.audience}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="flex shrink-0 items-center gap-1.5 font-semibold text-indigo-800">
          <span className="text-savannah-600">
            <Glyph name="target" className="h-4 w-4" />
          </span>
          Impact
        </dt>
        <dd className="text-charcoal-muted">{product.impact}</dd>
      </div>
    </dl>

    {product.cta ? (
      <Link
        to={product.cta.to}
        className="pk-focus mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
      >
        {product.cta.label}
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    ) : (
      <span className="mt-5 text-xs font-medium uppercase tracking-wider text-charcoal-muted/70">
        {product.status === 'research'
          ? 'No public surface yet'
          : product.status === 'planned'
            ? 'On the roadmap'
            : 'Inside the platform'}
      </span>
    )}
  </RevealItem>
)

export const BuildPage = () => {
  const stats = usePublicStats()
  const liveEntries = stats.dashboard?.approvedEntries ?? null

  const grouped = categoryOrder.map((category) => ({
    category,
    meta: categoryMeta[category],
    items: products.filter((product) => product.category === category),
  }))

  const statusCounts = (Object.keys(productStatusLabels) as ProductStatus[]).map(
    (status) => ({
      status,
      count: products.filter((product) => product.status === status).length,
    }),
  )

  return (
    <>
      <Seo
        title="What we build"
        description="The full Project Kasena ecosystem — from the live dictionary and contribution tools to research-ready datasets and future AI, with honest status labels on every capability."
        path="/build"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Project Kasena product ecosystem',
            description:
              'The language, community, education, data and future-AI capabilities that make up Project Kasena.',
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: product.title,
              description: product.summary,
            })),
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-24 top-0 h-80 w-80 rounded-full bg-savannah-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-terracotta-500/20 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                The ecosystem
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                Everything we are building for{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  Kasem
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-pretty text-fluid-base text-cream-200/80">
                One connected system — from the dictionary people search today to
                the datasets and future AI that depend on verified data. We label
                the status of every capability honestly, so you always know what
                works now and what is still ahead.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href={site.appLaunchPath}
                  external={false}
                  variant="gold"
                  size="lg"
                  onClick={() => track(events.launchApp, { source: 'build_hero' })}
                >
                  Open the dictionary
                </Button>
                <Button
                  to="/contributions"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                  onClick={() =>
                    track(events.contributeClick, { source: 'build_hero' })
                  }
                >
                  Start contributing
                </Button>
              </div>
            </Reveal>
          </div>

          {/* At-a-glance status counts */}
          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statusCounts.map(({ status, count }) => (
              <RevealItem
                key={status}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-fluid-2xl font-bold text-cream-100">
                    {count}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${statusDot[status]}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-sm font-semibold text-cream-100">
                  {productStatusLabels[status]}
                </p>
                <p className="mt-0.5 text-xs text-cream-200/60">
                  {count === 1 ? 'capability' : 'capabilities'}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ======================= STATUS LEGEND ====================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="Read the labels"
          title="How to read our status labels"
          description="We never present a planned or future capability as something it is not. Here is exactly what each label means across this page."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statusLegend.map((entry) => (
            <RevealItem
              key={entry.status}
              className={`flex h-full flex-col rounded-2xl border p-6 ${statusAccent[entry.status]}`}
            >
              <ProductStatusBadge status={entry.status} className="self-start" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal">
                {entry.meaning}
              </p>
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="mt-8">
          <p className="max-w-3xl text-pretty text-sm text-charcoal-muted">
            Live figures on this site come straight from the platform. Anything
            not yet achieved is shown as a clearly labelled target — never as a
            real count.{' '}
            <Link
              to="/transparency"
              className="pk-focus font-semibold text-terracotta-600 hover:underline"
            >
              See transparency &amp; reports →
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* ====================== PRODUCT GROUPS ====================== */}
      {grouped.map((group, groupIndex) => {
        const isFutureAi = group.category === 'Future AI'
        const sectionTone = isFutureAi
          ? 'dark'
          : groupIndex % 2 === 0
            ? 'white'
            : 'cream'

        return (
          <Section key={group.category} tone={sectionTone} spacing="lg">
            {isFutureAi ? (
              <CulturalPatternLayer
                variant="dots"
                color="text-cream-100"
                opacity={0.05}
              />
            ) : null}
            <div className="relative">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                  eyebrow={group.meta.eyebrow}
                  title={
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isFutureAi
                            ? 'bg-white/10 text-kente-300'
                            : 'bg-indigo-700 text-cream-100'
                        }`}
                      >
                        <Glyph name={group.meta.icon} className="h-5 w-5" />
                      </span>
                      {group.category}
                    </span>
                  }
                  description={group.meta.description}
                  tone={isFutureAi ? 'dark' : 'light'}
                />
                <Reveal className="shrink-0">
                  <span
                    className={`text-sm font-semibold ${
                      isFutureAi ? 'text-cream-200/70' : 'text-charcoal-muted'
                    }`}
                  >
                    {group.items.length}{' '}
                    {group.items.length === 1 ? 'capability' : 'capabilities'}
                  </span>
                </Reveal>
              </div>

              {isFutureAi ? (
                <Reveal className="mt-8">
                  <div className="rounded-2xl border border-terracotta-400/30 bg-terracotta-500/10 px-5 py-4">
                    <p className="flex items-start gap-3 text-sm text-cream-200/90">
                      <span className="mt-0.5 text-terracotta-300">
                        <Glyph name="shield" className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="font-semibold text-terracotta-200">
                          None of these are operational.
                        </span>{' '}
                        Kasem AI, speech and voice are research directions that
                        depend on a large, verified, dialect-diverse dataset. We
                        will only build them when the data is ready and consent is
                        clear.
                      </span>
                    </p>
                  </div>
                </Reveal>
              ) : null}

              <Stagger
                className={`mt-10 grid gap-5 sm:grid-cols-2 ${
                  group.items.length > 2 ? 'lg:grid-cols-3' : ''
                }`}
              >
                {group.items.map((product) =>
                  isFutureAi ? (
                    <RevealItem
                      key={product.id}
                      className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                          <Glyph name={product.icon} className="h-5 w-5" />
                        </span>
                        <ProductStatusBadge status={product.status} />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-cream-100">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream-200/75">
                        {product.description}
                      </p>
                      <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-cream-100">
                            For
                          </dt>
                          <dd className="text-cream-200/70">
                            {product.audience}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-cream-100">
                            Impact
                          </dt>
                          <dd className="text-cream-200/70">{product.impact}</dd>
                        </div>
                      </dl>
                    </RevealItem>
                  ) : (
                    <ProductCard key={product.id} product={product} />
                  ),
                )}
              </Stagger>
            </div>
          </Section>
        )
      })}

      {/* ===================== WHY IT CONNECTS ====================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="One connected system"
              title="Every part feeds the next"
              description="Contributions become validated records. Validated records become the dataset. The dataset is what makes responsible research — and one day, Kasem AI — possible. Verified data is the thread that runs through everything."
              tone="dark"
            />
            <Reveal className="mt-6">
              <ArrowLink to="/ai-data" className="text-kente-300 hover:text-kente-200">
                See the data roadmap
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-kente-300">
                Live from the platform
              </p>
              <p className="mt-4 font-display text-fluid-3xl font-bold text-cream-100">
                {liveEntries !== null ? (
                  <AnimatedCounter value={liveEntries} />
                ) : (
                  '—'
                )}
              </p>
              <p className="mt-1 text-sm font-semibold text-cream-100">
                Approved entries
              </p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-cream-200/60">
                {liveEntries !== null
                  ? 'Current verified count'
                  : 'Live count loading'}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm text-cream-200/85">
                {[
                  'Community contributes words, sentences and dialect variants',
                  'Teachers and validators review before anything publishes',
                  'Verified records form the documented dataset',
                  'Research and future AI build on that dataset, ethically',
                ].map((step) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-kente-400">
                      <Glyph name="check" className="h-4 w-4" />
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ======================== CLOSING CTA ======================= */}
      <Section tone="cream" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer
              variant="weave"
              color="text-cream-100"
              opacity={0.06}
            />
            <div className="relative max-w-3xl">
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Build it with us
              </Eyebrow>
              <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                The dataset grows one verified word at a time
              </h2>
              <p className="mt-4 text-pretty text-cream-200/85">
                The available tools are ready for you today, and everything still
                ahead depends on the data the community builds now. Search it,
                contribute to it, or help sustain the work.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href={site.appLaunchPath}
                  external={false}
                  variant="gold"
                  size="lg"
                  onClick={() =>
                    track(events.launchApp, { source: 'build_cta' })
                  }
                >
                  Open the dictionary
                </Button>
                <Button
                  to="/contributions"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/10 text-cream-100 hover:bg-white/20"
                  onClick={() =>
                    track(events.contributeClick, { source: 'build_cta' })
                  }
                >
                  Start contributing
                </Button>
                <Button
                  to="/support"
                  variant="ghost"
                  size="lg"
                  className="text-cream-100 hover:bg-white/10"
                  onClick={() => track(events.supportView, { source: 'build_cta' })}
                >
                  Support the work
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
