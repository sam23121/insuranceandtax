import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'

export function HeroSection() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(105deg, rgba(27,43,91,0.92) 0%, rgba(27,43,91,0.75) 45%, rgba(27,43,91,0.55) 100%), url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-6 text-lg text-brand-cream/90 sm:text-xl">{t('home.hero.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="shadow-lg">
            <Link to="/booking">{t('home.hero.ctaBook')}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="bg-white/95 text-brand-navy hover:bg-white">
            <Link to="/services">{t('home.hero.ctaServices')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
