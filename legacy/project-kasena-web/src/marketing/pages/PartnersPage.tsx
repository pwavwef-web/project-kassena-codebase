import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collaborationPrinciples,
  partnerPathways,
} from '../../content/partners'
import { site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { submitContactMessage } from '../lib/forms'
import type { ContactPayload, FormResult } from '../lib/forms'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { Glyph } from '../components/ui/Glyph'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface FormFields {
  name: string
  email: string
  organization: string
  message: string
  /** Honeypot — must stay empty for real users. */
  website: string
}

const emptyForm: FormFields = {
  name: '',
  email: '',
  organization: '',
  message: '',
  website: '',
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

const validate = (fields: FormFields): FieldErrors => {
  const errors: FieldErrors = {}
  if (fields.name.trim().length < 2) {
    errors.name = 'Please tell us your name.'
  }
  if (!isValidEmail(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (fields.message.trim().length < 10) {
    errors.message = 'Please add a little more detail (at least 10 characters).'
  }
  return errors
}

// ---------------------------------------------------------------------------
// Partnership enquiry form
// ---------------------------------------------------------------------------

const PartnershipForm = () => {
  const baseId = useId()
  const fieldId = (name: string) => `${baseId}-${name}`
  const [fields, setFields] = useState<FormFields>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')

  const update =
    (key: keyof FormFields) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setFeedback('Please fix the highlighted fields and try again.')
      return
    }

    setStatus('loading')
    setFeedback('')

    const payload: ContactPayload = {
      name: fields.name,
      email: fields.email,
      enquiryType: 'partnership',
      organization: fields.organization,
      message: fields.message,
      website: fields.website,
    }

    const result: FormResult = await submitContactMessage(payload)

    if (result.ok) {
      track(events.partnerSubmit, { source: 'partners_page' })
      setStatus('success')
      setFeedback(
        'Thank you — your message has reached us. We will reply from the partnerships team.',
      )
      setFields(emptyForm)
      setErrors({})
    } else {
      setStatus('error')
      setFeedback(
        result.error ??
          `We could not send your message. Please email ${site.contact.partnershipsEmail}.`,
      )
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-3xl border border-savannah-200 bg-savannah-50 p-8 text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-savannah-100 text-savannah-700">
          <Glyph name="check" className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-fluid-lg font-bold text-indigo-900">
          Message received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
          {feedback}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setFeedback('')
          }}
          className="pk-focus mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full border border-indigo-200 bg-white px-5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  const inputClass = (hasError: boolean) =>
    `min-h-[48px] w-full rounded-xl border px-4 text-base text-charcoal outline-none transition-colors placeholder:text-sand-500 ${
      hasError
        ? 'border-terracotta-400 focus:border-terracotta-500'
        : 'border-indigo-200 focus:border-indigo-400'
    }`

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Honeypot — visually hidden, off-screen, not announced or focusable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId('website')}>
          Leave this field empty
          <input
            id={fieldId('website')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={update('website')}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={fieldId('name')}
            className="text-sm font-semibold text-indigo-900"
          >
            Your name <span className="text-terracotta-600">*</span>
          </label>
          <input
            id={fieldId('name')}
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? fieldId('name-err') : undefined}
            className={inputClass(Boolean(errors.name))}
            placeholder="Full name"
          />
          {errors.name ? (
            <p
              id={fieldId('name-err')}
              role="alert"
              className="text-sm text-terracotta-600"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={fieldId('email')}
            className="text-sm font-semibold text-indigo-900"
          >
            Email <span className="text-terracotta-600">*</span>
          </label>
          <input
            id={fieldId('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={fields.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? fieldId('email-err') : undefined}
            className={inputClass(Boolean(errors.email))}
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p
              id={fieldId('email-err')}
              role="alert"
              className="text-sm text-terracotta-600"
            >
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <label
          htmlFor={fieldId('organization')}
          className="text-sm font-semibold text-indigo-900"
        >
          Organisation{' '}
          <span className="font-normal text-charcoal-muted">(optional)</span>
        </label>
        <input
          id={fieldId('organization')}
          type="text"
          autoComplete="organization"
          value={fields.organization}
          onChange={update('organization')}
          className={inputClass(false)}
          placeholder="School, NGO, company, community group…"
        />
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <label
          htmlFor={fieldId('message')}
          className="text-sm font-semibold text-indigo-900"
        >
          How would you like to collaborate?{' '}
          <span className="text-terracotta-600">*</span>
        </label>
        <textarea
          id={fieldId('message')}
          rows={5}
          value={fields.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? fieldId('message-err') : undefined}
          className={`w-full rounded-xl border px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-sand-500 ${
            errors.message
              ? 'border-terracotta-400 focus:border-terracotta-500'
              : 'border-indigo-200 focus:border-indigo-400'
          }`}
          placeholder="Tell us who you are and what you have in mind. There is no commitment — this just starts a conversation."
        />
        {errors.message ? (
          <p
            id={fieldId('message-err')}
            role="alert"
            className="text-sm text-terracotta-600"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === 'error' && feedback ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm font-medium text-terracotta-700"
        >
          {feedback}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : 'Send partnership enquiry'}
        </Button>
        <p className="text-xs leading-relaxed text-charcoal-muted">
          We will only use your details to reply. See our{' '}
          <Link
            to="/privacy"
            className="pk-focus font-semibold text-terracotta-600 hover:underline"
          >
            privacy approach
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Pathway accordion card
// ---------------------------------------------------------------------------

const PathwayCard = ({
  pathway,
  open,
  onToggle,
}: {
  pathway: (typeof partnerPathways)[number]
  open: boolean
  onToggle: () => void
}) => {
  const panelId = `pathway-panel-${pathway.id}`
  const buttonId = `pathway-button-${pathway.id}`

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
        open
          ? 'border-indigo-200 shadow-card'
          : 'border-indigo-100 shadow-soft hover:shadow-card'
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="pk-focus flex w-full items-center gap-4 px-5 py-5 text-left"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
            <Glyph name={pathway.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-bold text-indigo-900">
              {pathway.title}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-charcoal-muted">
              {pathway.summary}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-100 text-indigo-700 transition-transform duration-300 ${
              open ? 'rotate-45 bg-indigo-50' : ''
            }`}
          >
            +
          </span>
        </button>
      </h3>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="border-t border-indigo-100 px-5 pb-6 pt-5"
        >
          <p className="text-sm leading-relaxed text-charcoal">
            <span className="font-semibold text-indigo-900">
              Why it matters.{' '}
            </span>
            {pathway.whyItMatters}
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <PathwayList
              label="What collaboration looks like"
              items={pathway.whatCollaborationLooksLike}
              accent="text-indigo-700"
            />
            <PathwayList
              label="What we provide"
              items={pathway.whatWeProvide}
              accent="text-savannah-600"
            />
            <PathwayList
              label="What we expect"
              items={pathway.whatWeExpect}
              accent="text-terracotta-600"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

const PathwayList = ({
  label,
  items,
  accent,
}: {
  label: string
  items: string[]
  accent: string
}) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal-muted">
      {label}
    </p>
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-charcoal">
          <span className={`mt-0.5 shrink-0 ${accent}`}>
            <Glyph name="check" className="h-4 w-4" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const PartnersPage = () => {
  const [openId, setOpenId] = useState<string | null>(partnerPathways[0].id)

  return (
    <>
      <Seo
        title="Partners & Collaborate"
        description="Explore the many ways to collaborate with Project Kasena — from traditional leaders and teachers to schools, researchers, NGOs and volunteers. Start a conversation about working together to keep Kasem alive online."
        path="/partners"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Partners & Collaborate — Project Kasena',
            url: `${site.url}/partners`,
            description:
              'Ways to collaborate with Project Kasena on building verified, community-owned Kasem language infrastructure.',
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-20 top-0 h-72 w-72 rounded-full bg-terracotta-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-savannah-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cream-200/85">
                <span className="h-1.5 w-1.5 rounded-full bg-kente-400" />
                Partners &amp; Collaborate
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.04] tracking-tight">
                Keeping a language alive{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  takes many hands
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                Project Kasena is community-owned and consent-first. We are
                actively looking for elders, teachers, schools, researchers,
                organisations and volunteers we hope to collaborate with — each
                with a clear role and a fair exchange.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <p className="mt-4 max-w-xl text-sm text-cream-200/70">
                We do not list confirmed partners here. This page is an open
                invitation, not a claim of existing endorsements.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="#enquiry" external={false} variant="gold" size="lg">
                  Start a conversation
                </Button>
                <Button
                  href="#pathways"
                  external={false}
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  Explore the pathways
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero visual — collaboration principles glass panel */}
          <Reveal delay={0.2} className="relative">
            <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-6 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                How we collaborate
              </p>
              <ul className="mt-5 space-y-4">
                {collaborationPrinciples.map((principle) => (
                  <li key={principle.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                      <Glyph name={principle.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-base font-bold text-cream-100">
                        {principle.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-cream-200/75">
                        {principle.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= INTRO ========================= */}
      <Section tone="cream" spacing="lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Ways to collaborate"
            title="A role for every kind of collaborator"
            description="Twelve pathways, each with an honest description of why it matters, what working together could look like, what we can offer, and what we ask in return. Open any card to see the detail."
          />
          <Reveal className="shrink-0">
            <ArrowLink href="#enquiry">Skip to the enquiry form</ArrowLink>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {collaborationPrinciples.map((principle) => (
            <RevealItem
              key={principle.title}
              className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Glyph name={principle.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-indigo-900">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                {principle.description}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ======================= PATHWAYS ======================= */}
      <Section tone="white" spacing="lg" id="pathways">
        <SectionHeader
          eyebrow="Collaboration pathways"
          title="Organisations and people we hope to collaborate with"
          description="These are the kinds of collaborators we are inviting — not a list of confirmed partners. Each pathway below is an open door."
        />

        <div className="mt-12 grid gap-4">
          {partnerPathways.map((pathway) => (
            <Reveal key={pathway.id}>
              <PathwayCard
                pathway={pathway}
                open={openId === pathway.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === pathway.id ? null : pathway.id,
                  )
                }
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ==================== HONESTY / PROMISE ==================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <SectionHeader
            eyebrow="Our collaboration promise"
            title="What you can rely on when you work with us"
            description="The same honesty rules apply to partners as to everyone else. We would rather under-promise than misrepresent the project."
            tone="dark"
          />
          <Stagger className="grid gap-4">
            {[
              {
                title: 'No confirmed-partner claims',
                body: 'We will never list your organisation as a partner, funder or endorser without your clear, written agreement.',
                icon: 'shield' as const,
              },
              {
                title: 'Honest status language',
                body: 'Tools are labelled Available, In development, Planned or Research. Future AI and voice work stays in research and planning until it is genuinely ready.',
                icon: 'check' as const,
              },
              {
                title: 'Consent and attribution',
                body: 'Contributed knowledge carries consent and attribution, with the right to withdraw. Sacred or restricted material is kept out by design.',
                icon: 'heart' as const,
              },
              {
                title: 'Transparent targets',
                body: 'Numbers are either live counts or clearly-labelled targets. We report progress honestly, including what is still pending.',
                icon: 'analytics' as const,
              },
            ].map((item) => (
              <RevealItem
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                    <Glyph name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-cream-100">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-cream-200/80">
                      {item.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ====================== ENQUIRY FORM ====================== */}
      <Section tone="cream" spacing="lg" id="enquiry">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Start a conversation"
              title="Tell us how you would like to collaborate"
              description="Send a short message and the partnerships team will reply. There is no commitment — this just opens a conversation about what working together could look like."
            />
            <Reveal className="mt-8">
              <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold text-indigo-900">
                  Prefer email?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  You can reach the partnerships team directly. This inbox is a
                  draft pending final confirmation by the team.
                </p>
                {/* PLACEHOLDER inbox — confirm before launch (see content/site.ts). */}
                <a
                  href={`mailto:${site.contact.partnershipsEmail}`}
                  className="pk-focus mt-3 inline-flex items-center gap-2 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
                >
                  <Glyph name="send" className="h-4 w-4" />
                  {site.contact.partnershipsEmail}
                </a>
                <p className="mt-4 border-t border-indigo-50 pt-4 text-xs leading-relaxed text-charcoal-muted">
                  Based in {site.contact.location}. We work with collaborators
                  locally and across the diaspora.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <div className="relative rounded-3xl border border-indigo-100 bg-white p-6 shadow-card sm:p-8">
              <PartnershipForm />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ======================= CLOSING CTA ======================= */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="sirigu" color="text-kente-400" opacity={0.07} />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
            Build it with us
          </Eyebrow>
          <h2 className="mt-5 text-balance font-display text-fluid-3xl font-bold leading-[1.12] text-cream-100">
            Every collaborator helps keep Kasem in the future.
          </h2>
          <p className="mt-5 text-pretty text-cream-200/80">
            Whether you bring knowledge, time, reach or resources, there is a way
            to contribute that respects the community and the language.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#enquiry" external={false} variant="gold" size="lg">
              Send a partnership enquiry
            </Button>
            <Button
              to="/contributors"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              See how to contribute
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
