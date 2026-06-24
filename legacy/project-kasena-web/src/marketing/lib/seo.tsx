import { useEffect } from 'react'
import { site } from '../../content/site'

export interface SeoProps {
  title: string
  description?: string
  /** Path only, e.g. "/about". Defaults to current location. */
  path?: string
  /** Override the social preview image (path relative to /public or absolute). */
  image?: string
  type?: 'website' | 'article'
  /** Additional JSON-LD structured-data objects to inject for this page. */
  jsonLd?: Array<Record<string, unknown>>
  /** Set true on pages that should not be indexed (e.g. drafts). */
  noindex?: boolean
}

const SEO_FLAG = 'data-pk-seo'

const upsertMeta = (
  selector: string,
  attrs: Record<string, string>,
): void => {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(SEO_FLAG, 'true')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value))
}

const upsertLink = (rel: string, href: string): void => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(SEO_FLAG, 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const absolute = (pathOrUrl: string): string =>
  pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${site.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`

/**
 * Declarative document-head management for the marketing site without adding a
 * runtime dependency. Renders nothing; updates <head> via effects.
 */
export const Seo = ({
  title,
  description = site.description,
  path,
  image = site.ogImage,
  type = 'website',
  jsonLd = [],
  noindex = false,
}: SeoProps) => {
  useEffect(() => {
    const resolvedPath =
      path ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
    const fullTitle =
      title.trim().toLowerCase() === site.name.toLowerCase()
        ? `${site.name} — ${site.tagline}`
        : `${title} — ${site.name}`
    const canonical = absolute(resolvedPath)
    const imageUrl = absolute(image)

    document.title = fullTitle
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    })
    upsertLink('canonical', canonical)

    // Open Graph
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical,
    })
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: imageUrl,
    })
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: site.name,
    })

    // Twitter / X
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: imageUrl,
    })

    // Structured data — Organization is always present, plus page-specific.
    const organization: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      description: site.description,
      logo: absolute('/favicon.png'),
      foundingLocation: site.contact.location,
      areaServed: 'Ghana',
      knowsLanguage: ['Kasem', 'English'],
    }
    const scripts = [organization, ...jsonLd].map((data) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute(SEO_FLAG, 'true')
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
      return script
    })

    return () => {
      scripts.forEach((script) => script.remove())
    }
  }, [title, description, path, image, type, jsonLd, noindex])

  return null
}
