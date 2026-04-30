import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/context'

interface BookingCalendarProps {
  cursor: Date
  onCursorChange: (d: Date) => void
  availableDates: Set<string>
  selectedDate: string | null
  onSelectDate: (isoDate: string) => void
  isLoading?: boolean
}

export function BookingCalendar({
  cursor,
  onCursorChange,
  availableDates,
  selectedDate,
  onSelectDate,
  isLoading,
}: BookingCalendarProps) {
  const { t } = useI18n()
  const weekdayLabels = [
    t('booking.weekday0'),
    t('booking.weekday1'),
    t('booking.weekday2'),
    t('booking.weekday3'),
    t('booking.weekday4'),
    t('booking.weekday5'),
    t('booking.weekday6'),
  ]
  const monthStart = startOfMonth(cursor)
  const monthEnd = endOfMonth(cursor)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const today = startOfToday()

  return (
    <div className="rounded-xl border border-brand-navy/10 bg-white p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onCursorChange(addMonths(cursor, -1))}
          aria-label={t('booking.calendarPrevMonth')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="font-heading text-lg font-semibold text-brand-navy">{format(cursor, 'MMMM yyyy')}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onCursorChange(addMonths(cursor, 1))}
          aria-label={t('booking.calendarNextMonth')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-ink/50">
            {weekdayLabels.map((d, idx) => (
              <div key={idx}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const iso = format(day, 'yyyy-MM-dd')
              const inMonth = isSameMonth(day, cursor)
              const isPast = isBefore(startOfDay(day), today)
              const hasAvailability = availableDates.has(iso)
              const selectable = inMonth && !isPast && hasAvailability
              const isSelected = selectedDate === iso

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!selectable}
                  onClick={() => onSelectDate(iso)}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-lg text-sm transition-colors',
                    !inMonth && 'text-ink/25',
                    inMonth && !selectable && 'cursor-not-allowed text-ink/30',
                    selectable && !isSelected && 'bg-brand-cream/80 text-brand-navy hover:bg-brand-gold/30',
                    selectable && isSelected && 'bg-brand-gold font-semibold text-brand-navy shadow-sm',
                    inMonth && !isPast && hasAvailability && !isSelected && 'ring-1 ring-brand-gold/40',
                  )}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-ink/60">{t('booking.calendarHint')}</p>
        </>
      )}
    </div>
  )
}
