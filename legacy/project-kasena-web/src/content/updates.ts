/**
 * News & updates content for the public marketing site.
 *
 * IMPORTANT — honesty rules:
 * Every post below must be written ONLY from facts that already exist on this
 * website. We do NOT invent events, metrics, partnerships, quotes, funding or
 * endorsements. Where a forward-looking statement appears, it is phrased as a
 * target / plan in progress, never as an achievement.
 *
 * Seed posts are limited to a small number of genuinely true announcements.
 * Add new entries here as real, verifiable milestones occur.
 */

export type UpdateCategory =
  | 'Announcement'
  | 'Build update'
  | 'Community'
  | 'Research'
  | 'Product'

export interface Update {
  id: string
  slug: string
  title: string
  excerpt: string
  /** Multi-paragraph body. Paragraphs separated by a blank line (\n\n). */
  body: string
  category: UpdateCategory
  author: string
  /** ISO 8601 date string, e.g. "2026-06-20". */
  date: string
  featured: boolean
}

const DEFAULT_AUTHOR = 'Project Kasena Team'

/**
 * Seed data — at most two genuinely TRUE posts, drawn only from facts that are
 * already published elsewhere on this site (the public website launch and the
 * in-progress Phase 1 language foundation). Both are dated to the website's
 * publication date and attributed to the team, with no fabricated detail.
 */
export const updates: Update[] = [
  {
    id: 'public-website-launch',
    slug: 'project-kasena-public-website',
    title: 'Project Kasena’s new public website is live',
    excerpt:
      'We have published a public home for the project — explaining what we are building, how community validation works, and how anyone can contribute to the Kasem language.',
    body: `Project Kasena now has a public website. It brings together, in one place, everything the project stands for: building the digital language infrastructure, verified datasets, educational tools and the groundwork for future AI systems that will allow Kasem to thrive online.

The site explains the project honestly. It describes what we are building today, what is still in development, and what remains a future plan or a research direction. We label product status clearly throughout, and we never present a planned capability as if it were already operational.

It also opens up how the work happens. The site walks through how a single contributed word becomes a verified dataset entry — contributed by the community, checked automatically, and reviewed by qualified teachers and elders before it counts. Accuracy is treated as a community decision, not an algorithm’s alone.

If you speak Kasem, teach it, study it, or simply care about it, there is a place for you here. Explore the project, read about the community validation model, and find the ways you can contribute.`,
    category: 'Announcement',
    author: DEFAULT_AUTHOR,
    date: '2026-06-20',
    featured: true,
  },
  {
    id: 'phase-1-language-foundation',
    slug: 'phase-1-building-the-verified-language-foundation',
    title: 'Phase 1: building the verified language foundation',
    excerpt:
      'Our first phase focuses on a strong, verified base for Kasem — validated words, sentences and dialect metadata — because a carefully checked dataset is worth more than a large, noisy one.',
    body: `Project Kasena’s roadmap is deliberate about sequence. The first phase, currently in progress, is the language foundation: the verified words, sentences and lexical bedrock that everything else will be built on.

We are clear about why this comes first. A smaller, carefully validated dataset is more valuable than a large, noisy one. So Phase 1 concentrates on validated word pairs, sentence pairs, dialect metadata, parts of speech, context examples, and the contributor and validator records that make the data trustworthy.

The intended outcomes of this phase are a digital dictionary, a basic translation utility, and an AI-ready lexical foundation. The phase-1 dataset target is 10,000–20,000 validated entries — a target, not a claim of what already exists. Live counts, when available, are shown separately from targets across the site.

Later phases — conversational intelligence and, further out, voice and multimodal AI — remain planned and research-stage work. No AI model is trained or operational today. Getting the foundation right is what makes those future phases possible.`,
    category: 'Build update',
    author: DEFAULT_AUTHOR,
    date: '2026-06-20',
    featured: false,
  },
]

/** Ordered list of category filter options, with an "All" pseudo-filter first. */
export const updateFilters: Array<UpdateCategory | 'All'> = [
  'All',
  'Announcement',
  'Build update',
  'Community',
  'Research',
  'Product',
]

/** Average adult silent reading speed (words per minute) used for estimates. */
export const READING_WPM = 200

/** Estimate reading time in whole minutes (min 1) from a post body. */
export const readingTimeMinutes = (body: string): number => {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / READING_WPM))
}

/** Human-friendly long date, e.g. "20 June 2026". Falls back to the raw ISO. */
export const formatUpdateDate = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
