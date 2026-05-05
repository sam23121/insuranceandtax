import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import {
  deleteAdminSlot,
  fetchAdminAvailability,
  isAxiosError,
  postAdminAvailability,
  postAdminAvailabilityBulk,
} from '@/lib/api'
import type { AdminSlot } from '@/types'
import { useI18n } from '@/i18n/context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function groupByDate(slots: AdminSlot[]): Map<string, AdminSlot[]> {
  const m = new Map<string, AdminSlot[]>()
  for (const s of slots) {
    const list = m.get(s.date) ?? []
    list.push(s)
    m.set(s.date, list)
  }
  for (const list of m.values()) {
    list.sort((a, b) => a.time.localeCompare(b.time))
  }
  return m
}

/** HH:mm times from start through end inclusive, stepping by interval (matches backend iter_time_strings). */
function expandTimeRange(start: string, end: string, intervalMinutes: number): string[] {
  if (!Number.isFinite(intervalMinutes) || intervalMinutes < 5) return []

  const toMinutes = (s: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim())
    if (!m) return NaN
    const h = Number(m[1])
    const mi = Number(m[2])
    if (h > 23 || mi > 59) return NaN
    return h * 60 + mi
  }

  const a = toMinutes(start)
  const b = toMinutes(end)
  if (Number.isNaN(a) || Number.isNaN(b) || a > b) return []

  const pad = (n: number) => String(n).padStart(2, '0')
  const out: string[] = []
  for (let cur = a; cur <= b; cur += intervalMinutes) {
    const hh = Math.floor(cur / 60)
    const mm = cur % 60
    if (hh > 23) break
    out.push(`${pad(hh)}:${pad(mm)}`)
  }
  return out
}

