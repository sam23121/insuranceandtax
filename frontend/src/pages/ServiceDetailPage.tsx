import { Link } from 'react-router-dom'
import type { ServiceSlug } from '@/types'
import { getServicePage } from '@/i18n/dictionary'
import { useI18n } from '@/i18n/context'
import { useServiceNavItem } from '@/hooks/useServiceNavItems'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

interface ServiceDetailPageProps {
  slug: ServiceSlug
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const { locale, t } = useI18n()
  const content = getServicePage(locale, slug)
  const nav = useServiceNavItem(slug)

  return (
    <div>
      <section
        className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-28"
        aria-labelledby="service-hero-title"
      >
        {nav?.image && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${nav.image})` }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand-navy/55 via-brand-navy/45 to-brand-navy/65"
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(circle at 20% 50%, rgba(212,160,23,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(248,246,241,0.15) 0%, transparent 40%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-gold">
            {t('serviceDetail.sectionServices')}
          </p>
          <h1 id="service-hero-title" className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-cream/90">{content.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {content.disclaimer && (
          <div
            className="mb-10 rounded-xl border-2 border-brand-gold/60 bg-amber-50 p-5 text-sm text-ink"
            role="note"
          >
            <p className="font-semibold text-brand-navy">{t('serviceDetail.important')}</p>
            <p className="mt-2 leading-relaxed">{content.disclaimer}</p>
          </div>
        )}
        <h2 className="font-heading text-2xl font-semibold text-brand-navy">{t('serviceDetail.overview')}</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          {content.overview.map((p) => (
            <p key={p.slice(0, 40)} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <h2 className="mt-12 font-heading text-2xl font-semibold text-brand-navy">{t('serviceDetail.included')}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-ink/80">
          {content.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-semibold text-brand-navy">{t('serviceDetail.audience')}</h2>
        <p className="mt-4 leading-relaxed text-ink/80">{content.audience}</p>

        <h2 className="mt-12 font-heading text-2xl font-semibold text-brand-navy">{t('serviceDetail.faq')}</h2>
        <Accordion type="single" collapsible className="mt-6 w-full">
          {content.faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-14 rounded-xl bg-brand-cream p-8 text-center">
          <p className="font-heading text-xl font-semibold text-brand-navy">{t('serviceDetail.ctaTitle')}</p>
          <p className="mt-2 text-sm text-ink/70">{t('serviceDetail.ctaSub')}</p>
          <Button asChild className="mt-6">
            <Link to={`/booking?service=${nav?.slug ?? slug}`}>{t('serviceDetail.ctaButton')}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
