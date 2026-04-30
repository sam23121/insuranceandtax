import { useQuery } from '@tanstack/react-query'
import { fetchAvailableDates, fetchSlotsForDate } from '@/lib/api'

export function useAvailabilityDates(year: number, month: number) {
  return useQuery({
    queryKey: ['availability', 'dates', year, month],
    queryFn: () => fetchAvailableDates(year, month),
  })
}

export function useAvailabilitySlots(date: string | null) {
  return useQuery({
    queryKey: ['availability', 'slots', date],
    queryFn: () => fetchSlotsForDate(date!),
    enabled: Boolean(date),
  })
}
