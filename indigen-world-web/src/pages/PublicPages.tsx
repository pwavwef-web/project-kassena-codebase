import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import {
  ContentTier,
  contributionPathways,
  communities,
  consentRequirements,
  culturalRecords,
  culturalTiers,
  dictionaryPreview,
  heroImage,
  homeHighlights,
  impactMetrics,
  legalDrafts,
  missionImages,
  partnerPathways,
  programmes,
  updates,
  validatorRequirements,
  valueProps,
} from '../content/siteData'

const tierClasses: Record<ContentTier, string> = {
  Open: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Restricted: 'border-amber-200 bg-amber-50 text-amber-900',
  Sensitive: 'border-rose-200 bg-rose-50 text-rose-900',
}

function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro: string
}) {
  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">{intro}</p>
      </div>
    </section>
  )
}

function Section({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-7 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>
        {intro ? <p className="mt-3 leading-7 text-ink/70">{intro}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <article className={`rounded-lg border border-ink/10 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </article>
  )
}

function TierBadge({ tier }: { tier: ContentTier }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tierClasses[tier]}`}>
      {tier}
    </span>
  )
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-indigo/20 bg-indigo/5 px-2.5 py-1 text-xs font-semibold text-indigo">
      {label}
    </span>
  )
}

function MetadataList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-ink/75">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DemoStateRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm font-semibold text-ink">Loading state</p>
        <div className="mt-4 h-2 rounded-full bg-ink/10">
          <div className="h-2 w-2/3 rounded-full bg-indigo" />
        </div>
        <p className="mt-3 text-sm text-ink/60">Used when local fixtures become remote reads.</p>
      </Card>
      <Card>
        <p className="text-sm font-semibold text-ink">Empty state</p>
        <p className="mt-3 text-sm text-ink/60">No approved records yet. Submit a draft through TribeStudio.</p>
      </Card>
      <Card>
        <p className="text-sm font-semibold text-ink">Error state</p>
        <p className="mt-3 text-sm text-ink/60">Content could not load. Retry after checking the local data source.</p>
      </Card>
    </div>
  )
}

