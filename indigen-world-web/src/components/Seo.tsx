import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path?: string
  image?: string
  jsonLd?: Record<string, unknown>
}

const siteUrl = 'https://indigen.world'

function upsertMeta(selector: string, create: () => HTMLMetaElement, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

export function Seo({
  title,
  description,
  path = '/',
  image = '/og-default.svg',
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title === 'Indigen World' ? title : `${title} | Indigen World`
    const url = `${siteUrl}${path}`
    document.title = fullTitle

    upsertMeta('meta[name="description"]', () => {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      return meta
    }, description)

    const ogTags: Array<[string, string]> = [
      ['og:title', fullTitle],
      ['og:description', description],
      ['og:type', 'website'],
      ['og:url', url],
      ['og:image', `${siteUrl}${image}`],
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', fullTitle],
      ['twitter:description', description],
    ]

    ogTags.forEach(([property, content]) => {
      upsertMeta(`meta[property="${property}"], meta[name="${property}"]`, () => {
        const meta = document.createElement('meta')
        if (property.startsWith('twitter:')) {
          meta.setAttribute('name', property)
        } else {
          meta.setAttribute('property', property)
        }
        return meta
      }, content)
    })

    let structuredData = document.head.querySelector<HTMLScriptElement>(
      'script[data-indigen-world-jsonld]',
    )
    if (jsonLd) {
      if (!structuredData) {
        structuredData = document.createElement('script')
        structuredData.type = 'application/ld+json'
        structuredData.dataset.indigenWorldJsonld = 'true'
        document.head.appendChild(structuredData)
      }
      structuredData.textContent = JSON.stringify(jsonLd)
    } else if (structuredData) {
      structuredData.remove()
    }
  }, [description, image, jsonLd, path, title])

  return null
}
