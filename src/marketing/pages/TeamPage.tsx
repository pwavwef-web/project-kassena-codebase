import { Link } from 'react-router-dom'
import {
  openRoles,
  teamGroups,
  teamPrinciples,
  teamRosterNote,
} from '../../content/team'
import { site } from '../../content/site'
import { Seo } from '../lib/seo'
import { Reveal, RevealItem, Stagger } from '../components/motion/Reveal'
import { Button } from '../components/ui/Button'
import { Glyph } from '../components/ui/Glyph'
import { Eyebrow, Section, SectionHeader } from '../components/ui/Section'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

export const TeamPage = () => {
  // Only render groups that actually have confirmed members. By default every
  // group is empty, so no member cards are shown — this is intentional.
  const populatedGroups = teamGroups.filter((group) => group.members.length > 0)
  const hasRoster = populatedGroups.length > 0

  return (
    <>
      <Seo
        title="Team"
        description="Project Kasena is being built by a growing community of Kasem speakers, validators, advisers, coordinators and engineers. People are listed here only once their participation is confirmed."
        path="/team"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'Team — Project Kasena',
            url: `${site.url}/team`,
            description:
              'The people and roles building Project Kasena. The public roster lists members only when their participation is confirmed and consented.',
          },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="pk relative overflow-hidden bg-indigo-950 text-cream-100">
        <CulturalPatternLayer variant="weave" color="text-cream-100" opacity={0.05} />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -right-24 top-0 h-72 w-72 rounded-full bg-terracotta-500/25 animate-aurora"
        />
        <div
          aria-hidden="true"
          className="pk-aurora absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-savannah-500/25 animate-aurora"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cream-200/85">
                <span className="h-1.5 w-1.5 rounded-full bg-kente-400" />
                The people
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-fluid-4xl font-bold leading-[1.05] tracking-tight">
                A language is kept alive by{' '}
                <span className="bg-gradient-to-r from-kente-300 via-kente-400 to-terracotta-300 bg-clip-text text-transparent">
                  the people who speak it
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-fluid-base text-cream-200/80">
                Project Kasena is built by a growing community — speakers,
                validators, elders, coordinators and engineers. The team is
                forming in the open. We list people here only once their
                participation is confirmed and they consent to being named.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to="/contact" variant="gold" size="lg">
                  Get involved
                </Button>
                <Button
                  to="/partners"
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
                >
                  Partner with us
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero visual — an honest, abstract "team forming" panel */}
          <Reveal delay={0.2} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent backdrop-blur-sm" />
              <div className="relative grid h-full w-full grid-cols-3 grid-rows-3 gap-3 p-6">
                {teamGroups.slice(0, 9).map((group, i) => (
                  <div
                    key={group.id}
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-2 text-center"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-kente-300">
                      <Glyph name={group.icon} className="h-4 w-4" />
                    </span>
                    <span className="mt-2 hidden text-[0.6rem] font-semibold leading-tight text-cream-200/55 sm:block">
                      {group.title}
                    </span>
                  </div>
                ))}
              </div>
              <span className="absolute inset-x-0 bottom-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream-200/45">
                Roles, forming
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WE ARE BUILDING ====================== */}
      <Section tone="cream" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeader
            eyebrow="We are building the team"
            title="The roles we are growing"
            description="These are the kinds of people Project Kasena is building around. You do not need to be a linguist or an engineer — fluent speakers, students, families and organisations all have a place here."
          />
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-soft sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                <Glyph name="users" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-fluid-lg font-bold text-indigo-900">
                Built in the open, by the community
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-charcoal-muted">
                We would rather show an honest, forming team than a polished page
                full of people who never agreed to be there. Every role below is
                real work the project needs — and every name we eventually add
                will be someone who chose to take part.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button to="/contact" variant="primary" size="md">
                  Express interest
                </Button>
                <Button to="/partners" variant="outline" size="md">
                  Explore partnerships
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {openRoles.map((role) => (
            <RevealItem
              key={role.title}
              className="group flex flex-col rounded-2xl border border-indigo-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <Glyph name={role.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-indigo-900">
                {role.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
                {role.description}
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-indigo-700">
                {role.commitment}
              </span>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* ====================== HOW WE LIST ========================= */}
      <Section tone="white" spacing="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            eyebrow="How this page works"
            title="Names appear only when participation is confirmed"
            description="This page is intentionally sparse while the team forms. That is by design, not an oversight — it is how we keep the project honest."
          />
          <Stagger className="grid gap-4">
            {teamPrinciples.map((principle, i) => (
              <RevealItem
                key={principle}
                className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-cream-50 p-5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-savannah-100 text-savannah-700">
                  <Glyph name="check" className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-charcoal">
                  <span className="font-semibold text-indigo-900">
                    {String(i + 1).padStart(2, '0')}.
                  </span>{' '}
                  {principle}
                </p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ======================= THE ROSTER ======================== */}
      <Section tone="cream" spacing="lg">
        <SectionHeader
          eyebrow="The team"
          title={hasRoster ? 'People building Project Kasena' : 'The roster is forming'}
          description={
            hasRoster
              ? 'Each person below has confirmed their participation and consented to being listed.'
              : 'Once people confirm their participation, they will be grouped here by the part they play.'
          }
          align="center"
          className="mx-auto"
        />

        {hasRoster ? (
          <div className="mt-14 space-y-16">
            {populatedGroups.map((group) => (
              <div key={group.id}>
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-cream-100">
                      <Glyph name={group.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-fluid-lg font-bold text-indigo-900">
                        {group.title}
                      </h3>
                      <p className="text-sm text-charcoal-muted">
                        {group.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((member) => (
                    <RevealItem
                      key={`${group.id}-${member.name}`}
                      className="flex flex-col rounded-2xl border border-indigo-100 bg-white p-6 shadow-soft"
                    >
                      <div className="flex items-center gap-4">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={`Portrait of ${member.name}`}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 font-display text-lg font-bold text-indigo-700"
                          >
                            {member.name.charAt(0)}
                          </span>
                        )}
                        <div>
                          <h4 className="font-display text-base font-bold text-indigo-900">
                            {member.name}
                          </h4>
                          <p className="text-sm text-terracotta-600">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {member.bio ? (
                        <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
                          {member.bio}
                        </p>
                      ) : null}
                      {member.links && member.links.length > 0 ? (
                        <ul className="mt-4 flex flex-wrap gap-3">
                          {member.links.map((link) => (
                            <li key={link.url}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pk-focus text-sm font-semibold text-indigo-700 underline-offset-4 hover:underline"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </RevealItem>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
        ) : (
          // Deliberate, premium empty state — not a broken page.
          <Reveal className="mt-12">
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-soft sm:p-12">
              <CulturalPatternLayer
                variant="dots"
                color="text-indigo-700"
                opacity={0.04}
              />
              <div className="relative">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Glyph name="community" className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-fluid-xl font-bold text-indigo-900">
                  We will list people here when it is true
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-charcoal-muted">
                  {teamRosterNote}
                </p>

                {/* Show the groups as forming "slots" so the structure is visible */}
                <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
                  {teamGroups.map((group) => (
                    <li
                      key={group.id}
                      className="inline-flex items-center gap-2 rounded-full border border-dashed border-indigo-200 bg-cream-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700"
                    >
                      <span className="text-indigo-400">
                        <Glyph name={group.icon} className="h-3.5 w-3.5" />
                      </span>
                      {group.title}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button to="/contact" variant="primary" size="md">
                    Join the team
                  </Button>
                  <Button to="/partners" variant="outline" size="md">
                    Become a partner
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal className="mt-8 text-center">
          <p className="text-xs text-charcoal-muted">
            Are you a Kasem speaker, validator, adviser or organisation?{' '}
            <Link
              to="/contact"
              className="pk-focus font-semibold text-terracotta-600 hover:underline"
            >
              Tell us how you would like to help →
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* ===================== CONTRIBUTOR PATH ===================== */}
      <Section tone="indigo" spacing="lg">
        <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.05} />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="You belong here"
              title="Most of the team will be contributors"
              description="The biggest part of this work is everyday speakers adding words, sharing meanings and helping verify entries. You can start contributing without joining anything formal — and grow into a wider role if you want to."
              tone="dark"
            />
            <Reveal className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href={site.appLaunchPath}
                external={false}
                variant="gold"
                size="md"
              >
                Start contributing
              </Button>
              <Button
                to="/how-it-works"
                variant="outline"
                size="md"
                className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
              >
                See how it works
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <figure className="rounded-3xl border border-white/10 bg-white/[0.05] p-8">
              <span aria-hidden="true" className="font-display text-5xl text-kente-400">
                “
              </span>
              <blockquote className="-mt-3 text-pretty font-display text-fluid-lg font-semibold leading-snug text-cream-100">
                A dataset of a living language can only be built by the people who
                carry it. Every entry is someone choosing to pass it on.
              </blockquote>
              <figcaption className="mt-4 text-sm text-cream-200/70">
                Project Kasena — contributor principle
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* ======================= CLOSING CTA ======================= */}
      <Section tone="white" spacing="lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-700 to-savannah-700 p-8 text-cream-100 sm:p-12">
            <CulturalPatternLayer
              variant="weave"
              color="text-cream-100"
              opacity={0.06}
            />
            <div className="relative max-w-3xl">
              <Eyebrow className="border-white/20 bg-white/10 text-cream-100">
                Help build the team
              </Eyebrow>
              <h2 className="mt-4 text-balance font-display text-fluid-2xl font-bold leading-tight">
                There is a place for you in this work
              </h2>
              <p className="mt-4 text-pretty text-cream-200/85">
                Whether you can add a single word, validate a dialect, advise on
                what is appropriate to share, or partner at an institutional
                level — the project grows with every person who steps in.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button to="/contact" variant="gold" size="md">
                  Get in touch
                </Button>
                <Button
                  to="/partners"
                  variant="outline"
                  size="md"
                  className="border-white/25 bg-white/10 text-cream-100 hover:bg-white/20"
                >
                  Partner with Project Kasena
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
