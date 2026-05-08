import type { ServiceSlug } from '@/types'
import {
  Building2,
  Car,
  FileText,
  Landmark,
  Stamp,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export interface ServiceDefinition {
  slug: ServiceSlug
  path: string
  icon: LucideIcon
  /** Decorative background image for service cards. Hot-linked from Unsplash. */
  image: string
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=60&auto=format&fit=crop`

/** Slug, route, icon only — titles and blurbs come from `useServiceNavItems()` / `dictionary.ts`. */
export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    slug: 'auto_insurance',
    path: '/auto-insurance',
    icon: Car,
    image: unsplash('1449965408869-eaa3f722e40d'),
  },
  {
    slug: 'commercial_auto',
    path: '/commercial-auto',
    icon: Truck,
    image: unsplash('1601584115197-04ecc0da31d7'),
  },
  {
    slug: 'business_insurance',
    path: '/business-insurance',
    icon: Building2,
    image: unsplash('1497366216548-37526070297c'),
  },
  {
    slug: 'tax_preparation',
    path: '/tax-preparation',
    icon: FileText,
    image: unsplash('1554224155-6726b3ff858f'),
  },
  {
    slug: 'immigration_forms',
    path: '/immigration-forms',
    icon: Landmark,
    image: unsplash('1569959220744-ff553533f492'),
  },
  {
    slug: 'notary_services',
    path: '/notary-services',
    icon: Stamp,
    image: unsplash('1450101499163-c8848c66ca85'),
  },
]

export function serviceBySlug(slug: ServiceSlug): ServiceDefinition | undefined {
  return SERVICE_DEFINITIONS.find((s) => s.slug === slug)
}

export function serviceSlugFromQueryParam(param: string | null): ServiceSlug | undefined {
  if (!param) return undefined
  const normalized = param.replace(/-/g, '_')
  const allowed = SERVICE_DEFINITIONS.map((s) => s.slug)
  return allowed.includes(normalized as ServiceSlug) ? (normalized as ServiceSlug) : undefined
}
