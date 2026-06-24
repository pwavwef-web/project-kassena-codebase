import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { events, track } from '../lib/analytics'
import { submitContactMessage } from '../lib/forms'
import type { ContactPayload, EnquiryType } from '../lib/forms'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { ArrowLink, Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

/* ------------------------------------------------------------------ */
/* Enquiry types — labels match the EnquiryType union from lib/forms.  */
/* ------------------------------------------------------------------ */

interface EnquiryOption {
  value: EnquiryType
  label: string
  description: string
  icon: string
}

const enquiryOptions: EnquiryOption[] = [
  {
    value: 'general',
    label: 'General enquiry',
    description: 'Questions about the project, the language work, or how to get involved.',
    icon: 'community',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'Schools, NGOs, institutions, or organisations exploring collaboration.',
    icon: 'users',
  },
  {
    value: 'research',
    label: 'Research',
    description: 'Linguists and academics interested in datasets or joint study.',
    icon: 'book',
  },
  {
    value: 'media',
    label: 'Media',
    description: 'Press, interviews, and requests for project background.',
    icon: 'speaker',
  },
  {
    value: 'data-drive',
    label: 'School or community data drive',
    description: 'Host a contribution drive with learners, elders, or community groups.',
    icon: 'upload',
  },
  {
    value: 'technical',
    label: 'Technical collaboration',
    description: 'Engineers, NLP practitioners, and tooling contributors.',
    icon: 'data',
  },
  {
    value: 'funding',
    label: 'Funding',
    description: 'Grants, sponsorship, and longer-term support enquiries.',
    icon: 'heart',
  },
  {
    value: 'cultural-correction',
    label: 'Cultural correction or takedown',
    description: 'Flag content that is inaccurate, sensitive, restricted, or sacred.',
    icon: 'shield',
  },
  {
    value: 'data-protection',
    label: 'Data protection enquiry',
    description: 'Questions about how contributed data is stored, used, or removed.',
    icon: 'shield',
  },
]

/* ------------------------------------------------------------------ */
/* Direct contact channels, sourced from site.contact (placeholders).  */
/* ------------------------------------------------------------------ */

interface ContactChannel {
  label: string
  email: string
  description: string
  icon: string
}

const contactChannels: ContactChannel[] = [
  {
    label: 'General',
    email: site.contact.generalEmail,
    description: 'Anything that does not fit a category below.',
    icon: 'send',
  },
  {
    label: 'Partnerships',
    email: site.contact.partnershipsEmail,
    description: 'Schools, institutions, and collaborators.',
    icon: 'users',
  },
  {
    label: 'Media & press',
    email: site.contact.pressEmail,
    description: 'Interviews and project background.',
    icon: 'speaker',
  },
  {
    label: 'Data protection',
    email: site.contact.dataProtectionEmail,
    description: 'Privacy, storage, and removal requests.',
    icon: 'shield',
  },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

export const ContactPage = () => {
  const formId = useId()

  const [enquiryType, setEnquiryType] = useState<EnquiryType>('general')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  // Honeypot — must stay empty for real humans.
  const [website, setWebsite] = useState('')

  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState('')

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!name.trim()) next.name = 'Please tell us your name.'
    if (!email.trim()) next.email = 'Please enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Please enter a valid email address.'
    if (!message.trim()) next.message = 'Please add a short message.'
    return next
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setOrganization('')
    setSubject('')
    setMessage('')
    setEnquiryType('general')
    setWebsite('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setSubmitError('')
      return
    }

    setStatus('loading')
    setSubmitError('')

    const payload: ContactPayload = {
      name: name.trim(),
      email: email.trim(),
      enquiryType,
      organization: organization.trim() || undefined,
      subject: subject.trim() || undefined,
      message: message.trim(),
      website,
    }

    const result = await submitContactMessage(payload)

    if (result.ok) {
      track(events.contactSubmit, { enquiryType })
      setStatus('success')
      setErrors({})
      resetForm()
    } else {
      setStatus('error')
      setSubmitError(
        result.error ??
          `Something went wrong. Please email us at ${site.contact.generalEmail}.`,
      )
    }
  }

  const selectedOption = useMemo(
    () => enquiryOptions.find((option) => option.value === enquiryType),
    [enquiryType],
  )

  const inputBase =
    'min-h-[48px] w-full rounded-xl border bg-white px-4 text-base text-charcoal outline-none transition-colors placeholder:text-sand-500 focus:border-indigo-400'
  const inputOk = 'border-indigo-200'
  const inputBad = 'border-terracotta-400 focus:border-terracotta-500'

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Project Kasena — partnerships, research, media, data drives, funding, cultural corrections, and data-protection enquiries."
        path="/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Project Kasena',
            url: `${site.url}/contact`,
            description:
              'Reach the Project Kasena team for partnerships, research, media, data drives, funding, and data-protection enquiries.',
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
          className="pk-aurora absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-terracotta-500/20 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
          <div>
            <Reveal>
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Talk to the team
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                Let&apos;s build the future of{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  Kasɛm
                </span>{' '}
                together
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                Whether you are a school, a researcher, a partner organisation, or
                a member of the community with a correction to make — we want to
                hear from you. Tell us what you need and we will route it to the
                right people.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={`#${formId}-form`} external={false} variant="gold" size="lg">
                  Send a message
                </Button>
                <Button
                  href={`mailto:${site.contact.generalEmail}`}
                  external={false}
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                  leading={<Glyph name="send" className="h-5 w-5" />}
                >
                  {site.contact.generalEmail}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-cream-200/70">
                <span className="text-kente-300">
                  <Glyph name="globe" className="h-4 w-4" />
                </span>
                {site.contact.location}
              </p>
            </Reveal>
          </div>

          {/* Quick channel card */}
          <Reveal delay={0.2} className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-kente-300">
                Direct channels
              </p>
              <ul className="mt-5 space-y-4">
                {contactChannels.map((channel) => (
                  <li key={channel.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-kente-300">
                      <Glyph name={channel.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-cream-100">
                        {channel.label}
                      </p>
                      <a
                        href={`mailto:${channel.email}`}
                        className="pk-focus block truncate text-sm text-kente-300 underline-offset-4 hover:underline"
                      >
                        {channel.email}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-cream-200/70">
                Email addresses are project placeholders pending confirmation
                before launch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== FORM + SIDEBAR ====================== */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:gap-12">
          {/* ----------------------- FORM ----------------------- */}
          <div>
            <SectionHeader
              eyebrow="Send a message"
              title="Reach the right desk"
              description="Choose the kind of enquiry so we can route your message to the people who can help. Fields marked with an asterisk are required."
            />

            <Reveal delay={0.1}>
              <form
                id={`${formId}-form`}
                onSubmit={handleSubmit}
                noValidate
                className="mt-10 rounded-3xl border border-indigo-100 bg-white p-6 shadow-soft sm:p-8"
              >
                {/* Enquiry type radio group */}
                <fieldset>
                  <legend className="text-sm font-bold text-indigo-900">
                    What is this about?{' '}
                    <span className="text-terracotta-500" aria-hidden="true">
                      *
                    </span>
                  </legend>
                  <div
                    role="radiogroup"
                    aria-label="Enquiry type"
                    className="mt-4 grid gap-3 sm:grid-cols-2"
                  >
                    {enquiryOptions.map((option) => {
                      const checked = enquiryType === option.value
                      return (
                        <label
                          key={option.value}
                          className={`pk-focus group flex min-h-[44px] cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                            checked
                              ? 'border-indigo-500 bg-indigo-50 shadow-soft'
                              : 'border-indigo-100 bg-cream-50 hover:border-indigo-200 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="enquiryType"
                            value={option.value}
                            checked={checked}
                            onChange={() => setEnquiryType(option.value)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                              checked
                                ? 'bg-indigo-700 text-cream-100'
                                : 'bg-white text-indigo-700 ring-1 ring-inset ring-indigo-100'
                            }`}
                          >
                            <Glyph name={option.icon} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-indigo-900">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-charcoal-muted">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                {/* Name + email */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`${formId}-name`}
                      className="mb-2 block text-sm font-semibold text-indigo-900"
                    >
                      Name{' '}
                      <span className="text-terracotta-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id={`${formId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${formId}-name-err` : undefined}
                      className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
                      placeholder="Your full name"
                    />
                    {errors.name ? (
                      <p
                        id={`${formId}-name-err`}
                        role="alert"
                        className="mt-1.5 text-sm font-medium text-terracotta-600"
                      >
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-email`}
                      className="mb-2 block text-sm font-semibold text-indigo-900"
                    >
                      Email{' '}
                      <span className="text-terracotta-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${formId}-email-err` : undefined}
                      className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
                      placeholder="you@example.com"
                    />
                    {errors.email ? (
                      <p
                        id={`${formId}-email-err`}
                        role="alert"
                        className="mt-1.5 text-sm font-medium text-terracotta-600"
                      >
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Organization + subject */}
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`${formId}-org`}
                      className="mb-2 block text-sm font-semibold text-indigo-900"
                    >
                      Organisation{' '}
                      <span className="font-normal text-charcoal-muted">(optional)</span>
                    </label>
                    <input
                      id={`${formId}-org`}
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className={`${inputBase} ${inputOk}`}
                      placeholder="School, NGO, institution…"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-subject`}
                      className="mb-2 block text-sm font-semibold text-indigo-900"
                    >
                      Subject{' '}
                      <span className="font-normal text-charcoal-muted">(optional)</span>
                    </label>
                    <input
                      id={`${formId}-subject`}
                      name="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`${inputBase} ${inputOk}`}
                      placeholder="A short summary"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6">
                  <label
                    htmlFor={`${formId}-message`}
                    className="mb-2 block text-sm font-semibold text-indigo-900"
                  >
                    Message{' '}
                    <span className="text-terracotta-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${formId}-message-err` : undefined}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-sand-500 focus:border-indigo-400 ${
                      errors.message ? inputBad : inputOk
                    }`}
                    placeholder={
                      selectedOption
                        ? `Tell us about your ${selectedOption.label.toLowerCase()}…`
                        : 'How can we help?'
                    }
                  />
                  {errors.message ? (
                    <p
                      id={`${formId}-message-err`}
                      role="alert"
                      className="mt-1.5 text-sm font-medium text-terracotta-600"
                    >
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {/* Honeypot — visually hidden, not announced to humans. */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor={`${formId}-website`}>
                    Leave this field empty
                    <input
                      id={`${formId}-website`}
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>

                {/* Submit */}
                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status === 'loading'}
                    trailing={
                      status === 'loading' ? null : (
                        <Glyph name="send" className="h-5 w-5" />
                      )
                    }
                  >
                    {status === 'loading' ? 'Sending…' : 'Send message'}
                  </Button>
                  <p className="text-xs text-charcoal-muted">
                    We typically reply by email. Your details are only used to
                    respond to you.
                  </p>
                </div>

                {/* Live status region (screen-reader friendly). */}
                <div aria-live="polite" className="mt-4">
                  {status === 'success' ? (
                    <p
                      role="status"
                      className="flex items-start gap-3 rounded-2xl border border-savannah-200 bg-savannah-50 px-4 py-3 text-sm font-medium text-savannah-700"
                    >
                      <span aria-hidden="true" className="mt-0.5 text-savannah-600">
                        <Glyph name="check" className="h-5 w-5" />
                      </span>
                      <span>
                        Thank you — your message has been sent. We will get back
                        to you by email as soon as we can.
                      </span>
                    </p>
                  ) : null}
                  {status === 'error' && submitError ? (
                    <p
                      role="alert"
                      className="flex items-start gap-3 rounded-2xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm font-medium text-terracotta-700"
                    >
                      <span aria-hidden="true" className="mt-0.5">
                        <Glyph name="refresh" className="h-5 w-5" />
                      </span>
                      <span>{submitError}</span>
                    </p>
                  ) : null}
                  {status === 'error' && !submitError ? (
                    <p
                      role="alert"
                      className="rounded-2xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm font-medium text-terracotta-700"
                    >
                      Please fix the highlighted fields and try again.
                    </p>
                  ) : null}
                </div>
              </form>
            </Reveal>
          </div>

          {/* ---------------------- SIDEBAR --------------------- */}
          <aside className="lg:pt-2">
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-soft sm:p-7">
                <h2 className="font-display text-fluid-lg font-bold text-indigo-900">
                  Contact details
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  Prefer email? Reach the relevant desk directly. Every address
                  opens your mail client.
                </p>
                <ul className="mt-5 space-y-4">
                  {contactChannels.map((channel) => (
                    <li
                      key={channel.label}
                      className="rounded-2xl border border-indigo-100 bg-cream-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                          <Glyph name={channel.icon} className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-bold text-indigo-900">
                          {channel.label}
                        </p>
                      </div>
                      <a
                        href={`mailto:${channel.email}`}
                        className="pk-focus mt-2 block truncate text-sm font-semibold text-terracotta-600 underline-offset-4 hover:underline"
                      >
                        {channel.email}
                      </a>
                      <p className="mt-1 text-xs leading-relaxed text-charcoal-muted">
                        {channel.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-6 rounded-3xl border border-savannah-200 bg-white p-6 shadow-soft sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-savannah-100 text-savannah-700">
                  <Glyph name="globe" className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-fluid-lg font-bold text-indigo-900">
                  Where we work
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  {site.contact.location}. We do not publish private addresses or
                  phone numbers — email is the best way to reach us.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-6 rounded-3xl border border-terracotta-200 bg-terracotta-50 p-6 shadow-soft sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-terracotta-600">
                  <Glyph name="shield" className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-fluid-lg font-bold text-indigo-900">
                  Cultural corrections
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  Spotted something inaccurate, sensitive, or that should not be
                  public? Choose &ldquo;Cultural correction or takedown&rdquo; in
                  the form. Source and consent always come first.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* ===================== WAYS TO ENGAGE ====================== */}
      <Section tone="white" spacing="lg">
        <SectionHeader
          eyebrow="More ways to get involved"
          title="Not sure where to start?"
          description="Contact is one door in. Here are a few paths that might fit what you are looking for."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <RevealItem className="flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
              <Glyph name="upload" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
              Contribute to the language
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
              Add words, examples, and recordings that help build a verified
              Kasem dataset.
            </p>
            <Link
              to="/build"
              onClick={() => track(events.contributeClick, { source: 'contact' })}
              className="pk-focus mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
            >
              Explore the ecosystem
              <span aria-hidden="true">→</span>
            </Link>
          </RevealItem>

          <RevealItem className="flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-savannah-600 text-cream-100">
              <Glyph name="users" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
              Partner with us
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
              Schools, NGOs, and institutions can run data drives and shape the
              roadmap together.
            </p>
            <ArrowLink to="/partners" className="mt-4">
              See partnership options
            </ArrowLink>
          </RevealItem>

          <RevealItem className="flex flex-col rounded-2xl border border-indigo-100 bg-cream-50 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-500 text-cream-100">
              <Glyph name="heart" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
              Support the work
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
              Help fund the open infrastructure that keeps the language alive
              online.
            </p>
            <Link
              to="/support"
              onClick={() => track(events.supportView, { source: 'contact' })}
              className="pk-focus mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
            >
              Ways to support
              <span aria-hidden="true">→</span>
            </Link>
          </RevealItem>
        </Stagger>
      </Section>

      {/* ======================= CLOSING CTA ======================= */}
      <Section tone="dark" spacing="lg">
        <CulturalPatternLayer variant="dots" color="text-kente-400" opacity={0.08} />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="text-kente-400">
            <Glyph name="sparkles" className="mx-auto h-8 w-8" />
          </span>
          <h2 className="mt-6 text-balance font-display text-fluid-3xl font-bold leading-[1.15] text-cream-100">
            A language should not disappear from the future.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-cream-200/80">
            Reach out with a question, an idea, or a correction. Every message
            helps us keep Kasem alive online.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              href={`mailto:${site.contact.generalEmail}`}
              external={false}
              variant="gold"
              size="lg"
              leading={<Glyph name="send" className="h-5 w-5" />}
            >
              Email the team
            </Button>
            <Button
              to="/about"
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
            >
              Learn about the project
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
