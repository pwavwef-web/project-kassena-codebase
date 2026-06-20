import { useMemo, useState } from 'react'
import {
  formatUpdateDate,
  readingTimeMinutes,
  updateFilters,
  updates,
} from '../../content/updates'
import type { Update, UpdateCategory } from '../../content/updates'
import { site } from '../../content/site'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { Glyph } from '../components/ui/Glyph'
import { NewsletterForm } from '../components/forms/NewsletterForm'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

type Filter = UpdateCategory | 'All'

/** Closest valid Glyph name for each editorial category. */
const categoryIcon: Record<UpdateCategory, string> = {
  Announcement: 'speaker',
  'Build update': 'data',
  Community: 'community',
  Research: 'search',
  Product: 'spark',
}

const categoryAccent: Record<UpdateCategory, string> = {
  Announcement: 'bg-kente-100 text-kente-800 ring-kente-200',
  'Build update': 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  Community: 'bg-terracotta-100 text-terracotta-700 ring-terracotta-200',
  Research: 'bg-savannah-100 text-savannah-700 ring-savannah-200',
  Product: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
}

const CategoryPill = ({ category }: { category: UpdateCategory }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${categoryAccent[category]}`}
  >
    <Glyph name={categoryIcon[category]} className="h-3.5 w-3.5" />
    {category}
  </span>
)

/** Share affordance — uses the Web Share API when present, otherwise copies the
 *  URL to the clipboard. All failures (including user cancel) are swallowed. */
const shareUpdate = async (update: Update): Promise<void> => {
  const url = `${site.url}/updates#${update.slug}`
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: update.title, text: update.excerpt, url })
      return
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
    }
  } catch {
    /* fail silently — share/copy is a convenience, never a hard dependency */
  }
}

