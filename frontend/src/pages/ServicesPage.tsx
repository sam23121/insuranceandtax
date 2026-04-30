import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'
import { Card, CardContent } from '@/components/ui/card'

export function ServicesPage() {
  const { t } = useI18n()
  const services = useServiceNavItems()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-brand-navy">{t('servicesPage.title')}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">{t('servicesPage.sub')}</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.slug} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-brand-navy">{s.title}</h2>
                  <p className="mt-2 text-sm text-ink/70">{s.shortDescription}</p>
                </div>
                <Link
                  to={s.path}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold hover:text-brand-navy"
                >
                  {t('servicesPage.viewDetails')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
