import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'

export function CTASection() {
  const { t } = useI18n()
  return (
    <section className="bg-brand-navy py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">{t('home.cta.title')}</h2>
        <p className="mt-4 text-lg text-brand-cream/90">{t('home.cta.sub')}</p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/booking">{t('home.cta.button')}</Link>
        </Button>
      </div>
    </section>
  )
}
