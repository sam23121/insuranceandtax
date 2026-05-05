/**
 * Single source of truth for all UI copy — English (`en`) and Amharic (`am`).
 * Edit strings here only; components use `useI18n().t('dot.path')` or service helpers below.
 *
 * Contact facts (email, phone, addresses, map URL, social links) live in `src/config/site.ts`.
 */
import { siteConfig } from '@/config/site'
import type { ServiceSlug } from '@/types'

export type Locale = 'en' | 'am'

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServicePageDict {
  title: string
  subtitle: string
  overview: string[]
  included: string[]
  audience: string
  faqs: ServiceFaq[]
  disclaimer?: string
}

function walk(obj: unknown, parts: string[]): unknown {
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

/** String leaves only (for `t('nav.home')`). */
export function getNestedString(locale: Locale, path: string): string {
  const v = walk(dictionary[locale], path.split('.'))
  return typeof v === 'string' ? v : path
}

export function getServicePage(locale: Locale, slug: ServiceSlug): ServicePageDict {
  const pages = dictionary[locale].servicePages
  const p = pages[slug]
  if (!p) {
    throw new Error(`Missing servicePage for ${slug} (${locale})`)
  }
  return p
}

export interface TestimonialItem {
  name: string
  quote: string
}

export function getTestimonials(locale: Locale): TestimonialItem[] {
  const block = dictionary[locale].home.testimonials as {
    items?: TestimonialItem[]
  }
  return block.items ?? []
}

export function serviceTitle(locale: Locale, slug: ServiceSlug): string {
  return getNestedString(locale, `servicesNav.${slug}.title`)
}

const SERVICE_PAGES_EN: Record<ServiceSlug, ServicePageDict> = {
  auto_insurance: {
    title: 'Auto Insurance',
    subtitle: 'Reliable protection for your personal vehicles.',
    overview: [
      'Whether you drive daily or occasionally, the right auto policy helps protect you from liability, collision damage, theft, and more. We compare options so you understand coverage limits and deductibles before you choose.',
      'From state minimums to full coverage, we help you balance protection with your budget and driving habits.',
    ],
    included: [
      'Liability coverage',
      'Collision and comprehensive',
      'Medical payments',
      'Uninsured / underinsured motorist',
      'Rental reimbursement (where available)',
    ],
    audience:
      'Drivers who need dependable coverage for cars, SUVs, and light trucks—especially families and commuters who want clear explanations in English or Amharic.',
    faqs: [
      {
        q: 'What are minimum coverage requirements in my state?',
        a: 'Requirements vary by state. During your consultation we review what is legally required and what we recommend beyond the minimum for your situation.',
      },
      {
        q: 'Can you help with SR-22 filings?',
        a: 'Yes. If you need an SR-22, we can walk you through insurer options and filing steps.',
      },
      {
        q: 'What discounts might I qualify for?',
        a: 'Common discounts include multi-car, safe driver, bundling with other policies, and more—availability depends on the carrier.',
      },
      {
        q: 'Do you offer multi-car policies?',
        a: 'Many carriers bundle multiple vehicles on one policy for simpler billing and potential savings.',
      },
    ],
  },
  commercial_auto: {
    title: 'Commercial Auto Insurance',
    subtitle: 'Coverage built for business vehicles and fleets.',
    overview: [
      'Commercial auto insurance protects vehicles owned or used for business—from single vans to multi-vehicle fleets. Coverage can address liability, cargo, hired/non-owned autos, and more depending on your operations.',
      'We help contractors, delivery operators, and local businesses find policies aligned with how vehicles are actually used day to day.',
    ],
    included: [
      'Bodily injury and property damage liability',
      'Physical damage for business-owned vehicles',
      'Cargo coverage (where applicable)',
      'Hired and non-owned auto options',
    ],
    audience:
      'Small and mid-sized businesses that rely on trucks, vans, or cars to serve customers, move tools, or deliver goods.',
    faqs: [
      {
        q: 'How is commercial auto different from personal auto?',
        a: 'Personal policies generally exclude many business uses. Commercial auto is rated and structured for work-related driving and liability exposure.',
      },
      {
        q: 'Are employees covered when they drive company vehicles?',
        a: 'Many policies can extend coverage for permitted drivers; specifics depend on the carrier and how employees are listed.',
      },
      {
        q: 'Do you help with fleet pricing?',
        a: 'Yes—we can explore fleet programs and multi-vehicle structures with our carrier partners.',
      },
    ],
  },
  business_insurance: {
    title: 'Business Insurance',
    subtitle: 'Shield your company from liability and unexpected loss.',
    overview: [
      'Business insurance helps protect what you have built—general liability, commercial property, and business interruption are common building blocks. We listen to your operations and recommend a sensible mix of coverages.',
      'Whether you run a storefront, office, or home-based business, there are options tailored to your risk profile.',
    ],
    included: [
      'General liability',
      'Commercial property',
      'Business interruption',
      'Workers’ compensation referrals',
    ],
    audience:
      'Owners of retail, service, and professional businesses who want straightforward guidance without jargon overload.',
    faqs: [
      {
        q: 'What size businesses need business insurance?',
        a: 'Even small operations often benefit from liability coverage. Requirements can also come from landlords, lenders, or clients.',
      },
      {
        q: 'What is a BOP bundle?',
        a: 'A Business Owners Policy (BOP) combines common coverages like liability and property into one package—often cost-effective for eligible businesses.',
      },
      {
        q: 'How does the claims process work?',
        a: 'If you have a loss, you notify the carrier and follow their intake process. We can help you understand policy documents and next steps.',
      },
    ],
  },
  tax_preparation: {
    title: 'Tax Preparation',
    subtitle: 'Accurate returns for individuals and businesses.',
    overview: [
      'Our preparers work with wage earners, self-employed filers, and small businesses. We focus on completeness, eligible deductions and credits, and clear communication about what you owe or can expect back.',
      'From simple W-2 returns to Schedule C and multi-state complexity, we aim to make filing season predictable.',
    ],
    included: [
      'Federal and state income tax returns',
      'Self-employed / Schedule C support',
      'ITIN applications and renewals (where applicable)',
      'Amended returns when needed',
      'E-filing',
    ],
    audience:
      'Individuals and business owners who want a preparer who takes time to answer questions and organize documents efficiently.',
    faqs: [
      {
        q: 'What documents should I bring?',
        a: 'Typical items include W-2s, 1099s, ID, prior-year return, deduction records, and business income/expense documentation if applicable.',
      },
      {
        q: 'When are filing deadlines?',
        a: 'Federal deadlines are well known each season; state deadlines can differ. We track key dates and remind you what applies to your return.',
      },
      {
        q: 'ITIN vs SSN—what is the difference?',
        a: 'An SSN is for citizens and eligible residents; an ITIN is for taxpayers who need to file but are not eligible for an SSN. We can discuss which applies to you.',
      },
      {
        q: 'How long until I receive a refund?',
        a: 'IRS processing times vary. E-filed returns are often faster than paper; we do not guarantee IRS timelines.',
      },
    ],
  },
  immigration_forms: {
    title: 'Immigration Forms Services',
    subtitle: 'Careful preparation and review of USCIS paperwork.',
    overview: [
      'We assist clients in completing and reviewing immigration-related forms so information is consistent, complete, and ready for submission. Our process emphasizes accuracy and clear checklists.',
      'Every case is different; we take time to understand which forms apply to your situation.',
    ],
    included: ['Form I-90', 'Form I-130', 'Form I-485', 'Form I-765', 'Form N-400', 'DACA renewals (I-821D) — where applicable'],
    audience: 'Individuals and families navigating USCIS paperwork who want structured support with form preparation.',
    disclaimer:
      'We are NOT attorneys. We provide document preparation services only and do not provide legal advice. For legal representation, please consult an immigration attorney.',
    faqs: [
      {
        q: 'Which forms can you help with?',
        a: 'We support many common USCIS forms; during consultation we confirm eligibility for assistance on your specific forms.',
      },
      {
        q: 'Can you guarantee processing times?',
        a: 'No. Government processing varies widely and is outside our control.',
      },
      {
        q: 'How can I track my case status?',
        a: 'USCIS offers online case status tools. We can point you to official resources for tracking.',
      },
    ],
  },
  notary_services: {
    title: 'Notary Services',
    subtitle: 'Commissioned notary public for your important documents.',
    overview: [
      'Our notary can witness signatures and administer oaths for many common document types. We verify signer identity according to applicable rules and maintain a professional, efficient visit.',
      'Walk-ins welcome when available; appointments help ensure minimal wait time.',
    ],
    included: [
      'Acknowledgments',
      'Jurats',
      'Affidavits',
      'Loan document packages (by arrangement)',
      'Power of attorney',
      'Vehicle title transfers (where permitted)',
    ],
    audience: 'Anyone who needs a qualified notary for personal, real estate, or business documents.',
    faqs: [
      {
        q: 'What should I bring?',
        a: 'Unsigned documents (unless instructed otherwise), government-issued photo ID, and any witnesses required by your document.',
      },
      {
        q: 'Do you offer mobile notary?',
        a: 'Availability varies by location and schedule—ask when you book.',
      },
      {
        q: 'Can you provide apostille services?',
        a: 'We can refer you to appropriate channels for apostille; notarization is only one step in that process.',
      },
      {
        q: 'How are fees determined?',
        a: 'Fees follow state-regulated schedules where applicable, plus any agreed travel or after-hours fees if offered.',
      },
    ],
  },
}

const SERVICE_PAGES_AM: Record<ServiceSlug, ServicePageDict> = {
  auto_insurance: {
    title: 'የመኪና መድን',
    subtitle: 'ለግል ተሽከርካሪዎ ታማኝ ጥበቃ።',
    overview: [
      'በየቀኑ ወይም በአልፎ አልፎ ስለሚነዱ፣ ትክክለኛ ፖሊሲ ከኃላፊነት፣ ከግጭት ጉዳት፣ ከስርቆት እና ሌሎችም ይጠብቅዎታል። ከመረጡ በፊት የሽፋን ወሰን እና የተቀነሰ ክፍያዎችን እንዲረዱ ያለውን እናወዳወራለን።',
      'ከግዛት ዝቅተኛ መስፈርት እስከ ሙሉ ሽፋን፣ ከበጀዎ እና ከመንጃ ልምድዎ ጋር በሚስማማ መልኩ እንረዳዎታለን።',
    ],
    included: [
      'የኃላፊነት ሽፋን',
      'ግጭት እና ሙሉ ሽፋን',
      'የሕክምና ክፍያዎች',
      'ያልተሰረጸ / ዝቅተኛ የተሰረጸ ነጂ ሽፋን',
      'የኪራይ ተመላሽ (የሚገኝበት)',
    ],
    audience:
      'ለመኪና፣ SUV እና ለቀላል ጭነት መኪናዎች አስተማማኝ ሽፋን ለሚፈልጉ ነጂዎች — በተለይ ለቤተሰቦች እና ተመላሾች በእንግሊዝኛ ወይም በአማርኛ በግልጽ ማብራሪት ለሚፈልጉ።',
    faqs: [
      {
        q: 'በግዛቴ ዝቅተኛ የሽፋን መስፈርት ምንድን ነው?',
        a: 'በግዛት ይለያል። በኮንሰልቴሽን በህግ የሚያስፈልገውን እና ለሁኔታዎ ከዝቅተኛው በላይ የምንመከርውን እንዘርዝርልዎታለን።',
      },
      {
        q: 'SR-22 ሰነዶችን ልትረዱኝ ትችላላችሁ?',
        a: 'አዎ። SR-22 ከፈለጉ ከኢንሹራንስ አማራጮች እና ከማስገቢያ ደረጃዎች ጋር እንመራዎታለን።',
      },
      {
        q: 'ምን ዓይነት ቅናሾች ሊኖሩኝ ይችላሉ?',
        a: 'ብዙ መኪና፣ አስተማማኝ ነጂ፣ ከሌሎች ፖሊሲዎች ጋር ማዋሀድ እና ሌሎችም — በአገልግሎት ሰጪው ላይ ይወሰናል።',
      },
      {
        q: 'ለብዙ መኪናዎች ፖሊሲ አላችሁ?',
        a: 'ብዙ አገልግሎት ሰጪዎች በአንድ ፖሊሲ ላይ ብዙ ተሽከርካሪዎችን ያጣምራሉ።',
      },
    ],
  },
  commercial_auto: {
    title: 'የንግድ መኪና መድን',
    subtitle: 'ለንግድ ተሽከርካሪዎች እና ቡድን የተዘጋጀ ሽፋን።',
    overview: [
      'የንግድ መኪና መድን ለንግድ የተሟላ ወይም የተጠቀሙ ተሽከርካሪዎችን ይጠብቃል — ከአንድ ቫን እስከ ብዙ ተሽከርካሪ ቡድን። ሽፋኑ ኃላፊነት፣ ጭነት፣ የተከራዩ/ያልተሟሉ መኪናዎች እና ሌላም ሊሆን ይችላል።',
      'ለኮንትራክተሮች፣ ለማድረሻ ኦፕሬተሮች እና ለአካባቢ ንግዶች ተሽከርካሪዎች በእውነተኛ አጠቃቀም ላይ የሚስማሙ ፖሊሲዎችን እንፈልግልዎታለን።',
    ],
    included: [
      'የአካል ጉዳት እና የንብረት ኃላፊነት',
      'ለንግድ የተሟላ ተሽከርካሪ የአካል ጉዳት ሽፋን',
      'የጭነት ሽፋን (የሚመለከተው)',
      'የተከራዩ እና ያልተሟሉ አማራጮች',
    ],
    audience: 'ደንበኞችን ለማገልገል፣ መሳሪያ ለማንቀሳቀስ ወይም ሸቀጥ ለማድረስ በትራክ፣ ቫን ወይም መኪና ላይ በሚመረከሩ ትንንሽ እና መካከለኛ ንግዶች።',
    faqs: [
      {
        q: 'የንግድ መኪና ከግል መኪና እንዴት ይለያል?',
        a: 'ግል ፖሊሲዎች ብዙ የንግድ አጠቃቀሞችን ያወጣሉ። የንግድ መኪና ለስራ አላባቢ መንገድ እና ለኃላፊነት ተስማምቷል።',
      },
      {
        q: 'የኩባንያ መኪና ሲነዱ ሰራተኞች ይሸፈናሉ?',
        a: 'ለተፈቀዱ ነጂዎች ሽፋን ሊራዘም ይችላል — ዝርዝሮች በአገልግሎት ሰጪው እና በመዝገብ ላይ ይወሰናል።',
      },
      {
        q: 'ለቡድን ዋጋ ረዳት አላችሁ?',
        a: 'አዎ — ከአጋሮቻችን ጋር የቡድን ፕሮግራሞችን እንመረምራለን።',
      },
    ],
  },
  business_insurance: {
    title: 'የንግድ መድን',
    subtitle: 'ኩባንያዎን ከኃላፊነት እና ከያልተጠበቀ ኪሳራ ይጠብቁ።',
    overview: [
      'የንግድ መድን የገነቡትን ይጠብቃል — አጠቃላይ ኃላፊነት፣ የንግድ ንብረት እና የንግድ ማቆም የተለመዱ አካላት ናቸው። ንግድዎን እንስማምራለን እና ተስማሚ የሽፋን ድብልቅ እንመክራለን።',
      'መደብር፣ ቢሮ ወይም ከቤት ንግድ — ለአደጋ መጠንዎ የተስማሙ አማራጮች አሉ።',
    ],
    included: ['አጠቃላይ ኃላፊነት', 'የንግድ ንብረት', 'የንግድ ማቆም', 'የሰራተኛ ካሳ ማመላከቻዎች'],
    audience: 'የችርቻር፣ አገልግሎት እና ሙያዊ ንግዶች ባለቤቶች ብዙ ቴክኒካል ቃላት ሳይኖሩ ግልጽ መመሪያ ለሚፈልጉ።',
    faqs: [
      {
        q: 'የትኛው ልኬት ንግድ መድን ያስፈልጋል?',
        a: 'ትንንሽ ንግዶችም ከኃላፊነት ሽፋን ይጠቀማሉ። ከቤት ባለቤት፣ ከባንክ ወይም ከደንበኛ ሊጠየቅ ይችላል።',
      },
      {
        q: 'BOP ፓኬጅ ምንድን ነው?',
        a: 'የንግድ ባለቤት ፖሊሲ (BOP) ኃላፊነት እና ንብረትን በአንድ ፓኬጅ ያጣምራል።',
      },
      {
        q: 'የክሌም ሂደት እንዴት ይሰራል?',
        a: 'ኪሳራ ካለ ለአገልግሎት ሰጪው ያሳውቁ እና ሂደቱን ይከተሉ። ሰነዶችን እንዲረዱ እንረዳለን።',
      },
    ],
  },
  tax_preparation: {
    title: 'ግብር ማዘጋጀት',
    subtitle: 'ለግል እና ለንግድ ትክክለኛ መመዝገቢያዎች።',
    overview: [
      'ከደሞዝ፣ ከራስ ስራ እና ከትንንን ንግዶች ጋር እንሰራለን። ሙሉነት፣ ተገቢ ቅናሾች እና ክሬዲቶች እና የሚከፍሉት ወይም የሚጠበቅብዎትን በግልጽ እንዲረዱ እንተናግራለን።',
      'ከቀላል W-2 እስከ ሴዱይል C እና ብዙ ግዛት፣ የግብር ወቅቱን ትንበያማ እንዲሆን እንሞክራለን።',
    ],
    included: [
      'ፌዴራል እና ግዛት የገቢ ግብር መመዝገቢያዎች',
      'ራስ ስራ / ሴዱይል C ድጋፍ',
      'ITIN ማመልከቻ እና እንደገና ማደስ',
      'የተሻሻሉ መመዝገቢያዎች',
      'ኤ-ፋይል',
    ],
    audience: 'ጥያቄዎችን ለመመለስ እና ሰነዶችን በብቃት ለማደራጀት ጊዜ የሚወስድ አዘጋጅ ለሚፈልጉ ሰዎች እና የንግድ ባለቤቶች።',
    faqs: [
      {
        q: 'ምን ሰነዶች ልይዝ?',
        a: 'W-2፣ 1099፣ መታወቂያ፣ የቀድሞ ዓመት መመዝገቢያ፣ ቅናሽ ማስረጃ እና የንግድ ገቢ/ወጪ ሰነዶች።',
      },
      {
        q: 'የማስገባት የመጨረሻ ቀኖች?',
        a: 'የፌዴራል ቀኖች በየወቅቱ ይታወቃሉ፤ የግዛት ቀኖች ሊለያዩ ይችላሉ።',
      },
      {
        q: 'ITIN እና SSN ልዩነት?',
        a: 'SSN ለአዝማሪዎች እና ተገቢ ለሆኑ ነዋሪዎች ነው። ITIN ለመመዝገት ለሚፈልጉ ነገር ግን ለSSN ያልተገቡ።',
      },
      {
        q: 'ተመላሽ ገንዘብ ለምን ያህል ይወስዳል?',
        a: 'የIRS ሂደት ጊዜ ይለያል። ኤ-ፋይል ብዙ ጊዜ ፈጣን ነው፤ ጊዜን አንضضም።',
      },
    ],
  },
  immigration_forms: {
    title: 'የስደት ቅጾች አገልግሎት',
    subtitle: 'የUSCIS ሰነዶች ጥንቃቄ ያለው ዝግጅት እና ማጣራት።',
    overview: [
      'የስደት ቅጾችን ለመሞላት እና ለማጣራት እንረዳለን — መረጃ አንድ አይነት፣ ሙሉ እና ለማስገባት ዝግጁ ይሆናል። ትክክለኛነት እና ግልጽ ዝርዝር ዝርዝር እናስባለን።',
      'እያንዳንዱ ጉዳይ የተለየ ነው — ለእርስዎ የሚመለከቱ ቅጾችን እንረዳለን።',
    ],
    included: ['I-90', 'I-130', 'I-485', 'I-765', 'N-400', 'DACA እንደገና ማደስ (I-821D) — ሲመለከት'],
    audience: 'የUSCIS ቅጾችን ለሚያልፉ ሰዎች እና ቤተሰቦች በቅጥር ዝግጅት ድጋፍ ለሚፈልጉ።',
    disclaimer:
      'እኛ አቃቤ ህግ አይደለንም። ሰነድ ዝግጅት ብቻ እንሰጣለን — የህግ አማካሪ አይደለንም። ለህግ ውክልና ከስደት አቃቤ ህግ ጋር ይማከሩ።',
    faqs: [
      {
        q: 'ምን ቅጾች ልትረዱኝ ትችላላችሁ?',
        a: 'ብዙ የተለመዱ USCIS ቅጾችን እንደገፅ እንረዳለን፤ በኮንሰልቴሽን ለእርስዎ ቅጾች እርዳታ እንረጋግጣለን።',
      },
      {
        q: 'የሂደት ጊዜ ማረጋገጥ ትችላላችሁ?',
        a: 'አይደለም። የመንግስት ሂደት በሰፊው ይለያል።',
      },
      {
        q: 'ጉዳዬን እንዴት እከታተላለሁ?',
        a: 'USCIS የመስመር ላይ የጉዳድ ሁኔታ መሳሪያዎች አሉ።',
      },
    ],
  },
  notary_services: {
    title: 'ኖታሪ አገልግሎት',
    subtitle: 'ለአስፈላጊ ሰነዶችዎ የተመዘገበ ኖታሪ።',
    overview: [
      'ለብዙ የተለመዱ ሰነዶች ፊርማ ምስክር እና መሐላ እንሰጣለን። የፊርማ አድራጊ መታወቂያ እንደህጉ እንፈትሻለን።',
      'ቦታ ሲኖር ያለቀጠሮ ግብዣ፤ ቀጠሮ ዝቅተኛ መጠባበቂያ ያረጋግጣል።',
    ],
    included: ['ማረጋገጫ', 'ጁራት', 'እምነት መግለጫ', 'የብድር ሰነድ ጥቅል (በስምምነት)', 'የኃይል ምዝገባ', 'የተሽከርካሪ ርዕስ (የሚፈቀድበት)'],
    audience: 'ለግል፣ ለንብረት ወይም ለንግድ ሰነዶች ለሚያስፈልግ ኖታሪ ለሚፈልጉ ማንኛውም ሰው።',
    faqs: [
      {
        q: 'ምን ልይዝ?',
        a: 'ያልተፈረሙ ሰነዶች (ካልተባለ በስተቀር)፣ የመንግስት ፎቶ መታወቂያ እና ሰነድዎ የሚፈልጉ ምስክሮች።',
      },
      {
        q: 'ሞባይል ኖታሪ አላችሁ?',
        a: 'በቦታ እና በመርሀ ግብር ላይ ይወሰናል — በማስያዝ ጠይቁ።',
      },
      {
        q: 'አፖስቲል ልትረዱኝ ትችላላችሁ?',
        a: 'ለአፖስቲል ሰርጦችን እንደምንመራ እንገልጻለን።',
      },
      {
        q: 'ክፍያ እንዴት ይወሰናል?',
        a: 'በህግ የተወሰነ ሰንጠረዥ ሲኖር እንደዚያ፣ እንዲሁም የጉዞ ወይም ከሰዓት ውጭ ክፍያዎች ሲስማሙ።',
      },
    ],
  },
}

export const dictionary = {
  en: {
    meta: {
      htmlTitle: 'Insurance & Tax Services',
    },
    business: {
      name: siteConfig.businessName,
      tagline: 'Protecting what matters most — your family, business, and future.',
      address: siteConfig.addressEn,
      phone: siteConfig.phone,
      email: siteConfig.email,
      hours: 'Monday – Friday: 9:00 AM – 6:00 PM · Saturday: 10:00 AM – 2:00 PM · Closed Sunday',
    },
    nav: {
      home: 'Home',
      services: 'Services',
      servicesAll: 'All services',
      viewAllServices: 'View all services →',
      book: 'Book Appointment',
      contact: 'Contact',
      menu: 'Menu',
      openMenu: 'Open menu',
      bookNow: 'Book now',
      language: 'Language',
      english: 'English',
      amharic: 'አማርኛ',
    },
    footer: {
      taglineLabel: 'Connect',
      servicesHeading: 'Services',
      copyright: 'All rights reserved.',
    },
    home: {
      hero: {
        title: 'Trusted Insurance, Tax & Business Services',
        subtitle: 'Protecting what matters most — your family, business, and future.',
        ctaBook: 'Book an Appointment',
        ctaServices: 'Our Services',
      },
      servicesGrid: {
        heading: 'What We Offer',
        sub: 'Comprehensive coverage and professional support for individuals and businesses.',
        learnMore: 'Learn more',
      },
      why: {
        heading: 'Why Clients Choose Us',
        pillar1Title: 'Licensed & Experienced Professionals',
        pillar1Text: 'Work with a team that knows insurance, tax, and compliance inside and out.',
        pillar2Title: 'Bilingual services',
        pillar2Text: 'English and Amharic support so every client feels heard and understood.',
        pillar3Title: 'Same-Day Appointments',
        pillar3Text: 'Busy schedule? We do our best to accommodate urgent needs when slots allow.',
        pillar4Title: 'Client-First Approach',
        pillar4Text: 'Personalized guidance—not one-size-fits-all forms and phone trees.',
      },
      testimonials: {
        heading: 'What People Say',
        sub: 'Placeholder testimonials—replace with real client feedback when ready.',
        items: [
          {
            name: 'Elena R.',
            quote:
              'They explained every option for our business policy in plain language. Felt confident signing.',
          },
          {
            name: 'Marcus T.',
            quote: 'Tax season used to stress me out. Now I drop off documents and they handle the rest.',
          },
          {
            name: 'Sofia M.',
            quote: 'Friendly front desk, fair pricing, and they remembered my renewal date without me asking.',
          },
        ],
      },
      cta: {
        title: 'Ready to get started?',
        sub: 'Schedule your appointment today.',
        button: 'Book Now',
      },
    },
    servicesPage: {
      title: 'Our Services',
      sub: 'From auto coverage to tax filing and notary work—we help individuals and businesses stay protected and compliant.',
      viewDetails: 'View details',
    },
    serviceDetail: {
      sectionServices: 'Services',
      overview: 'Overview',
      included: "What's Included",
      audience: 'Who Needs This',
      faq: 'Frequently Asked Questions',
      ctaTitle: 'Schedule a Consultation',
      ctaSub: 'Pick a time that works for you—we will confirm by email.',
      ctaButton: 'Book an appointment',
      important: 'Important',
    },
    booking: {
      pageTitle: 'Book an appointment',
      pageSub: 'Complete each step to reserve your visit.',
      steps: { service: 'Service', datetime: 'Date & time', details: 'Your details' },
      step1Title: 'Select a service',
      step1Sub: 'Pick the service you want to discuss.',
      step2Title: 'Choose date and time',
      step2Sub: 'Available times reflect our live calendar.',
      step3Title: 'Your information',
      step3Sub: 'We will send a confirmation to your email.',
      next: 'Next',
      back: 'Back',
      calendarUnavailable: 'Calendar unavailable',
      calendarUnavailableSub: 'Check your connection or try again in a moment.',
      retry: 'Retry',
      slotsLoadError: 'Could not load slots.',
      slotsRetry: 'Retry',
      calendarHint: 'Dates highlighted in gold have open availability. Past dates and dates without slots cannot be selected.',
      timesHeading: 'Available times',
      noSlots: 'No time slots for this date. Choose another day.',
      bookSuccessToast: 'Appointment booked — check your email for confirmation.',
      confirm: 'Confirm booking',
      submitting: 'Submitting…',
      datesLoadErrorToast: 'Could not load available dates.',
      formErrorGeneric: 'Something went wrong. Please try again.',
      slotTaken: ' (taken)',
      calendarPrevMonth: 'Previous month',
      calendarNextMonth: 'Next month',
      weekday0: 'Sun',
      weekday1: 'Mon',
      weekday2: 'Tue',
      weekday3: 'Wed',
      weekday4: 'Thu',
      weekday5: 'Fri',
      weekday6: 'Sat',
      formRequired: 'Required',
      formEmailInvalid: 'Enter a valid email',
      formPhoneInvalid: 'Enter a valid phone number',
      formFirstName: 'First name',
      formLastName: 'Last name',
      formEmail: 'Email',
      formPhone: 'Phone',
      formNotes: 'Notes (optional)',
      formNotesPlaceholder: 'Anything we should know before your visit?',
    },
    bookingSuccess: {
      titleBooked: "You're booked!",
      titleReceived: 'Booking received',
      emailLine: 'A confirmation email has been sent to',
      immigrationReminder:
        'Reminder: we provide document preparation only—not legal advice. Consult an attorney for legal representation.',
      bookAnother: 'Book another appointment',
      home: 'Return home',
      stale:
        'Thank you. If you arrived here directly, your confirmation details are not available in this browser session—please check your email or contact the office.',
      staleWithIdPrefix: 'Your reference ID is',
      staleWithIdSuffix: "If you do not see a confirmation email within a few minutes, check spam or contact us.",
      backHome: 'Back to home',
      detailService: 'Service',
      detailDate: 'Date',
      detailTime: 'Time',
      detailName: 'Name',
      detailConfirmation: 'Confirmation',
    },
    contact: {
      pageTitle: 'Contact us',
      pageSub: 'Visit, call, or send a message—we respond as soon as we can.',
      office: 'Office',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      hoursLabel: 'Hours',
      sendTitle: 'Send a message',
      sent: 'Your message has been sent successfully.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      toastSuccess: 'Message sent. We will get back to you soon.',
      toastError: 'Unable to send message.',
      mapEmbedTitle: 'Business location',
    },
    admin: {
      sidebarBrand: siteConfig.shortBusinessName,
      menu: 'Menu',
      logout: 'Logout',
      loginTitle: 'Admin sign in',
      loginSub: 'Enter your credentials to manage appointments and availability.',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign in',
      signingIn: 'Signing in…',
      backSite: '← Back to site',
      dashboardTitle: 'Dashboard',
      dashboardSub: 'Overview of bookings and activity.',
      statsMonth: 'Appointments this month',
      statsWeek: 'Upcoming (7 days)',
      statsCancelled: 'Cancelled this month',
      statsTopService: 'Most booked service',
      recent: 'Recent appointments',
      viewAll: 'View all →',
      noRecent: 'No recent appointments yet.',
      appointmentsTitle: 'Appointments',
      appointmentsSub: 'Filter, search, and manage bookings.',
      exportCsv: 'Export CSV',
      availabilityTitle: 'Availability',
      availabilitySub: 'Set which dates and times clients can book.',
      adminHeader: 'Admin',
      filterService: 'Service',
      filterStatus: 'Status',
      filterFrom: 'From',
      filterTo: 'To',
      searchLabel: 'Search name or email',
      searchPh: 'Search…',
      all: 'All',
      tableDate: 'Date',
      tableTime: 'Time',
      tableClient: 'Client',
      tableEmail: 'Email',
      tablePhone: 'Phone',
      tableService: 'Service',
      tableStatus: 'Status',
      tableActions: 'Actions',
      view: 'View',
      noRows: 'No appointments match your filters.',
      prev: 'Previous',
      nextPage: 'Next',
      pageOf: 'Page',
      of: 'of',
      total: 'total',
      notFound404: '404',
      notFoundTitle: 'Page not found',
      notFoundSub: 'The page you are looking for does not exist or has been moved.',
      goHome: 'Go home',
      retry: 'Retry',
      statusUpcoming: 'Upcoming',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      dashboardLoadError: 'Could not load dashboard statistics.',
      requestFailed: 'Request failed.',
      tryAgain: 'Try again',
      openAdminMenu: 'Open admin menu',
      availMonthlyTitle: 'Monthly calendar',
      availMonthlySub:
        'Click a date to add or remove time slots. Booked slots cannot be deleted.',
      availLoadError: 'Could not load availability.',
      availRemoveErr: 'Could not remove slot.',
      availAddErr: 'Could not add slots.',
      availBulkErr: 'Bulk schedule failed.',
      availPrevMonth: 'Previous month',
      availNextMonth: 'Next month',
      availOpenLower: 'open',
      availCopyMonday: "Copy Monday's slots to Tue–Fri",
      availRecurringBtn: 'Recurring weekly schedule…',
      availSlotsFor: 'Slots for',
      availDialogSlotsSub: 'Add times visitors can book. Remove only empty slots.',
      availBooked: 'Booked',
      availOpen: 'Open',
      availRemove: 'Remove',
      availAddOneSlot: 'Single time',
      availAddRangeSection: 'Time range for this day',
      availAddTimeLabel: 'Add time (HH:mm)',
      availAddSlot: 'Add slot',
      availAddRangeBtn: 'Add slots from range',
      availInvalidRange: 'Use valid HH:mm with start ≤ end and interval ≥ 5 minutes.',
      availClearDay: 'Clear all open slots this day',
      availDone: 'Done',
      availBulkTitle: 'Recurring schedule',
      availBulkSub: 'Generate slots across a date range for selected weekdays.',
      availStartDate: 'Start date',
      availEndDate: 'End date',
      availWeekdaysLabel: 'Weekdays',
      availFrom: 'From',
      availTo: 'To',
      availInterval: 'Interval (min)',
      availGenerate: 'Generate slots',
      availCreated: 'Created',
      availSlotsWord: 'slot(s).',
      loginInvalid: 'Invalid email or password.',
      loginFailed: 'Unable to sign in. Please try again.',
      modalTitle: 'Appointment details',
      modalSub: 'View information and update status or internal notes.',
      modalLoading: 'Loading…',
      modalClient: 'Client',
      modalWhen: 'When',
      modalClientNotes: 'Client notes',
      modalAdminNotes: 'Admin notes',
      modalMarkCompleted: 'Mark completed',
      modalCancelAppt: 'Cancel appointment',
      modalSaveNotes: 'Save notes only',
      modalUpdatedToast: 'Appointment updated.',
      modalUpdateFailed: 'Update failed.',
    },
    servicesNav: {
      auto_insurance: { title: 'Auto Insurance', short: 'Personal vehicle coverage tailored to you.' },
      commercial_auto: { title: 'Commercial Auto', short: 'Fleet and business vehicle protection.' },
      business_insurance: { title: 'Business Insurance', short: 'Liability, property, and more for your company.' },
      tax_preparation: { title: 'Tax Preparation', short: 'Individual and business returns done right.' },
      immigration_forms: { title: 'Immigration Forms', short: 'USCIS form preparation and review.' },
      notary_services: { title: 'Notary Services', short: 'Acknowledgments, jurats, and more.' },
    },
    servicePages: SERVICE_PAGES_EN,
  },
  am: {
    meta: { htmlTitle: 'መድን እና ግብር አገልግሎቶች' },
    business: {
      name: siteConfig.businessNameAm,
      tagline: 'ለቤተሰብዎ፣ ለንግድዎ እና ለወደፊትዎ አስፈላጊውን በመጠበቅ።',
      address: siteConfig.addressAm,
      phone: siteConfig.phone,
      email: siteConfig.email,
      hours: 'ሰኞ–አርብ፦ 9፡00 ሰዓት – 6፡00 ሰዓት · ቅዳሜ፦ 10፡00 – 2፡00 · እሑድ ዝግጁ',
    },
    nav: {
      home: 'መነሻ',
      services: 'አገልግሎቶች',
      servicesAll: 'ሁሉም አገልግሎቶች',
      viewAllServices: 'ሁሉንም አገልግሎቶች →',
      book: 'ቀጠሮ ያስያዙ',
      contact: 'ግንኙነት',
      menu: 'ሜኑ',
      openMenu: 'ሜኑ ክፈት',
      bookNow: 'አሁን ይያዙ',
      language: 'ቋንቋ',
      english: 'English',
      amharic: 'አማርኛ',
    },
    footer: {
      taglineLabel: 'ግንኙነት',
      servicesHeading: 'አገልግሎቶች',
      copyright: 'መብቱ በህግ የተጠበቀ ነው።',
    },
    home: {
      hero: {
        title: 'የታመኑ መድን፣ ግብር እና ንግድ አገልግሎቶች',
        subtitle: 'ለቤተሰብዎ፣ ለንግድዎ እና ለወደፊትዎ አስፈላጊውን በመጠበቅ።',
        ctaBook: 'ቀጠሮ ይያዙ',
        ctaServices: 'አገልግሎቶቻችን',
      },
      servicesGrid: {
        heading: 'ምን እንሰጣለን',
        sub: 'ለግል ሰዎች እና ለንግዶች ሰፊ ሽፋን እና ሙያዊ ድጋፍ።',
        learnMore: 'ዝርዝር ይመልከቱ',
      },
      why: {
        heading: 'ደንበኞች ለምን ይመርጡናል',
        pillar1Title: 'የተፈቀደ እና ልምድ ያለው ቡድን',
        pillar1Text: 'መድን፣ ግብር እና ህጎችን በጥልቀት የሚያውቅ ቡድን ጋር ይስሩ።',
        pillar2Title: 'ሁለት ቋንቋዊ አገልግሎት',
        pillar2Text: 'እንግሊዝኛ እና አማርኛ ድጋፍ — እያንዳንዱ ደንበኛ እንዲሰማው።',
        pillar3Title: 'በዚህ ቀን ቀጠሮ',
        pillar3Text: 'ጊዜዎ ጠባብ ነው? ቦታ ሲፈቅድ አስቸኳይ ፍላጎት ለማስተናገድ እንሞክራለን።',
        pillar4Title: 'ደንበኛ በመጀመሪያ',
        pillar4Text: 'የግል መመሪያ — አንድ አይነት ቅጾች እና ረጅም ስልክ ቅንጅቶች አይደለም።',
      },
      testimonials: {
        heading: 'ሰዎች ምን ይላሉ',
        sub: 'ለምሳሌ የተጻፈ — በእውነተኛ አስተያየት ይተኩ።',
        items: [
          {
            name: 'ኤሌና ረ.',
            quote: 'የንግድ ፖሊሲያችንን በቀላል ቋንቋ ሁሉንም አማራጮች አብራርተውልናል። በመተማመን ፈርመናል።',
          },
          {
            name: 'ማርኩስ ቲ.',
            quote: 'የግብር ወቅት ያስጨነቀኝ ነበር። አሁን ሰነዶችን አስረክቤ ቀሪውን ይመለከታሉ።',
          },
          {
            name: 'ሶፍያ ም.',
            quote: 'ደግ የፊት ገፅ፣ ፍትሃዊ ዋጋ፣ የማደስ ቀኔንም ሳልጠይቅ አስታውሰውኛል።',
          },
        ],
      },
      cta: {
        title: 'ለመጀመር ዝግጁ ነዎት?',
        sub: 'ዛሬው ቀጠሮዎን ያስያዙ።',
        button: 'አሁን ይያዙ',
      },
    },
    servicesPage: {
      title: 'አገልግሎቶቻችን',
      sub: 'ከመኪና ሽፋን እስከ ግብር ማስያዝ እና ኖታሪ — ለግል እና ለንግድ እንዲጠበቁ እንረዳለን።',
      viewDetails: 'ዝርዝር',
    },
    serviceDetail: {
      sectionServices: 'አገልግሎቶች',
      overview: 'አጠቃላይ እይታ',
      included: 'የሚካተቱት',
      audience: 'ለማን ነው',
      faq: 'ተደጋጋሚ ጥያቄዎች',
      ctaTitle: 'ኮንሰልቴሽን ቀጠሮ',
      ctaSub: 'የሚስማማዎት ጊዜ ይምረጡ — በኢሜይል እንረዳዎታለን።',
      ctaButton: 'ቀጠሮ ይያዙ',
      important: 'አስፈላጊ',
    },
    booking: {
      pageTitle: 'ቀጠሮ ይያዙ',
      pageSub: 'ቀጠሮዎን ለማስያዝ እያንዳንዱን ደረጃ ያጠናቅቁ።',
      steps: { service: 'አገልግሎት', datetime: 'ቀን እና ሰዓት', details: 'የእርስዎ መረጃ' },
      step1Title: 'አገልግሎት ይምረጡ',
      step1Sub: 'ለመወያየት የሚፈልጉትን አገልግሎት ይምረጡ።',
      step2Title: 'ቀን እና ሰዓት ይምረጡ',
      step2Sub: 'የሚገኙ ሰዓቶች ከቀጠቀሉ የቀን መቁጠሪያችን ይመራሉ።',
      step3Title: 'የእርስዎ መረጃ',
      step3Sub: 'ማረጋገጫ በኢሜይል እንልካለን።',
      next: 'ቀጣይ',
      back: 'ተመለስ',
      calendarUnavailable: 'የቀን መቁጠሪያ አይገኝም',
      calendarUnavailableSub: 'ግንኙነትዎን ይመልከቱ ወይም ቆይተው ይሞክሩ።',
      retry: 'እንደገና ይሞክሩ',
      slotsLoadError: 'የሰዓት ቦታ አልተጫነም።',
      slotsRetry: 'እንደገና',
      calendarHint: 'በወርቅ የተደመደሙ ቀናት ክፍት ቦታ አላቸው። ያለፉ ቀናት እና ቦታ የሌላቸውን ማስያድ አይቻልም።',
      timesHeading: 'የሚገኙ ሰዓቶች',
      noSlots: 'በዚህ ቀን ሰዕት የለም። ሌላ ቀን ይምረጡ።',
      bookSuccessToast: 'ቀጠሮ ተያዘ — ማረጋገጫ በኢሜይል ይመልከቱ።',
      confirm: 'ቀጠሮ ያረጋግጡ',
      submitting: 'በመላክ ላይ…',
      datesLoadErrorToast: 'የሚገኙ ቀናት አልተጫኑም።',
      formErrorGeneric: 'ስህተት ተፈጥሯል። እንደገና ይሞክሩ።',
      slotTaken: ' (ተያዘ)',
      calendarPrevMonth: 'ያለፈው ወር',
      calendarNextMonth: 'ቀጣይ ወር',
      weekday0: 'እሑድ',
      weekday1: 'ሰኞ',
      weekday2: 'ማክሰ',
      weekday3: 'ረቡዕ',
      weekday4: 'ሐሙስ',
      weekday5: 'ዓርብ',
      weekday6: 'ቅዳሜ',
      formRequired: 'ያስፈልጋል',
      formEmailInvalid: 'ትክክለኛ ኢሜይል ያስገቡ',
      formPhoneInvalid: 'ትክክለኛ ስልክ ያስገቡ',
      formFirstName: 'የመጀመሪያ ስም',
      formLastName: 'የአባት ስም',
      formEmail: 'ኢሜይል',
      formPhone: 'ስልክ',
      formNotes: 'ማስታወሻ (አማራጭ)',
      formNotesPlaceholder: 'ከጉብኝትዎ በፊት ማወቅ ያለብን ነገር አለ?',
    },
    bookingSuccess: {
      titleBooked: 'ቀጠሮዎ ተያዘ!',
      titleReceived: 'ጥያቄዎ ተቀብለናል',
      emailLine: 'የማረጋገጫ ኢሜይል ወደዚህ ተላከ',
      immigrationReminder:
        'ማስታወሻ፦ ሰነድ ዝግጅት ብቻ ነን — የህግ አማካሪ አይደለንም። ለህግ ውክልና ከህግ ባለሙያ ጋር ይማከሩ።',
      bookAnother: 'ሌላ ቀጠሮ',
      home: 'ወደ መነሻ',
      stale: 'እናመሰግናለን። በቀጥታ ከመጡ፣ ዝርዝሩ በዚህ አሳሽ አይታይም — ኢሜይል ይመልከቱ ወይም ቢሮ ይደውሉ።',
      staleWithIdPrefix: 'የማመሳከሪያ ቁጥርዎ',
      staleWithIdSuffix: 'ኢሜይል ካልመጣ በጥቂት ደቂቃ ውስጥ፣ ስፓም ይመልከቱ ወይም ይደውሉ።',
      backHome: 'ወደ መነሻ',
      detailService: 'አገልግሎት',
      detailDate: 'ቀን',
      detailTime: 'ሰዓት',
      detailName: 'ስም',
      detailConfirmation: 'ማረጋገጫ',
    },
    contact: {
      pageTitle: 'ያግኙን',
      pageSub: 'ይጎብኙ፣ ይደውሉ ወይም መልእክት ይላኩ — በተቻለ ፍጥነት እንመልሳለን።',
      office: 'ቢሮ',
      phoneLabel: 'ስልክ፦',
      emailLabel: 'ኢሜይል፦',
      hoursLabel: 'ሰዓት',
      sendTitle: 'መልእክት ይላኩ',
      sent: 'መልእክትዎ ተላከ።',
      name: 'ስም',
      email: 'ኢሜይል',
      subject: 'ርዕስ',
      message: 'መልእክት',
      send: 'መልእክት ላክ',
      sending: 'በመላክ ላይ…',
      toastSuccess: 'መልእክት ተላከ። በቅርቡ እንመልሳለን።',
      toastError: 'መልእክት መላክ አልተቻለም።',
      mapEmbedTitle: 'የቢሮ ቦታ',
    },
    admin: {
      sidebarBrand: siteConfig.shortBusinessNameAm,
      menu: 'ሜኑ',
      logout: 'ውጣ',
      loginTitle: 'አስተዳዳሪ ግባ',
      loginSub: 'ቀጠሮዎችን እና ቦታ ለማስተናገድ መግቢያዎን ያስገቡ።',
      email: 'ኢሜይል',
      password: 'የይለፍ ቃል',
      signIn: 'ግባ',
      signingIn: 'በመግባት ላይ…',
      backSite: '← ወደ ጣቢያ ተመለስ',
      dashboardTitle: 'ዳሽቦርድ',
      dashboardSub: 'የቀጠሮ እንቅስቃሴ አጠቃላይ እይታ።',
      statsMonth: 'በዚህ ወር ቀጠሮዎች',
      statsWeek: 'በ7 ቀናት ውስጥ የሚጠበቁ',
      statsCancelled: 'በዚህ ወር የተሰረዙ',
      statsTopService: 'በብዛት የተያዘ አገልግሎት',
      recent: 'የቅርብ ቀጠሮዎች',
      viewAll: 'ሁሉንም ይመልከቱ →',
      noRecent: 'አዲስ ቀጠሮ የለም።',
      appointmentsTitle: 'ቀጠሮዎች',
      appointmentsSub: 'ፈልግ፣ አጣራ እና ያስተዳድሩ።',
      exportCsv: 'CSV ላክ',
      availabilityTitle: 'የሚገኝበት ሰዓት',
      availabilitySub: 'ደንበኞች የሚያዙበትን ቀን እና ሰዓት ያቀናብሩ።',
      adminHeader: 'አስተዳዳሪ',
      filterService: 'አገልግሎት',
      filterStatus: 'ሁኔት',
      filterFrom: 'ከ',
      filterTo: 'እስከ',
      searchLabel: 'ስም ወይም ኢሜይል ፈልግ',
      searchPh: 'ፈልግ…',
      all: 'ሁሉም',
      tableDate: 'ቀን',
      tableTime: 'ሰዓት',
      tableClient: 'ደንበኛ',
      tableEmail: 'ኢሜይል',
      tablePhone: 'ስልክ',
      tableService: 'አገልግሎት',
      tableStatus: 'ሁኔት',
      tableActions: 'ድርጊቶች',
      view: 'ይመልከቱ',
      noRows: 'ለማጣሪያዎ የሚስማማ ቀጠሮ የለም።',
      prev: 'ቀዳሚ',
      nextPage: 'ቀጣይ',
      pageOf: 'ገፅ',
      of: 'ከ',
      total: 'ጠቅላላ',
      notFound404: '404',
      notFoundTitle: 'ገፅ አልተገኘም',
      notFoundSub: 'የሚፈልጉት ገፅ የለም ወይም ተንቀሳቅሷል።',
      goHome: 'ወደ መነሻ',
      retry: 'እንደገና',
      statusUpcoming: 'የሚጠበቅ',
      statusCompleted: 'ተጠናቋል',
      statusCancelled: 'ተሰርዟል',
      dashboardLoadError: 'የዳሽቦርድ ስታትስቲክስ መጫን አልተሳካም።',
      requestFailed: 'ጥያቄ አልተሳካም።',
      tryAgain: 'እንደገና ይሞክሩ',
      openAdminMenu: 'የአስተዳዳሪ ሜኑ ክፈት',
      availMonthlyTitle: 'ወርሃዊ ቀን መቁጠሪያ',
      availMonthlySub: 'ቀን ይጫኑ ሰዓት ለመጨመር ወይም ለማስወገድ። የተያዙ ቦታዎች ሊሰረዙ አይችሉም።',
      availLoadError: 'የሚገኝበት ሰዓት መጫን አልተሳካም።',
      availRemoveErr: 'ቦታ ማስወገድ አልተሳካም።',
      availAddErr: 'ቦታ ማከል አልተሳካም።',
      availBulkErr: 'የጅምላ መርሀ ግብር አልተሳካም።',
      availPrevMonth: 'ያለፈው ወር',
      availNextMonth: 'ቀጣይ ወር',
      availOpenLower: 'ክፍት',
      availCopyMonday: 'የሰኞን ቦታዎች ወደ ማክ–አርብ ቅዳ',
      availRecurringBtn: 'የድግግሞሽ ሳምንታዊ መርሀ ግብር…',
      availSlotsFor: 'ቦታዎች፦',
      availDialogSlotsSub: 'ጎብኚዎች የሚያዙበትን ሰዓት ይጨምሩ። ባዶ ቦታ ብቻ ይወግዱ።',
      availBooked: 'ተያዘ',
      availOpen: 'ክፍት',
      availRemove: 'አስወግድ',
      availAddOneSlot: 'ነጠላ ሰዓት',
      availAddRangeSection: 'ለዚህ ቀን የሰዓት ክልል',
      availAddTimeLabel: 'ሰዓት ጨምር (HH:mm)',
      availAddSlot: 'ቦታ ጨምር',
      availAddRangeBtn: 'ከምዕራፍ ቦታ ይጨምሩ',
      availInvalidRange: 'ትክክለኛ HH:mm፣ መጀመሪያ ≤ መጨረሻ፣ ክፍተት ≥ 5 ደቂቃ።',
      availClearDay: 'በዚህ ቀን ሁሉንም ክፍት ቦታዎች አጽዳ',
      availDone: 'ተከናውኗል',
      availBulkTitle: 'የድግግሞሽ መርሀ ግብር',
      availBulkSub: 'ለተመረጡ የሳምንት ቀናት በቀን ክልል ውስጥ ቦታ ይፍጠሩ።',
      availStartDate: 'መጀመሪያ ቀን',
      availEndDate: 'መጨረሻ ቀን',
      availWeekdaysLabel: 'የሳምንት ቀናት',
      availFrom: 'ከ',
      availTo: 'እስከ',
      availInterval: 'ክፍተት (ደቂቃ)',
      availGenerate: 'ቦታ ፍጠር',
      availCreated: 'ተፈጠረ',
      availSlotsWord: 'ቦታ(ዎች)።',
      loginInvalid: 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል።',
      loginFailed: 'መግባት አልተሳካም። እንደገና ይሞክሩ።',
      modalTitle: 'የቀጠሮ ዝርዝር',
      modalSub: 'መረጃ ይመልከቱ፣ ሁኔት ወይም የውስጥ ማስታወሻ ያዘምኑ።',
      modalLoading: 'በመጫን ላይ…',
      modalClient: 'ደንበኛ',
      modalWhen: 'መቼ',
      modalClientNotes: 'የደንበኛ ማስታወሻ',
      modalAdminNotes: 'የአስተዳዳሪ ማስታወሻ',
      modalMarkCompleted: 'እንደተጠናቀቀ ምልክት',
      modalCancelAppt: 'ቀጠሮ ሰርዝ',
      modalSaveNotes: 'ማስታወሻ ብቻ አስቀምጥ',
      modalUpdatedToast: 'ቀጠሮ ተዘምኗል።',
      modalUpdateFailed: 'ማዘመን አልተሳካም።',
    },
    servicesNav: {
      auto_insurance: { title: 'የመኪና መድን', short: 'ለግል ተሽከርካሪ የተስማማ ሽፋን።' },
      commercial_auto: { title: 'የንግድ መኪና መድን', short: 'ለቡድን እና ለንግድ ተሽከርካሪ ጥበቃ።' },
      business_insurance: { title: 'የንግድ መድን', short: 'ለኩባንያዎ ኃላፊነት፣ ንብረት እና ሌሎችም።' },
      tax_preparation: { title: 'ግብር ማዘጋጀት', short: 'ለግል እና ለንግድ ትክክለኛ መመዝገቢያዎች።' },
      immigration_forms: { title: 'የስደት ቅጾች', short: 'የUSCIS ቅጾች ዝግጅት እና ማጣራት።' },
      notary_services: { title: 'ኖታሪ አገልግሎት', short: 'ማረጋገጫ፣ ጁራት እና ሌሎችም።' },
    },
    servicePages: SERVICE_PAGES_AM,
  },
}

