import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/i18n/context'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'

export function Footer() {
  const { t } = useI18n()
  const services = useServiceNavItems()

  return (
    <footer className="border-t border-brand-navy/10 bg-brand-navy text-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-heading text-2xl font-semibold text-white">{t('business.name')}</p>
            <p className="mt-2 max-w-md text-sm text-brand-cream/80">{t('business.tagline')}</p>
            <div className="mt-6 space-y-1 text-sm text-brand-cream/90">
              <p>Business Address: {siteConfig.addressEn}</p>
                <p>
                  Office Phone: <a href={`tel:${siteConfig.officePhone.replace(/\D/g, '')}`} className="hover:text-brand-gold">
                    {siteConfig.officePhone}
                  </a>
                </p>
                <p>
                  Mobile Phone: <a href={`tel:${siteConfig.mobilePhone.replace(/\D/g, '')}`} className="hover:text-brand-gold">
                    {siteConfig.mobilePhone}
                  </a>
                </p>
                <p>
                  Fax Phone: <a href={`tel:${siteConfig.faxPhone.replace(/\D/g, '')}`} className="hover:text-brand-gold">
                    {siteConfig.faxPhone}
                  </a>
                </p>
              <p>
                Email: <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-gold">
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
              {t('footer.servicesHeading')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={s.path} className="text-brand-cream/85 hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
              {t('footer.taglineLabel')}
            </p>
            <div className="mt-4 flex gap-3">
              {siteConfig.social.map(({ name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-brand-cream/30 px-3 py-2 text-xs hover:border-brand-gold hover:text-brand-gold"
                  aria-label={name}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-brand-cream/60">
          © {new Date().getFullYear()} {t('business.name')}. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
