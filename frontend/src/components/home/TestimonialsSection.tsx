import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/i18n/context'
import { getTestimonials } from '@/i18n/dictionary'

export function TestimonialsSection() {
  const { locale, t } = useI18n()
  const testimonials = getTestimonials(locale)

  return (
    <section className="bg-brand-cream/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
          {t('home.testimonials.heading')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">{t('home.testimonials.sub')}</p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/80">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-brand-navy">— {item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
