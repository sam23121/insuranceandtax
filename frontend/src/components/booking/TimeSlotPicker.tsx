import { format, parse } from 'date-fns'
import type { TimeSlot } from '@/types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/context'

function formatSlotTime(time: string) {
  try {
    const d = parse(time, 'HH:mm', new Date())
    return format(d, 'h:mm a')
  } catch {
    return time
  }
}

interface TimeSlotPickerProps {
  slots: TimeSlot[] | undefined
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading?: boolean
}

export function TimeSlotPicker({ slots, selectedId, onSelect, isLoading }: TimeSlotPickerProps) {
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11" />
        ))}
      </div>
    )
  }

  if (!slots?.length) {
    return <p className="text-sm text-ink/60">{t('booking.noSlots')}</p>
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {slots.map((slot) => {
        const booked = slot.is_booked
        const selected = selectedId === slot.id
        return (
          <Button
            key={slot.id}
            type="button"
            variant={selected ? 'default' : 'secondary'}
            disabled={booked}
            className={cn(booked && 'cursor-not-allowed opacity-40')}
            onClick={() => onSelect(slot.id)}
          >
            {formatSlotTime(slot.time)}
            {booked ? t('booking.slotTaken') : ''}
          </Button>
        )
      })}
    </div>
  )
}
