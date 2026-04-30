import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CalendarClock, CalendarDays, LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  const { t } = useI18n()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/admin/dashboard', label: t('admin.dashboardTitle'), icon: LayoutDashboard },
    { to: '/admin/appointments', label: t('admin.appointmentsTitle'), icon: CalendarDays },
    { to: '/admin/availability', label: t('admin.availabilityTitle'), icon: CalendarClock },
  ]

  const handleLogout = () => {
    logout()
    void navigate('/admin/login')
  }

  function NavItems({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-gold/20 text-brand-navy' : 'text-brand-navy/80 hover:bg-brand-cream',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-brand-navy/10 bg-white lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex">
        <div className="flex h-16 items-center border-b border-brand-navy/10 px-6">
          <Link to="/admin/dashboard" className="font-heading text-lg font-semibold text-brand-navy">
            {t('admin.sidebarBrand')}
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <NavItems />
        </div>
        <div className="border-t border-brand-navy/10 p-4">
          <Button variant="ghost" className="w-full justify-start gap-2 text-rose-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {t('admin.logout')}
          </Button>
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-brand-navy/10 bg-white px-4 py-3 lg:hidden">
        <span className="font-heading font-semibold text-brand-navy">{t('admin.adminHeader')}</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t('admin.openAdminMenu')}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">{t('admin.sidebarBrand')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <NavItems onNavigate={() => setOpen(false)} />
            </div>
            <Button variant="ghost" className="mt-8 w-full justify-start text-rose-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {t('admin.logout')}
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