export function HomePage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indigen World',
    url: 'https://indigen.world',
    description:
      'A cultural technology ecosystem for Indigenous language and heritage preservation.',
  }

  return (
    <>
      <Seo
        title="Indigen World"
        description="Indigen World is a cultural technology ecosystem for language, story and heritage preservation."
        jsonLd={orgJsonLd}
      />
      <section className="relative overflow-hidden bg-ink text-cream">
        <img
          src={heroImage}
          alt="Project Kasena oral heritage visual from the migrated repository assets"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative mx-auto grid min-h-[74vh] max-w-6xl content-center gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Cultural technology ecosystem
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none md:text-7xl">
              Indigen World
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-cream/85">
              Preserving Indigenous languages, stories and heritage through
              consent-aware tools for communities, creators and validators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink" to="/programmes">
                Explore programmes
              </Link>
              <Link className="rounded-full border border-cream/40 px-5 py-3 text-sm font-semibold text-cream" to="/contribute">
                Contribute
              </Link>
            </div>
          </div>
          <div className="self-end rounded-lg border border-cream/20 bg-cream/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-gold">Flagship programme</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Project Kasena</h2>
            <p className="mt-3 text-sm leading-6 text-cream/80">{homeHighlights.flagship}</p>
            <img
              src="/brand/project-kasena-logo.png"
              alt="Project Kasena logo"
              className="mt-5 h-16 w-16 rounded-lg bg-white object-contain p-2"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Section title="What Indigen World Does" intro={homeHighlights.mission}>
        <div className="grid gap-4 md:grid-cols-2">
          {valueProps.map((prop) => (
            <Card key={prop}>
              <p className="font-semibold">{prop}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Featured Cultural Stories"
        intro="The MVP shows how story, proverb, oral-history and heritage-location records carry classification and source metadata."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {culturalRecords.map((record) => (
            <Card key={record.id}>
              <div className="flex items-center justify-between gap-3">
                <StatusBadge label={record.type} />
                <TierBadge tier={record.tier} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{record.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{record.summary}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Featured Language Content" intro="A small Kasem dictionary preview demonstrates the data shape. Entries are local demo data unless marked otherwise.">
        <DictionaryGrid />
      </Section>

      <Section title="Impact Preview" intro="These metrics are demonstration labels, not real-world statistics.">
        <MetricGrid />
      </Section>

      <Section title="Ways To Take Part">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Community participation', '/communities'],
            ['Creator workspace', '/contribute'],
            ['Partnership enquiry', '/partners'],
            ['Support the work', '/support'],
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className="rounded-lg border border-ink/10 bg-white p-5 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-indigo/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              {label}
              <span className="mt-3 block text-sm font-normal text-ink/60">Open section</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}

export function AboutPage() {
  return (
    <>
      <Seo title="About" description="Mission, vision, values and technology principles for Indigen World." path="/about" />
      <PageHero
        eyebrow="About"
        title="A platform for cultural sovereignty and careful technology."
        intro="Indigen World is designed around community stewardship, elder and custodian participation, and tools that make language data easier to preserve without treating culture as extractive content."
      />
      <Section title="Mission, Vision and Values">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Mission', 'Build practical tools that help communities document, teach and govern their own language and cultural records.'],
            ['Vision', 'A world where Indigenous knowledge can live digitally without losing consent, attribution or context.'],
            ['Values', 'Sovereignty, stewardship, transparency, accessibility, review before publication and humility around AI.'],
          ].map(([title, text]) => (
            <Card key={title}>
              <h2 className="font-display text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Stewardship Principles">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl font-semibold">Cultural sovereignty</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Community-specific governance decides what can be collected,
              reviewed, published, corrected, withdrawn or used for AI.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Elders and custodians</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Restricted and sensitive material should include escalation paths
              to elders or cultural custodians before publication.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Community stewardship</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Validators review dialect, source, consent, licence and sensitivity
              fields before any record becomes public learning material.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Technology principles</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Build local-first demos, keep secrets server-side, avoid production
              calls by default, and make human validation explicit.
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}

export function ProgrammesPage() {
  return (
    <>
      <Seo title="Programmes" description="Project Kasena and the Indigen World preservation programme framework." path="/programmes" />
      <PageHero
        eyebrow="Programmes"
        title="Project Kasena leads a careful programme framework."
        intro="The MVP includes the flagship Kasem programme and shows future concepts as roadmap items rather than active claims."
      />
      <Section title="Programme Areas">
        <div className="grid gap-4 md:grid-cols-2">
          {programmes.map((programme) => (
            <Card key={programme.title}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold">{programme.title}</h2>
                <StatusBadge label={programme.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/70">{programme.summary}</p>
              <div className="mt-4">
                <MetadataList items={programme.details} />
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

export function CommunitiesPage() {
  return (
    <>
      <Seo title="Communities" description="Community governance, validator requirements and consent pathways." path="/communities" />
      <PageHero
        eyebrow="Communities"
        title="One flagship programme, with a future expansion framework."
        intro="Kasena/Kasem is the active flagship programme in this MVP. Future communities are represented as a framework only."
      />
      <Section title="Community Status">
        <div className="grid gap-4 md:grid-cols-2">
          {communities.map((community) => (
            <Card key={community.name}>
              <StatusBadge label={community.status} />
              <h2 className="mt-4 font-display text-2xl font-semibold">{community.name}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{community.summary}</p>
              <p className="mt-3 text-sm leading-6 text-ink/70">{community.governance}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Validator and Consent Requirements">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl font-semibold">Validator requirements</h2>
            <div className="mt-4">
              <MetadataList items={validatorRequirements} />
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Consent requirements</h2>
            <div className="mt-4">
              <MetadataList items={consentRequirements} />
            </div>
          </Card>
        </div>
      </Section>
    </>
  )
}

export function LanguagesPage() {
  const [query, setQuery] = useState('')
  const filtered = dictionaryPreview.filter((entry) =>
    `${entry.english} ${entry.kasem} ${entry.partOfSpeech}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <>
      <Seo title="Languages" description="Kasem language profile, dictionary preview and contribution pathways." path="/languages" />
      <PageHero
        eyebrow="Languages"
        title="Discover Kasem through reviewed language records."
        intro="This MVP shows a local language discovery UI, a Kasem profile and contribution metadata without claiming a completed dictionary."
      />
      <Section title="Language Discovery">
        <label className="block max-w-xl">
          <span className="text-sm font-semibold text-ink">Search English or Kasem</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
            placeholder="Try water, thank you, story"
          />
        </label>
        <div className="mt-6">
          {filtered.length ? <DictionaryGrid entries={filtered} /> : <p className="rounded-lg border border-ink/10 bg-white p-5 text-sm text-ink/65">No matching demo entries yet.</p>}
        </div>
      </Section>
      <Section title="Kasem Language Profile">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <h2 className="font-display text-xl font-semibold">Profile</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Kasem is represented through Project Kasena as the flagship
              language programme. Demo entries need community validation before
              they are treated as authoritative.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Dialect information</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              Dialect fields are required on contribution forms and review
              queues. This MVP uses placeholder dialect notes only.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-semibold">Contribution pathways</h2>
            <MetadataList items={contributionPathways} />
          </Card>
        </div>
      </Section>
    </>
  )
}

export function StoriesPage() {
  return (
    <>
      <Seo title="Stories" description="Story, proverb, oral-history and heritage-location card templates." path="/stories" />
      <PageHero
        eyebrow="Stories"
        title="Cultural records need classification before publication."
        intro="The story library demonstrates attribution, source metadata and content tier badges. It does not publish sacred or private information."
      />
      <Section title="Cultural Record Cards">
        <div className="grid gap-4 md:grid-cols-2">
          {culturalRecords.map((record) => (
            <Card key={record.id}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={record.type} />
                <TierBadge tier={record.tier} />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">{record.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{record.summary}</p>
              <dl className="mt-5 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold text-ink">Classification</dt>
                  <dd className="text-ink/65">{record.classification}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Attribution</dt>
                  <dd className="text-ink/65">{record.attribution}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Source metadata</dt>
                  <dd className="text-ink/65">{record.source}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Permitted uses</dt>
                  <dd className="text-ink/65">{record.permittedUses}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Operational States">
        <DemoStateRow />
      </Section>
    </>
  )
}

export function ImpactPage() {
  return (
    <>
      <Seo title="Impact" description="Demonstration metrics and impact categories for the Indigen World MVP." path="/impact" />
      <PageHero
        eyebrow="Impact"
        title="Impact metrics are labelled as demonstrations."
        intro="The MVP does not invent real statistics. Every number below is either a demo interface count or an implementation confirmation."
      />
      <Section title="Demonstration Metrics">
        <MetricGrid />
      </Section>
      <Section title="Impact Categories">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Language access', 'Search, learning and contribution flows for Kasem demo content.'],
            ['Cultural stewardship', 'Review, consent, classification and takedown fields across records.'],
            ['Creator participation', 'Workspace paths for creators, validators, elders and administrators.'],
          ].map(([title, text]) => (
            <Card key={title}>
              <h2 className="font-display text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

export function PartnersPage() {
  return (
    <>
      <Seo title="Partners" description="Partnership enquiry paths for research, education and community support." path="/partners" />
      <PageHero
        eyebrow="Partners"
        title="Partnership starts with governance, not assumptions."
        intro="This page invites enquiries while avoiding invented partnerships, endorsements or institutional claims."
      />
      <Section title="Collaboration Pathways">
        <div className="grid gap-4 md:grid-cols-3">
          {partnerPathways.map((pathway) => (
            <Card key={pathway.title}>
              <h2 className="font-display text-xl font-semibold">{pathway.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">{pathway.text}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Partnership Enquiry">
        <LocalForm mode="partner" />
      </Section>
    </>
  )
}

export function ContributePage() {
  return (
    <>
      <Seo title="Contribute" description="Contribution pathways for language data, stories, creators and validators." path="/contribute" />
      <PageHero
        eyebrow="Contribute"
        title="Contribute with source, consent and review metadata."
        intro="Indigen World routes contributions through structured drafts and human validation before publication."
      />
      <Section title="Contribution Pathways">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {contributionPathways.map((pathway) => (
            <Card key={pathway}>
              <p className="font-semibold">{pathway}</p>
              <p className="mt-3 text-sm leading-6 text-ink/65">Local demo pathway in this MVP.</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Contribution Interest Form">
        <LocalForm mode="contribution" />
      </Section>
    </>
  )
}

export function SupportPage() {
  const [amount, setAmount] = useState('25')
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')

  return (
    <>
      <Seo title="Support" description="Donation placeholder, partnership enquiry and sponsorship pathways." path="/support" />
      <PageHero
        eyebrow="Support"
        title="Support UI placeholder with no payment processing."
        intro="The MVP shows donation, sponsorship and institutional support pathways without taking payment or calling production services."
      />
      <Section title="Donation Placeholder">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <label className="text-sm font-semibold text-ink" htmlFor="amount">
              Demo amount
            </label>
            <select
              id="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm"
            >
              <option value="25">25 demo units</option>
              <option value="50">50 demo units</option>
              <option value="100">100 demo units</option>
            </select>
            <button
              type="button"
              onClick={() => setStatus('ready')}
              className="mt-4 w-full rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white"
            >
              Preview pledge
            </button>
            {status === 'ready' ? (
              <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                Demo pledge for {amount} prepared locally. No payment was processed.
              </p>
            ) : null}
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {['Partnership enquiry', 'Sponsorship', 'Institutional support'].map((item) => (
              <Card key={item}>
                <h2 className="font-display text-lg font-semibold">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-ink/65">Use the contact page to discuss this pathway.</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}

export function UpdatesPage() {
  return (
    <>
      <Seo title="Updates" description="Local fixture updates and reusable article pages for Indigen World." path="/updates" />
      <PageHero
        eyebrow="Updates"
        title="Fixture updates for the MVP."
        intro="Articles are local data used to test listing and reusable article pages."
      />
      <Section title="Latest Updates">
        <div className="grid gap-4 md:grid-cols-2">
          {updates.map((article) => (
            <Card key={article.slug}>
              <StatusBadge label={article.category} />
              <h2 className="mt-4 font-display text-xl font-semibold">{article.title}</h2>
              <p className="mt-2 text-sm text-ink/55">{article.date}</p>
              <p className="mt-3 text-sm leading-6 text-ink/70">{article.excerpt}</p>
              <Link className="mt-5 inline-flex text-sm font-semibold text-indigo" to={`/updates/${article.slug}`}>
                Read article
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

export function ArticlePage() {
  const { slug } = useParams()
  const article = updates.find((item) => item.slug === slug)

  if (!article) {
    return (
      <>
        <Seo title="Update not found" description="The requested update could not be found." path="/updates" />
        <PageHero eyebrow="Updates" title="Update not found" intro="This local fixture article does not exist." />
      </>
    )
  }

  return (
    <>
      <Seo title={article.title} description={article.excerpt} path={`/updates/${article.slug}`} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/updates" className="text-sm font-semibold text-indigo">
          Back to updates
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-terracotta">
          {article.category}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-ink/55">{article.date}</p>
        <div className="mt-8 space-y-5 text-lg leading-8 text-ink/75">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <Seo title="Contact" description="Validated local contact form for Indigen World enquiries." path="/contact" />
      <PageHero
        eyebrow="Contact"
        title="Send a local demo enquiry."
        intro="This form validates input and shows success or error states. It does not submit to a production service."
      />
      <Section title="Contact Form">
        <LocalForm mode="contact" />
      </Section>
    </>
  )
}

export function PrivacyPage() {
  return <LegalPage slug="privacy" path="/privacy" />
}

export function TermsPage() {
  return <LegalPage slug="terms" path="/terms" />
}

export function CulturalDataPage() {
  return (
    <>
      <LegalPage slug="culturalData" path="/cultural-data" />
      <Section title="Content Classification">
        <div className="grid gap-4 md:grid-cols-3">
          {culturalTiers.map((tier) => (
            <Card key={tier.tier}>
              <TierBadge tier={tier.tier} />
              <p className="mt-4 text-sm leading-6 text-ink/70">{tier.examples}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}

function LegalPage({ slug, path }: { slug: keyof typeof legalDrafts; path: string }) {
  const draft = legalDrafts[slug]
  return (
    <>
      <Seo title={draft.title} description={`${draft.title} for Indigen World.`} path={path} />
      <PageHero eyebrow="Legal draft" title={draft.title} intro="This page is a placeholder pending legal and community review." />
      <section className="mx-auto max-w-3xl px-6 py-12 text-lg leading-8 text-ink/75">
        {draft.body.map((paragraph) => (
          <p className="mb-5" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>
    </>
  )
}

function DictionaryGrid({ entries = dictionaryPreview }: { entries?: typeof dictionaryPreview }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {entries.map((entry) => (
        <Card key={`${entry.english}-${entry.kasem}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
              {entry.partOfSpeech}
            </p>
            <TierBadge tier={entry.tier} />
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">{entry.english}</h3>
          <p className="mt-1 text-xl font-semibold text-indigo">{entry.kasem}</p>
          <dl className="mt-4 space-y-2 text-sm text-ink/70">
            <div>
              <dt className="font-semibold text-ink">Dialect</dt>
              <dd>{entry.dialect}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Example</dt>
              <dd>{entry.example}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Source</dt>
              <dd>{entry.source}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  )
}

function MetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {impactMetrics.map((metric) => (
        <Card key={metric.label}>
          <p className="text-sm font-semibold text-ink/65">{metric.label}</p>
          <p className="mt-4 font-display text-4xl font-semibold text-indigo">{metric.value}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-terracotta">
            {metric.qualifier}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/65">{metric.note}</p>
        </Card>
      ))}
    </div>
  )
}

function LocalForm({ mode }: { mode: 'contact' | 'partner' | 'contribution' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: mode,
    message: '',
    consent: false,
  })
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle')

  const label = useMemo(() => {
    if (mode === 'partner') return 'Partnership enquiry'
    if (mode === 'contribution') return 'Contribution interest'
    return 'Contact enquiry'
  }, [mode])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.message.trim() || !form.consent) {
      setState('error')
      return
    }
    setState('success')
  }

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <form onSubmit={submit} className="max-w-2xl rounded-lg border border-ink/10 bg-white p-5 shadow-sm" noValidate>
      <h2 className="font-display text-xl font-semibold">{label}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Name
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
          />
        </label>
        <label className="text-sm font-semibold text-ink">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
          />
        </label>
      </div>
      <label className="mt-4 block text-sm font-semibold text-ink">
        Enquiry type
        <select
          name="type"
          value={form.type}
          onChange={updateField}
          className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
        >
          <option value="contact">General contact</option>
          <option value="partner">Partnership</option>
          <option value="contribution">Contribution</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-semibold text-ink">
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={updateField}
          rows={5}
          className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
        />
      </label>
      <label className="mt-4 flex gap-3 text-sm leading-6 text-ink/75">
        <input
          name="consent"
          type="checkbox"
          checked={form.consent}
          onChange={updateField}
          className="mt-1 h-4 w-4 rounded border-ink/20 text-indigo focus:ring-indigo"
        />
        I understand this MVP stores no production submission and that cultural
        material needs consent before review or publication.
      </label>
      <button type="submit" className="mt-5 rounded-lg bg-indigo px-5 py-3 text-sm font-semibold text-white">
        Validate locally
      </button>
      {state === 'success' ? (
        <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          Success state: this validated locally. No production submission service was called.
        </p>
      ) : null}
      {state === 'error' ? (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-900">
          Error state: add a name, valid email, message and consent acknowledgement.
        </p>
      ) : null}
    </form>
  )
}

export function MissionGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {missionImages.map((image) => (
        <figure key={image.src} className="overflow-hidden rounded-lg border border-ink/10 bg-white">
          <img src={image.src} alt={image.alt} loading="lazy" className="h-56 w-full object-cover" />
          <figcaption className="p-4 text-sm font-medium text-ink/70">{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
