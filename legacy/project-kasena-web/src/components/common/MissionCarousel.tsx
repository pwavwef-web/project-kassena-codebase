import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppIcon } from './AppIcon'

const AUTO_SCROLL_INTERVAL_MS = 3000

interface MissionSlide {
  id: string
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
}

const missionSlides: MissionSlide[] = [
  {
    id: 'oral-heritage',
    eyebrow: 'Oral heritage',
    title: 'Capture Kasem as people speak it',
    body: 'We are helping families, elders, and young contributors record the words, stories, pronunciations, and context that make Kasem alive.',
    image: '/mission-carousel/01-oral-heritage.jpg',
    alt: 'Community members recording spoken Kasem with a phone and laptop in a courtyard.',
  },
  {
    id: 'dictionary-builders',
    eyebrow: 'Community dictionary',
    title: 'Build a trusted Kasem dictionary',
    body: 'Every approved word, phrase, example, and dialect note becomes part of a shared reference that learners and researchers can rely on.',
    image: '/mission-carousel/02-dictionary-builders.jpg',
    alt: 'Contributors entering language notes into tablets and laptops in a bright learning room.',
  },
  {
    id: 'community-validation',
    eyebrow: 'Human validation',
    title: 'Review contributions with care',
    body: 'Validators compare submissions, listen to audio, and preserve community knowledge with the rigor it deserves.',
    image: '/mission-carousel/03-community-validation.jpg',
    alt: 'Community validators reviewing Kasem language submissions around a table.',
  },
  {
    id: 'learning-tools',
    eyebrow: 'Learning access',
    title: 'Turn preservation into learning',
    body: 'The archive becomes practical tools for students, families, and anyone who wants to learn, search, and practice Kasem.',
    image: '/mission-carousel/04-learning-tools.jpg',
    alt: 'Learners and a teacher practicing Kasem with tablets on a shaded veranda.',
  },
  {
    id: 'ai-ready-language',
    eyebrow: 'AI-ready data',
    title: 'Prepare Kasem for future tools',
    body: 'Clean language data can support translation, search, pronunciation help, voice tools, and new ways for Kasem speakers to build with technology.',
    image: '/mission-carousel/05-ai-ready-language.jpg',
    alt: 'Contributors recording audio for language technology in a community tech space.',
  },
  {
    id: 'cultural-archive',
    eyebrow: 'Culture archive',
    title: 'Preserve more than vocabulary',
    body: 'Songs, proverbs, stories, ceremonies, and everyday expressions all belong in the digital memory of the community.',
    image: '/mission-carousel/06-cultural-archive.jpg',
    alt: 'A community gathering where people share music and stories while a contributor records them.',
  },
]

export const MissionCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const totalSlides = missionSlides.length

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex((index + totalSlides) % totalSlides)
    },
    [totalSlides],
  )

  const showNextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % totalSlides)
  }, [totalSlides])

  const showPreviousSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return

    const timer = window.setInterval(showNextSlide, AUTO_SCROLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [isPaused, showNextSlide, totalSlides])

  const activeSlide = missionSlides[activeIndex]

  return (
    <section
      className="space-y-3 sm:space-y-4"
      aria-label="Project Kassena mission carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-kassena-orange sm:text-xs sm:tracking-[0.18em]">
            Mission carousel
          </p>
          <h2 className="mt-1 text-xl font-black text-kassena-green sm:text-3xl">
            What Project Kassena is building
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={showPreviousSlide}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kassena-green/15 bg-white text-kassena-green shadow-sm transition hover:border-kassena-green/30 hover:bg-kassena-cream/60 focus:outline-none focus:ring-2 focus:ring-kassena-gold focus:ring-offset-2"
            aria-label="Show previous mission slide"
          >
            <AppIcon name="arrow-left" className="h-full w-full" />
          </button>
          <button
            type="button"
            onClick={showNextSlide}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kassena-green/15 bg-white text-kassena-green shadow-sm transition hover:border-kassena-green/30 hover:bg-kassena-cream/60 focus:outline-none focus:ring-2 focus:ring-kassena-gold focus:ring-offset-2"
            aria-label="Show next mission slide"
          >
            <AppIcon name="chevron-right" className="h-full w-full" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] bg-kassena-dark shadow-xl ring-1 ring-kassena-green/10 sm:rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {missionSlides.map((slide, index) => (
            <article
              key={slide.id}
              className="relative min-w-full"
              aria-hidden={index !== activeIndex}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-[22rem] w-full object-cover sm:h-[34rem] lg:h-[36rem]"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kassena-dark via-kassena-dark/45 to-transparent sm:bg-gradient-to-r sm:from-kassena-dark/95 sm:via-kassena-dark/55 sm:to-kassena-dark/10" />
              <div className="absolute inset-0 flex items-end sm:items-center">
                <div className="max-w-2xl p-4 text-white sm:p-10 lg:p-12">
                  <p className="inline-flex rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-kassena-gold ring-1 ring-white/15 backdrop-blur sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                    {slide.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-kassena-cream/90 sm:mt-4 sm:text-lg sm:leading-7">
                    {slide.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                    <Link
                      to="/submit"
                      className="rounded-full bg-kassena-orange px-4 py-2 text-xs font-black text-white shadow-lg transition hover:bg-[#e67e22] focus:outline-none focus:ring-2 focus:ring-kassena-gold focus:ring-offset-2 focus:ring-offset-kassena-dark sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      Add a Contribution
                    </Link>
                    <Link
                      to="/culture"
                      className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-kassena-gold focus:ring-offset-2 focus:ring-offset-kassena-dark sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      Explore Culture
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {missionSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-kassena-gold focus:ring-offset-2 ${
                index === activeIndex
                  ? 'w-9 bg-kassena-orange'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Show ${slide.eyebrow} slide`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={showPreviousSlide}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-kassena-green/15 bg-white text-kassena-green shadow-sm"
            aria-label="Show previous mission slide"
          >
            <AppIcon name="arrow-left" className="h-full w-full" />
          </button>
          <button
            type="button"
            onClick={showNextSlide}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-kassena-green/15 bg-white text-kassena-green shadow-sm"
            aria-label="Show next mission slide"
          >
            <AppIcon name="chevron-right" className="h-full w-full" />
          </button>
        </div>
        <p className="hidden text-sm font-semibold text-slate-500 sm:block">
          {activeIndex + 1} / {totalSlides} · {activeSlide.eyebrow}
        </p>
      </div>
    </section>
  )
}