const UpdateCard = ({
  update,
  related,
}: {
  update: Update
  related: Update | null
}) => {
  const minutes = readingTimeMinutes(update.body)
  return (
    <article
      id={update.slug}
      className="group flex h-full scroll-mt-24 flex-col rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-center justify-between gap-3">
        <CategoryPill category={update.category} />
        <button
          type="button"
          onClick={() => void shareUpdate(update)}
          aria-label={`Share “${update.title}”`}
          className="pk-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-charcoal-muted transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Glyph name="send" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-charcoal-muted">
        <time dateTime={update.date}>{formatUpdateDate(update.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{minutes} min read</span>
      </div>

      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-indigo-900">
        {update.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
        {update.excerpt}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-indigo-50 pt-4">
        <span className="text-xs font-medium text-charcoal-muted">
          {update.author}
        </span>
        {related ? (
          <span className="hidden text-right text-[0.7rem] leading-tight text-charcoal-muted sm:inline">
            Related:{' '}
            <a
              href={`#${related.slug}`}
              className="pk-focus font-semibold text-terracotta-600 hover:underline"
            >
              {related.title}
            </a>
          </span>
        ) : null}
      </div>
    </article>
  )
}

export const UpdatesPage = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')

  const featured = useMemo(
    () => updates.find((u) => u.featured) ?? updates[0] ?? null,
    [],
  )

  const sorted = useMemo(
    () =>
      [...updates].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  )

  const trimmedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return sorted.filter((u) => {
      const matchesCategory =
        activeFilter === 'All' || u.category === activeFilter
      const matchesQuery =
        trimmedQuery.length === 0 ||
        u.title.toLowerCase().includes(trimmedQuery) ||
        u.excerpt.toLowerCase().includes(trimmedQuery)
      return matchesCategory && matchesQuery
    })
  }, [sorted, activeFilter, trimmedQuery])

  /** Pick a "related" hint for a card: the next post sharing its category,
   *  otherwise the next post overall. Never points at itself. */
  const relatedFor = (current: Update): Update | null => {
    const sameCategory = sorted.find(
      (u) => u.id !== current.id && u.category === current.category,
    )
    if (sameCategory) return sameCategory
    return sorted.find((u) => u.id !== current.id) ?? null
  }

  const isFiltering = activeFilter !== 'All' || trimmedQuery.length > 0
  const resetFilters = () => {
    setActiveFilter('All')
    setQuery('')
  }

  const featuredMinutes = featured ? readingTimeMinutes(featured.body) : 0
  const featuredParagraphs = featured ? featured.body.split('\n\n') : []

  return (
    <>
      <Seo
        title="News & Updates"
        description="The latest announcements, build updates and progress from Project Kasena — honestly reported, with targets and live counts kept separate."
        path="/updates"
        type="website"
        jsonLd={
          featured
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: featured.title,
                  description: featured.excerpt,
                  datePublished: featured.date,
                  dateModified: featured.date,
                  inLanguage: 'en',
                  author: {
                    '@type': 'Organization',
                    name: featured.author,
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: site.name,
                    url: site.url,
                  },
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `${site.url}/updates#${featured.slug}`,
                  },
                },
              ]
            : []
        }
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
          className="pk-aurora absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-terracotta-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                News &amp; updates
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-2xl text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                Progress on Kasem, reported{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  honestly.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/85">
                Announcements, build updates and milestones from Project Kasena.
                We share what we are building, what is still in development, and
                what remains a plan — and we keep targets clearly separate from
                live counts.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href="#latest"
                  external={false}
                  variant="gold"
                  size="lg"
                >
                  Read the latest
                </Button>
                <Button
                  to="/about"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  About the project
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Honest reporting note card */}
          <Reveal delay={0.2} className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-kente-500/20 text-kente-300">
                <Glyph name="shield" className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold text-cream-100">
                How we report
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-cream-200/85">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-kente-400">
                    <Glyph name="check" className="h-4 w-4" />
                  </span>
                  Only verifiable facts — no invented numbers or partners.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-kente-400">
                    <Glyph name="check" className="h-4 w-4" />
                  </span>
                  Targets are labelled as targets, never as achievements.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-kente-400">
                    <Glyph name="check" className="h-4 w-4" />
                  </span>
                  Future AI is described as planned or research, not operational.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= FEATURED ========================== */}
      {featured ? (
        <Section tone="cream" spacing="lg">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-600">
              Featured story
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <article className="mt-6 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-card">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Visual panel (original CSS/SVG-style gradient, no placeholder photo) */}
                <div className="relative min-h-[14rem] overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-savannah-700 p-8">
                  <CulturalPatternLayer
                    variant="sirigu"
                    color="text-cream-100"
                    opacity={0.1}
                  />
                  <div className="relative flex h-full flex-col justify-between gap-6 text-cream-100">
                    <CategoryPill category={featured.category} />
                    <div>
                      <p className="font-display text-fluid-3xl font-bold leading-none text-white/15">
                        {new Date(featured.date).getFullYear()}
                      </p>
                      <p className="mt-2 font-kasem text-sm text-kente-300">
                        Kasɛm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text panel */}
                <div className="flex flex-col p-7 sm:p-9">
                  <div className="flex items-center gap-2 text-xs font-medium text-charcoal-muted">
                    <time dateTime={featured.date}>
                      {formatUpdateDate(featured.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{featuredMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{featured.author}</span>
                  </div>
                  <h2 className="mt-3 text-balance font-display text-fluid-2xl font-bold leading-tight text-indigo-900">
                    {featured.title}
                  </h2>
                  {featuredParagraphs.slice(0, 2).map((para) => (
                    <p
                      key={para.slice(0, 32)}
                      className="mt-3 text-pretty text-sm leading-relaxed text-charcoal-muted"
                    >
                      {para}
                    </p>
                  ))}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button to="/about" variant="primary" size="md">
                      Explore the project
                    </Button>
                    <button
                      type="button"
                      onClick={() => void shareUpdate(featured)}
                      className="pk-focus inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                    >
                      <Glyph name="send" className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </Section>
      ) : null}

      {/* ===================== FILTERS + GRID ======================= */}
      <Section tone="white" spacing="lg" id="latest">
        <SectionHeader
          eyebrow="All updates"
          title="Everything we have shared so far"
          description="Filter by category or search by keyword. This list grows as real milestones happen — we do not pad it with announcements that did not occur."
        />

        {/* Controls */}
        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Category filter */}
          <div
            role="group"
            aria-label="Filter updates by category"
            className="flex flex-wrap gap-2"
          >
            {updateFilters.map((filter) => {
              const isActive = filter === activeFilter
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={`pk-focus inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-indigo-700 bg-indigo-700 text-white'
                      : 'border-indigo-200 bg-white text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="lg:w-72">
            <label htmlFor="updates-search" className="sr-only">
              Search updates
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted"
              >
                <Glyph name="search" className="h-4 w-4" />
              </span>
              <input
                id="updates-search"
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search updates…"
                className="min-h-[48px] w-full rounded-xl border border-indigo-200 bg-white pl-10 pr-4 text-base text-charcoal outline-none transition-colors placeholder:text-sand-500 focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Result count, polite live region */}
        <p role="status" className="mt-5 text-sm text-charcoal-muted">
          {filtered.length === 0
            ? 'No updates match your filters yet.'
            : `Showing ${filtered.length} ${
                filtered.length === 1 ? 'update' : 'updates'
              }${activeFilter !== 'All' ? ` in ${activeFilter}` : ''}.`}
        </p>

        {/* Grid OR empty state */}
        {filtered.length > 0 ? (
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((update) => (
              <RevealItem key={update.id}>
                <UpdateCard update={update} related={relatedFor(update)} />
              </RevealItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="mt-8">
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-indigo-200 bg-cream-50 p-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <Glyph name="search" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                Nothing here yet
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {isFiltering
                  ? 'No updates match your current filter and search. Try a different category or clear your filters.'
                  : 'We have not published updates in this view yet. Subscribe below to hear about the next one.'}
              </p>
              {isFiltering ? (
                <div className="mt-6">
                  <Button onClick={resetFilters} variant="outline" size="md">
                    Clear filters
                  </Button>
                </div>
              ) : null}
            </div>
          </Reveal>
        )}
      </Section>

      {/* ====================== STAY IN THE LOOP ==================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Stay in the loop"
              title="Get the next update in your inbox."
              description="Be the first to hear about new build updates, releases and ways to contribute. No spam — just real progress on putting Kasem on the digital map."
              tone="dark"
            />
            <Reveal className="mt-6">
              <ArrowLink
                to="/contributions"
                className="text-kente-300 hover:text-kente-200"
              >
                Or start contributing to the language
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 sm:p-8">
              <NewsletterForm tone="dark" />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
