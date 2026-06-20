import { Link, Navigate, useParams } from 'react-router-dom'
import { getLegalDoc, legalDocs } from '../../content/legal'
import { Seo } from '../lib/seo'
import { Reveal } from '../components/motion/Reveal'
import { Section } from '../components/ui/Section'

const formatDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const doc = slug ? getLegalDoc(slug) : undefined

  if (!doc) {
    return <Navigate to="/legal/privacy" replace />
  }

  return (
    <>
      <Seo
        title={doc.title}
        description={doc.summary}
        path={`/legal/${doc.slug}`}
        noindex={doc.status === 'draft'}
      />

      {/* Hero */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <div className="container py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
            Legal & governance
          </p>
          <h1 className="mt-3 font-display text-fluid-3xl font-bold tracking-tight">
            {doc.title}
          </h1>
          <p className="mt-3 max-w-2xl text-cream-200/80">{doc.summary}</p>
          <p className="mt-4 text-sm text-cream-200/60">
            Last updated {formatDate(doc.lastUpdated)}
          </p>
        </div>
      </section>

      <Section tone="cream" spacing="md">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          {/* Sidebar index */}
          <nav aria-label="Legal documents" className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal-muted">
              Documents
            </h2>
            <ul className="mt-3 space-y-1">
              {legalDocs.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/legal/${item.slug}`}
                    aria-current={item.slug === doc.slug ? 'page' : undefined}
                    className={`pk-focus block rounded-lg px-3 py-2 text-sm transition-colors ${
                      item.slug === doc.slug
                        ? 'bg-indigo-700 font-semibold text-cream-100'
                        : 'text-indigo-800 hover:bg-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Body */}
          <article className="max-w-prose">
            {doc.status === 'draft' ? (
              <Reveal>
                <div
                  role="note"
                  className="mb-8 rounded-2xl border border-kente-200 bg-kente-50 px-5 py-4 text-sm text-kente-900"
                >
                  <strong className="font-semibold">
                    Draft pending legal review.
                  </strong>{' '}
                  {doc.intro}
                </div>
              </Reveal>
            ) : null}

            {doc.sections.map((section) => (
              <Reveal key={section.heading} className="mb-8">
                <h2 className="font-display text-fluid-lg font-bold text-indigo-900">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="mt-3 text-pretty leading-relaxed text-charcoal-muted"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-3 space-y-1.5">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-charcoal-muted"
                      >
                        <span aria-hidden="true" className="text-terracotta-500">
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ))}

            <p className="mt-10 text-sm text-charcoal-muted">
              Have a question about this document?{' '}
              <Link
                to="/contact"
                className="pk-focus font-semibold text-terracotta-600 hover:underline"
              >
                Contact the team →
              </Link>
            </p>
          </article>
        </div>
      </Section>
    </>
  )
}
