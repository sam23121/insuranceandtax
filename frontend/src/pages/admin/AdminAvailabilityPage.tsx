import { AvailabilityManager } from '@/components/admin/AvailabilityManager'
import { useI18n } from '@/i18n/context'

export function AdminAvailabilityPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-navy">{t('admin.availabilityTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('admin.availabilitySub')}</p>
      </div>
      <AvailabilityManager />
    </div>
  )
}