export function AvailabilityManager() {
  const { t } = useI18n()
  const qc = useQueryClient()
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [editorDate, setEditorDate] = useState<string | null>(null)
  const [newTime, setNewTime] = useState('09:00')
  const [dayRangeStart, setDayRangeStart] = useState('09:00')
  const [dayRangeEnd, setDayRangeEnd] = useState('17:00')
  const [dayRangeInterval, setDayRangeInterval] = useState(30)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkStart, setBulkStart] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [bulkEnd, setBulkEnd] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
  const [bulkWeekdays, setBulkWeekdays] = useState<number[]>([1, 2, 3, 4, 5])
  const [bulkStartTime, setBulkStartTime] = useState('09:00')
  const [bulkEndTime, setBulkEndTime] = useState('17:00')
  const [bulkInterval, setBulkInterval] = useState(30)

  const weekdayRow = useMemo(() => [0, 1, 2, 3, 4, 5, 6].map((i) => t(`booking.weekday${i}`)), [t])

  const bulkDayButtons = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 0].map((n) => ({
        n,
        l: t(`booking.weekday${n}`),
      })),
    [t],
  )

  const rangeFrom = format(startOfMonth(cursor), 'yyyy-MM-dd')
  const rangeTo = format(endOfMonth(cursor), 'yyyy-MM-dd')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'availability', rangeFrom, rangeTo],
    queryFn: () => fetchAdminAvailability(rangeFrom, rangeTo),
  })

  const availErrToast = useRef(false)
  useEffect(() => {
    if (isError && !availErrToast.current) {
      availErrToast.current = true
      toast.error(t('admin.availLoadError'))
    }
    if (!isError) {
      availErrToast.current = false
    }
  }, [isError, t])

  const byDate = useMemo(() => groupByDate(data?.slots ?? []), [data?.slots])

  const toastApiErr = (e: unknown, fallback: string) => {
    if (isAxiosError(e)) {
      const d = e.response?.data as { detail?: string } | undefined
      toast.error(typeof d?.detail === 'string' ? d.detail : e.message)
    } else {
      toast.error(fallback)
    }
  }

  const removeSlot = useMutation({
    mutationFn: deleteAdminSlot,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'availability'] })
      void qc.invalidateQueries({ queryKey: ['availability'] })
    },
    onError: (e) => toastApiErr(e, t('admin.availRemoveErr')),
  })

  const addSlots = useMutation({
    mutationFn: ({ date, times }: { date: string; times: string[] }) => postAdminAvailability(date, times),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'availability'] })
      void qc.invalidateQueries({ queryKey: ['availability'] })
    },
    onError: (e) => toastApiErr(e, t('admin.availAddErr')),
  })

  const bulkCreate = useMutation({
    mutationFn: postAdminAvailabilityBulk,
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ['admin', 'availability'] })
      void qc.invalidateQueries({ queryKey: ['availability'] })
      setBulkOpen(false)
      toast.success(`${t('admin.availCreated')} ${res.count ?? 0} ${t('admin.availSlotsWord')}`)
    },
    onError: (e) => toastApiErr(e, t('admin.availBulkErr')),
  })

  const monthStart = startOfMonth(cursor)
  const monthEnd = endOfMonth(cursor)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const editorSlots = editorDate ? (byDate.get(editorDate) ?? []) : []

  const copyMondayToWeekdays = () => {
    const mondayInMonth = days.find((d) => isSameMonth(d, cursor) && getDay(d) === 1)
    if (!mondayInMonth) return
    const key = format(mondayInMonth, 'yyyy-MM-dd')
    const monSlots = byDate.get(key) ?? []
    const times = monSlots.filter((s) => !s.is_booked).map((s) => s.time)
    if (!times.length) return
    for (const d of days) {
      if (!isSameMonth(d, cursor)) continue
      const wd = getDay(d)
      if (wd >= 2 && wd <= 5) {
        const dk = format(d, 'yyyy-MM-dd')
        addSlots.mutate({ date: dk, times })
      }
    }
  }

  const clearDate = () => {
    if (!editorDate) return
    const slots = byDate.get(editorDate) ?? []
    for (const s of slots) {
      if (!s.is_booked) {
        removeSlot.mutate(s.id)
      }
    }
    setEditorDate(null)
  }

  const toggleWeekday = (n: number) => {
    setBulkWeekdays((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort()))
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.availMonthlyTitle')}</CardTitle>
          <p className="text-sm text-ink/60">{t('admin.availMonthlySub')}</p>
        </CardHeader>
        <CardContent>
          {isError && (
            <div
              className="mb-4 flex flex-col gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-rose-800">
                {error instanceof Error ? error.message : t('admin.requestFailed')}
              </p>
              <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
                {t('admin.retry')}
              </Button>
            </div>
          )}
          <div className="mb-4 flex justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, -1))}>
              {t('admin.availPrevMonth')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
              {t('admin.availNextMonth')}
            </Button>
          </div>
          {isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink/50">
                {weekdayRow.map((d, idx) => (
                  <div key={idx}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, 'yyyy-MM-dd')
                  const inMonth = isSameMonth(day, cursor)
                  const count = (byDate.get(key) ?? []).filter((s) => !s.is_booked).length
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!inMonth}
                      onClick={() => inMonth && setEditorDate(key)}
                      className={`flex min-h-[4rem] flex-col rounded-lg border p-1 text-left text-xs transition-colors ${
                        inMonth
                          ? 'border-brand-navy/15 bg-white hover:border-brand-gold/50'
                          : 'border-transparent text-ink/20'
                      }`}
                    >
                      <span className="font-medium">{format(day, 'd')}</span>
                      {inMonth && count > 0 && (
                        <span className="mt-1 text-[10px] text-brand-gold">
                          {count} {t('admin.availOpenLower')}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={copyMondayToWeekdays}>
              {t('admin.availCopyMonday')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setBulkOpen(true)}>
              {t('admin.availRecurringBtn')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editorDate} onOpenChange={(o) => !o && setEditorDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('admin.availSlotsFor')} {editorDate}
            </DialogTitle>
            <DialogDescription>{t('admin.availDialogSlotsSub')}</DialogDescription>
          </DialogHeader>
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {editorSlots.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-brand-navy/10 px-3 py-2 text-sm"
              >
                <span className="font-mono">{s.time}</span>
                <span className="text-xs text-ink/50">{s.is_booked ? t('admin.availBooked') : t('admin.availOpen')}</span>
                {!s.is_booked && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-600"
                    disabled={removeSlot.isPending}
                    onClick={() => removeSlot.mutate(s.id)}
                  >
                    {t('admin.availRemove')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-ink/70">{t('admin.availAddOneSlot')}</p>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <Label htmlFor="new_time">{t('admin.availAddTimeLabel')}</Label>
                  <Input
                    id="new_time"
                    className="mt-1 w-32 font-mono"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  disabled={!editorDate || addSlots.isPending}
                  onClick={() => editorDate && addSlots.mutate({ date: editorDate, times: [newTime] })}
                >
                  {t('admin.availAddSlot')}
                </Button>
              </div>
            </div>
            <div className="border-t border-brand-navy/10 pt-4">
              <p className="mb-2 text-xs font-medium text-ink/70">{t('admin.availAddRangeSection')}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="col-span-1">
                  <Label htmlFor="day_range_from">{t('admin.availFrom')}</Label>
                  <Input
                    id="day_range_from"
                    className="mt-1 font-mono"
                    value={dayRangeStart}
                    onChange={(e) => setDayRangeStart(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="day_range_to">{t('admin.availTo')}</Label>
                  <Input
                    id="day_range_to"
                    className="mt-1 font-mono"
                    value={dayRangeEnd}
                    onChange={(e) => setDayRangeEnd(e.target.value)}
                  />
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <Label htmlFor="day_range_interval">{t('admin.availInterval')}</Label>
                  <Input
                    id="day_range_interval"
                    type="number"
                    min={5}
                    className="mt-1"
                    value={dayRangeInterval}
                    onChange={(e) => setDayRangeInterval(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button
                type="button"
                className="mt-3"
                disabled={!editorDate || addSlots.isPending}
                onClick={() => {
                  if (!editorDate) return
                  const times = expandTimeRange(dayRangeStart, dayRangeEnd, dayRangeInterval)
                  if (times.length === 0) {
                    toast.error(t('admin.availInvalidRange'))
                    return
                  }
                  addSlots.mutate({ date: editorDate, times })
                }}
              >
                {t('admin.availAddRangeBtn')}
              </Button>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button type="button" variant="outline" className="border-rose-200 text-rose-700" onClick={clearDate}>
              {t('admin.availClearDay')}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditorDate(null)}>
              {t('admin.availDone')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.availBulkTitle')}</DialogTitle>
            <DialogDescription>{t('admin.availBulkSub')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>{t('admin.availStartDate')}</Label>
                <Input type="date" value={bulkStart} onChange={(e) => setBulkStart(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t('admin.availEndDate')}</Label>
                <Input type="date" value={bulkEnd} onChange={(e) => setBulkEnd(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{t('admin.availWeekdaysLabel')}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {bulkDayButtons.map(({ n, l }) => (
                  <Button
                    key={n}
                    type="button"
                    size="sm"
                    variant={bulkWeekdays.includes(n) ? 'default' : 'outline'}
                    onClick={() => toggleWeekday(n)}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>{t('admin.availFrom')}</Label>
                <Input className="mt-1 font-mono" value={bulkStartTime} onChange={(e) => setBulkStartTime(e.target.value)} />
              </div>
              <div>
                <Label>{t('admin.availTo')}</Label>
                <Input className="mt-1 font-mono" value={bulkEndTime} onChange={(e) => setBulkEndTime(e.target.value)} />
              </div>
              <div>
                <Label>{t('admin.availInterval')}</Label>
                <Input
                  type="number"
                  min={5}
                  className="mt-1"
                  value={bulkInterval}
                  onChange={(e) => setBulkInterval(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={bulkCreate.isPending || bulkWeekdays.length === 0}
              onClick={() =>
                bulkCreate.mutate({
                  start_date: bulkStart,
                  end_date: bulkEnd,
                  weekdays: bulkWeekdays,
                  start_time: bulkStartTime,
                  end_time: bulkEndTime,
                  interval_minutes: bulkInterval,
                })
              }
            >
              {t('admin.availGenerate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
