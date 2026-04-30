import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'
import type { Appointment } from '@/types'

interface LocationState {
  appointment?: Appointment
}

export function BookingSuccessPage() {
  const { t } = useI18n()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = location.state as LocationState | null
  const id = searchParams.get('id')
  const appointment = state?.appointment

  if (appointment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <BookingConfirmation appointment={appointment} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <h1 className="font-heading text-2xl font-semibold text-brand-navy">{t('bookingSuccess.titleReceived')}</h1>
      <p className="mt-4 text-ink/70">
        {id
          ? `${t('bookingSuccess.staleWithIdPrefix')} ${id}. ${t('bookingSuccess.staleWithIdSuffix')}`
          : t('bookingSuccess.stale')}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">{t('bookingSuccess.backHome')}</Link>
      </Button>
    </div>
  )
}
