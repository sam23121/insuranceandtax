import { Link } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { CheckCircle2 } from 'lucide-react'
import type { Appointment, ServiceSlug } from '@/types'
import { useI18n } from '@/i18n/context'
import { serviceTitle } from '@/i18n/dictionary'
import { Button } from '@/components/ui/button'

function formatTime(time: string) {
  try {
    return format(parse(time, 'HH:mm', new Date()), 'h:mm a')
  } catch {
    return time
  }
}

interface BookingConfirmationProps {
  appointment: Appointment
}

export function BookingConfirmation({ appointment }: BookingConfirmationProps) {
  const { locale, t } = useI18n()
  const svcTitle = serviceTitle(locale, appointment.service as ServiceSlug)
  const isImmigration = appointment.service === 'immigration_forms'

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center shadow-card">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden />
      <h2 className="mt-4 font-heading text-2xl font-semibold text-brand-navy">{t('bookingSuccess.titleBooked')}</h2>
      <p className="mt-2 text-sm text-ink/70">
        {t('bookingSuccess.emailLine')}{' '}
        <span className="font-medium text-ink">{appointment.email}</span>.
      </p>
      {isImmigration && (
        <p className="mt-4 rounded-lg bg-amber-100 p-3 text-left text-xs text-ink">{t('bookingSuccess.immigrationReminder')}</p>
      )}
      <dl className="mt-8 space-y-3 rounded-xl bg-white/80 p-4 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">{t('bookingSuccess.detailService')}</dt>
          <dd className="font-medium text-brand-navy">{svcTitle || appointment.service}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">{t('bookingSuccess.detailDate')}</dt>
          <dd className="font-medium">{appointment.date}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">{t('bookingSuccess.detailTime')}</dt>
          <dd className="font-medium">{formatTime(appointment.time)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">{t('bookingSuccess.detailName')}</dt>
          <dd className="font-medium">
            {appointment.first_name} {appointment.last_name}
          </dd>
        </div>
        {appointment.confirmation_code && (
          <div className="flex justify-between gap-4 border-t border-brand-navy/10 pt-3">
            <dt className="text-ink/60">{t('bookingSuccess.detailConfirmation')}</dt>
            <dd className="font-mono text-xs font-medium">{appointment.confirmation_code}</dd>
          </div>
        )}
      </dl>
      <Button asChild variant="secondary" className="mt-8">
        <Link to="/booking">{t('bookingSuccess.bookAnother')}</Link>
      </Button>
      <div className="mt-4">
        <Link to="/" className="text-sm text-brand-navy underline-offset-4 hover:underline">
          {t('bookingSuccess.home')}
        </Link>
      </div>
    </div>
  )
}
