import { useMemo } from 'react'
import { useI18n } from '@/i18n/context'
import { SERVICE_DEFINITIONS, type ServiceDefinition } from '@/lib/constants'
import type { ServiceSlug } from '@/types'

export type ServiceNavItem = ServiceDefinition & {
  title: string
  shortDescription: string
}

export function useServiceNavItems(): ServiceNavItem[] {
  const { t } = useI18n()
  return useMemo(
    () =>
      SERVICE_DEFINITIONS.map((s) => ({
        ...s,
        title: t(`servicesNav.${s.slug}.title`),
        shortDescription: t(`servicesNav.${s.slug}.short`),
      })),
    [t],
  )
}

export function useServiceNavItem(slug: ServiceSlug): ServiceNavItem | undefined {
  const { t } = useI18n()
  return useMemo(() => {
    const def = SERVICE_DEFINITIONS.find((s) => s.slug === slug)
    if (!def) return undefined
    return {
      ...def,
      title: t(`servicesNav.${slug}.title`),
      shortDescription: t(`servicesNav.${slug}.short`),
    }
  }, [slug, t])
}
