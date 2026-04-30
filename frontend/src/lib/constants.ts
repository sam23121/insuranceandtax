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
}

/** Slug, route, icon only — titles and blurbs come from `useServiceNavItems()` / `dictionary.ts`. */
export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  { slug: 'auto_insurance', path: '/auto-insurance', icon: Car },
  { slug: 'commercial_auto', path: '/commercial-auto', icon: Truck },
  { slug: 'business_insurance', path: '/business-insurance', icon: Building2 },
  { slug: 'tax_preparation', path: '/tax-preparation', icon: FileText },
  { slug: 'immigration_forms', path: '/immigration-forms', icon: Landmark },
  { slug: 'notary_services', path: '/notary-services', icon: Stamp },
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
