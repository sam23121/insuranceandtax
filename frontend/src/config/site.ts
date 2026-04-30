/**
 * Your public business contact details and social profiles.
 * Edit this file only — the site reads name, email, phone, addresses, map, and social URLs from here.
 */
export const siteConfig = {
  /** Full business name (English UI) */
  businessName: 'Nahom Insurance and Tax',
  /** Full business name (Amharic UI) */
  businessNameAm: 'ናሆም መድን እና ግብር',
  /** Short name for compact nav / admin sidebar (English) */
  shortBusinessName: 'Nahom',
  /** Short name for compact nav / admin sidebar (Amharic) */
  shortBusinessNameAm: 'ናሆም',

  email: 'nahom@nahominsuranceandtax.com',
  phone: '(702) 820-3552',

  /** Shown when the site language is English */
  addressEn: '4840 West University Avenue, Las Vegas, NV 89103',
  /** Shown when the site language is Amharic */
  addressAm: '4840 ዩኒቪርሲቲ ዩኒቪርሲቲ ስትሪት፣ ላስ ቬጋስ፣ ኔቫዳ 89103',

  /** Google Maps “Share → Embed a map” iframe `src` URL */
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3218.5!2d-115.1398!3d36.1699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDEwJzExLjYiTiAxMTXCsDA4JzIzLjMiVw!5e0!3m2!1sen!2sus!4v1',

  /**
   * Footer social buttons. `name` is visible text and `aria-label`;
   * use brand names or translate here if you prefer.
   */
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/' },
    { name: 'Instagram', url: 'https://www.instagram.com/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
  ],
} as const
