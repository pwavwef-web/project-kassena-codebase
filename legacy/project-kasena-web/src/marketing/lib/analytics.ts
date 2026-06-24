import { getFirebaseAnalytics } from '../../config/firebase'

/**
 * Fire-and-forget analytics. Always fails silently — analytics must never break
 * the website. No personally identifying data should be passed in `params`.
 */
export const track = (
  event: string,
  params?: Record<string, string | number | boolean>,
): void => {
  try {
    void getFirebaseAnalytics()
      .then(async (analytics) => {
        if (!analytics) return
        const { logEvent } = await import('firebase/analytics')
        logEvent(analytics, event, params)
      })
      .catch(() => {})
  } catch {
    /* never throw */
  }
}

/** Stable event names used across the marketing site. */
export const events = {
  launchApp: 'launch_app_click',
  contributeClick: 'contribute_cta_click',
  supportView: 'support_page_view',
  donationStarted: 'donation_started',
  donationCompleted: 'donation_completed',
  donationFailed: 'donation_failed',
  partnerSubmit: 'partner_form_submitted',
  contactSubmit: 'contact_form_submitted',
  newsletterSignup: 'newsletter_signup',
  reportDownload: 'report_download',
  cultureStoryOpen: 'culture_story_opened',
  roadmapInteract: 'roadmap_interaction',
  allianceView: 'alliance_page_viewed',
  dictionaryPreview: 'dictionary_preview_interaction',
} as const
