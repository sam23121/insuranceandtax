import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useI18n } from '@/i18n/context'

export function AdminLayout() {
  const { t } = useI18n()
  useEffect(() => {
    document.title = `${t('admin.adminHeader')} — ${t('meta.htmlTitle')}`
  }, [t])

  return (
    <div className="flex min-h-screen bg-surface font-body">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <div className="flex-1 p-4 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
