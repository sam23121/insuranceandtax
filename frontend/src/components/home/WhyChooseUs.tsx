import { Clock, Globe2, ShieldCheck, Users } from 'lucide-react'
import { useI18n } from '@/i18n/context'

const icons = [ShieldCheck, Globe2, Clock, Users] as const
const keys = ['pillar1', 'pillar2', 'pillar3', 'pillar4'] as const

export function WhyChooseUs() {
  const { t } = useI18n()

  return (
    <section className="border-y border-brand-navy/10 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
          {t('home.why.heading')}
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = icons[i]
            return (
              <div key={key} className="text-center sm:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-navy sm:mx-0">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-brand-navy">
                  {t(`home.why.${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{t(`home.why.${key}Text`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
