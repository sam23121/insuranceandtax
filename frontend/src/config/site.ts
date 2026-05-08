/**
 * Single source of truth for changeable business info.
 *
 * Edit ONLY this file to update what's shown across the site:
 *   - Footer (contact column, brand name)
 *   - Navbar (brand short name)
 *   - Contact page (address, phone, email, hours, embedded map)
 *   - Admin sidebar (short brand name)
 *   - Anywhere else the i18n dictionary references `siteConfig.*`
 *
 * For UI labels and translated copy (button text, headings, etc.),
 * edit `src/i18n/dictionary.ts` instead.
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

  /** Public business email — shown in footer, contact page, mailto links. */
  email: 'nahom@nahominsuranceandtax.com',
  /** Public business phone — shown in footer, contact page, tel: links. Format freely; tel: links strip non-digits automatically. */
  officePhone: '(702) 778-5585',
  mobilePhone: '(702) 502-7553',
  faxPhone: '(702) 778-5586',

  /** Shown when the site language is English */
  addressEn: '4880 West University Avenue B5, Las Vegas, NV 89103',
  /** Shown when the site language is Amharic */
  addressAm: '4880 ዩኒቪርሲቲ ዩኒቪርሲቲ ስትሪት B5, ላስ ቬጋስ፣ ኔቫዳ 89103',

  /** Business hours (English) — shown on the contact page. */
  hoursEn: 'Monday – Friday: 9:00 AM – 6:00 PM · Saturday: 10:00 AM – 2:00 PM · Closed Sunday',
  /** Business hours (Amharic) — shown on the contact page. */
  hoursAm: 'ሰኞ–አርብ፦ 9፡00 ሰዓት – 6፡00 ሰዓት · ቅዳሜ፦ 10፡00 – 2፡00 · እሑድ ዝግጁ',

  /** Google Maps “Share → Embed a map” iframe `src` URL */
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3218.5!2d-115.1398!3d36.1699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDEwJzExLjYiTiAxMTXCsDA4JzIzLjMiVw!5e0!3m2!1sen!2sus!4v1',

  /**
   * Footer social buttons. `name` is visible text and `aria-label`;
   * use brand names or translate here if you prefer.
   * To remove a social link, delete the row. To add one, copy a row and edit.
   */
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/' },
    { name: 'Instagram', url: 'https://www.instagram.com/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
  ],
} as const
