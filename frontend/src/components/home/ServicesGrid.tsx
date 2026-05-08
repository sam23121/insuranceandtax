import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'
import { Card, CardContent } from '@/components/ui/card'

export function ServicesGrid() {
  const { t } = useI18n()
  const services = useServiceNavItems()

  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            {t('home.servicesGrid.heading')}
          </h2>
          <p className="mt-3 text-ink/70">{t('home.servicesGrid.sub')}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.slug}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center opacity-25 transition-opacity duration-300 group-hover:opacity-35"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-white/92 via-white/88 to-brand-cream/82"
                />
                <CardContent className="relative flex flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream text-brand-navy shadow-sm ring-1 ring-brand-navy/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-brand-navy">{service.title}</h3>
                    <p className="mt-2 text-sm text-ink/70">{service.shortDescription}</p>
                  </div>
                  <Link
                    to={service.path}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold hover:text-brand-navy"
                  >
                    {t('home.servicesGrid.learnMore')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
