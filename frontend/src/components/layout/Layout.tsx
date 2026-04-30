import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { useI18n } from '@/i18n/context'

export function Layout() {
  const { t } = useI18n()
  useEffect(() => {
    document.title = t('meta.htmlTitle')
  }, [t])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
