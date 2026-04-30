import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-6xl font-semibold text-brand-navy/20">{t('admin.notFound404')}</p>
      <h1 className="mt-4 font-heading text-2xl text-brand-navy">{t('admin.notFoundTitle')}</h1>
      <p className="mt-2 max-w-md text-ink/70">{t('admin.notFoundSub')}</p>
      <Button asChild className="mt-8">
        <Link to="/">{t('admin.goHome')}</Link>
      </Button>
    </div>
  )
}
