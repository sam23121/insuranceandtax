import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Locale } from '@/i18n/dictionary'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-brand-gold',
    isActive ? 'text-brand-gold' : 'text-brand-navy/80',
  )

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, locale, setLocale } = useI18n()
  const services = useServiceNavItems()
  const brandShort = t('business.name').split(' ').slice(0, 2).join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="font-heading text-lg font-semibold text-brand-navy sm:text-xl">{brandShort}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            {t('nav.home')}
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-brand-navy/80 outline-none hover:text-brand-gold data-[state=open]:text-brand-gold">
              {t('nav.services')}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[14rem]">
              <DropdownMenuItem asChild>
                <Link to="/services" className="cursor-pointer font-medium">
                  {t('nav.servicesAll')}
                </Link>
              </DropdownMenuItem>
              {services.map((s) => (
                <DropdownMenuItem key={s.slug} asChild>
                  <Link to={s.path} className="cursor-pointer">
                    {s.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <NavLink to="/booking" className={navLinkClass}>
            {t('nav.book')}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t('nav.contact')}
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-brand-navy/80 outline-none hover:text-brand-gold data-[state=open]:text-brand-gold">
              {t('nav.language')}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuRadioGroup value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                <DropdownMenuRadioItem value="en">{t('nav.english')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="am">{t('nav.amharic')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild size="sm">
            <Link to="/booking">{t('nav.book')}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label={t('nav.openMenu')}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)]">
            <SheetHeader>
              <SheetTitle className="text-left">{t('nav.menu')}</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              <Link
                to="/"
                className="text-lg font-medium text-brand-navy"
                onClick={() => setOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{t('nav.services')}</p>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={s.path}
                  className="text-brand-navy/90"
                  onClick={() => setOpen(false)}
                >
                  {s.title}
                </Link>
              ))}
              <Link to="/services" className="text-sm text-brand-gold" onClick={() => setOpen(false)}>
                {t('nav.viewAllServices')}
              </Link>
              <Link to="/booking" className="text-lg font-medium text-brand-navy" onClick={() => setOpen(false)}>
                {t('nav.book')}
              </Link>
              <Link to="/contact" className="text-lg font-medium text-brand-navy" onClick={() => setOpen(false)}>
                {t('nav.contact')}
              </Link>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{t('nav.language')}</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={locale === 'en' ? 'default' : 'secondary'}
                  onClick={() => setLocale('en')}
                >
                  {t('nav.english')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={locale === 'am' ? 'default' : 'secondary'}
                  onClick={() => setLocale('am')}
                >
                  {t('nav.amharic')}
                </Button>
              </div>
              <Button asChild className="mt-4">
                <Link to="/booking" onClick={() => setOpen(false)}>
                  {t('nav.bookNow')}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
