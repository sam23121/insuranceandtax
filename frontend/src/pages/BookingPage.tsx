import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { startOfMonth } from 'date-fns'
import { toast } from 'sonner'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { BookingForm, type BookingFormValues } from '@/components/booking/BookingForm'
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/i18n/context'
import { useAvailabilityDates, useAvailabilitySlots } from '@/hooks/useAvailability'
import { useCreateAppointment } from '@/hooks/useBooking'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'
import { serviceSlugFromQueryParam } from '@/lib/constants'
import { isAxiosError } from '@/lib/api'
import type { ServiceSlug } from '@/types'

export function BookingPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [service, setService] = useState<ServiceSlug | null>(null)
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const steps = useMemo(
    () => [t('booking.steps.service'), t('booking.steps.datetime'), t('booking.steps.details')],
    [t],
  )
  const services = useServiceNavItems()

  const year = cursor.getFullYear()
  const month = cursor.getMonth() + 1

  const datesQuery = useAvailabilityDates(year, month)
  const { data: datesData, isLoading: datesLoading, isError: datesError, refetch: refetchDates } = datesQuery
  const availableSet = useMemo(
    () => new Set(datesData?.available_dates ?? []),
    [datesData?.available_dates],
  )

  const slotsQuery = useAvailabilitySlots(selectedDate)
  const { data: slotsData, isLoading: slotsLoading, isError: slotsError, refetch: refetchSlots } = slotsQuery

  const datesErrorToast = useRef(false)
  useEffect(() => {
    if (datesError && !datesErrorToast.current) {
      datesErrorToast.current = true
      toast.error(t('booking.datesLoadErrorToast'))
    }
    if (!datesError) {
      datesErrorToast.current = false
    }
  }, [datesError, t])

  useEffect(() => {
    const qp = searchParams.get('service')
    const slug = serviceSlugFromQueryParam(qp)
    if (slug) {
      setService(slug)
    }
  }, [searchParams])

  const createBooking = useCreateAppointment()

  const goNext = () => setStep((s) => Math.min(3, s + 1))
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const onSubmitForm = async (values: BookingFormValues) => {
    if (!service || !selectedSlotId) return
    setFormError(null)
    try {
      const appt = await createBooking.mutateAsync({
        slot_id: selectedSlotId,
        service,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone.replace(/\D/g, ''),
        notes: values.notes || undefined,
      })
      toast.success(t('booking.bookSuccessToast'))
      void navigate(`/booking/success?id=${encodeURIComponent(appt.id)}`, {
        replace: true,
        state: { appointment: appt },
      })
    } catch (e) {
      if (isAxiosError(e)) {
        const d = e.response?.data as { detail?: string } | undefined
        if (typeof d?.detail === 'string') {
          setFormError(d.detail)
        } else if (!e.response && (e.code === 'ERR_NETWORK' || e.message === 'Network Error')) {
          setFormError(t('booking.formErrorNetwork'))
        } else {
          setFormError(e.message || t('booking.formErrorGeneric'))
        }
      } else {
        setFormError(t('booking.formErrorGeneric'))
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">{t('booking.pageTitle')}</h1>
      <p className="mt-2 text-ink/70">{t('booking.pageSub')}</p>

      <ol className="mt-8 flex flex-wrap gap-2 text-sm">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${
              i + 1 === step ? 'bg-brand-gold font-semibold text-brand-navy' : 'bg-brand-cream text-ink/60'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {step === 1 && t('booking.step1Title')}
            {step === 2 && t('booking.step2Title')}
            {step === 3 && t('booking.step3Title')}
          </CardTitle>
          <CardDescription>
            {step === 1 && t('booking.step1Sub')}
            {step === 2 && t('booking.step2Sub')}
            {step === 3 && t('booking.step3Sub')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const Icon = s.icon
                  const active = service === s.slug
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setService(s.slug)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        active ? 'border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/40' : 'border-brand-navy/10 hover:border-brand-gold/50'
                      }`}
                    >
                      <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-navy" />
                      <span>
                        <span className="font-semibold text-brand-navy">{s.title}</span>
                        <span className="mt-1 block text-sm text-ink/70">{s.shortDescription}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" disabled={!service} onClick={goNext}>
                  {t('booking.next')}
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {datesError && (
                <div
                  className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="font-medium">{t('booking.calendarUnavailable')}</p>
                  <p className="mt-1 text-rose-800/90">{t('booking.calendarUnavailableSub')}</p>
                  <Button type="button" variant="secondary" className="mt-3" onClick={() => void refetchDates()}>
                    {t('booking.retry')}
                  </Button>
                </div>
              )}
              <div className="grid gap-8 lg:grid-cols-2">
                <BookingCalendar
                  cursor={cursor}
                  onCursorChange={(d) => {
                    setCursor(d)
                    setSelectedDate(null)
                    setSelectedSlotId(null)
                  }}
                  availableDates={availableSet}
                  selectedDate={selectedDate}
                  onSelectDate={(iso) => {
                    setSelectedDate(iso)
                    setSelectedSlotId(null)
                  }}
                  isLoading={datesLoading}
                />
                <div>
                  <p className="text-sm font-medium text-brand-navy">{t('booking.timesHeading')}</p>
                  {slotsError && selectedDate && (
                    <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900" role="alert">
                      {t('booking.slotsLoadError')}{' '}
                      <button
                        type="button"
                        className="font-semibold text-brand-navy underline"
                        onClick={() => void refetchSlots()}
                      >
                        {t('booking.slotsRetry')}
                      </button>
                    </div>
                  )}
                  <div className="mt-3">
                    <TimeSlotPicker
                      slots={slotsData?.slots}
                      selectedId={selectedSlotId}
                      onSelect={setSelectedSlotId}
                      isLoading={slotsLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button type="button" variant="secondary" onClick={goBack}>
                  {t('booking.back')}
                </Button>
                <Button type="button" disabled={!selectedDate || !selectedSlotId} onClick={goNext}>
                  {t('booking.next')}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {formError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                  {formError}
                </p>
              )}
              <BookingForm onSubmit={onSubmitForm} isSubmitting={createBooking.isPending} />
              <Button type="button" variant="ghost" onClick={goBack}>
                {t('booking.back')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
