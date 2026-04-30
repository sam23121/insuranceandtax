import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAdminAppointments } from '@/lib/api'
import { useI18n } from '@/i18n/context'
import { serviceTitle } from '@/i18n/dictionary'
import { useServiceNavItems } from '@/hooks/useServiceNavItems'
import type { ServiceSlug } from '@/types'
import { AppointmentDetailModal } from '@/components/admin/AppointmentDetailModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

function statusVariant(s: string): 'upcoming' | 'completed' | 'cancelled' {
  if (s === 'completed') return 'completed'
  if (s === 'cancelled') return 'cancelled'
  return 'upcoming'
}

function statusLabel(status: string, t: (path: string) => string) {
  if (status === 'completed') return t('admin.statusCompleted')
  if (status === 'cancelled') return t('admin.statusCancelled')
  return t('admin.statusUpcoming')
}

export function AppointmentsTable() {
  const { locale, t } = useI18n()
  const services = useServiceNavItems()
  const [searchParams, setSearchParams] = useSearchParams()
  const [service, setService] = useState<ServiceSlug | ''>('')
  const [status, setStatus] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const queryParams = useMemo(
    () => ({
      service: service || undefined,
      status: status || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      search: search || undefined,
      page,
      per_page: 20,
    }),
    [service, status, dateFrom, dateTo, search, page],
  )

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'appointments', queryParams],
    queryFn: () => fetchAdminAppointments(queryParams),
  })

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) return
    setDetailId(id)
    setModalOpen(true)
    const next = new URLSearchParams(searchParams)
    next.delete('id')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const exportCsv = () => {
    if (!data?.appointments.length) return
    const rows = [
      ['Date', 'Time', 'Name', 'Email', 'Phone', 'Service', 'Notes', 'Status'].join(','),
      ...data.appointments.map((a) =>
        [
          a.date,
          a.time,
          `"${a.first_name} ${a.last_name}"`,
          `"${a.email}"`,
          a.phone,
          a.service,
          `"${(a.notes ?? '').replace(/"/g, '""')}"`,
          a.status,
        ].join(','),
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'appointments.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 border-b border-brand-navy/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle>{t('admin.appointmentsTitle')}</CardTitle>
          <p className="mt-1 text-sm text-ink/60">{t('admin.appointmentsSub')}</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={exportCsv}>
          {t('admin.exportCsv')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-ink/60">{t('admin.filterService')}</label>
            <select
              className="mt-1 flex h-11 w-full rounded-xl border border-brand-navy/15 bg-white px-3 text-sm"
              value={service}
              onChange={(e) => {
                setService(e.target.value as ServiceSlug | '')
                setPage(1)
              }}
            >
              <option value="">{t('admin.all')}</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">{t('admin.filterStatus')}</label>
            <select
              className="mt-1 flex h-11 w-full rounded-xl border border-brand-navy/15 bg-white px-3 text-sm"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            >
              <option value="">{t('admin.all')}</option>
              <option value="upcoming">{t('admin.statusUpcoming')}</option>
              <option value="completed">{t('admin.statusCompleted')}</option>
              <option value="cancelled">{t('admin.statusCancelled')}</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">{t('admin.filterFrom')}</label>
            <Input
              type="date"
              className="mt-1"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">{t('admin.filterTo')}</label>
            <Input
              type="date"
              className="mt-1"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink/60">{t('admin.searchLabel')}</label>
          <Input
            className="mt-1 max-w-md"
            placeholder={t('admin.searchPh')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {isError && (
          <div
            className="flex flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-rose-800">{(error as Error).message}</p>
            <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
              {t('admin.retry')}
            </Button>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-brand-navy/10">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-brand-cream/60 font-medium text-brand-navy">
              <tr>
                <th className="px-4 py-3">{t('admin.tableDate')}</th>
                <th className="px-4 py-3">{t('admin.tableTime')}</th>
                <th className="px-4 py-3">{t('admin.tableClient')}</th>
                <th className="px-4 py-3">{t('admin.tableEmail')}</th>
                <th className="px-4 py-3">{t('admin.tablePhone')}</th>
                <th className="px-4 py-3">{t('admin.tableService')}</th>
                <th className="px-4 py-3">{t('admin.tableStatus')}</th>
                <th className="px-4 py-3">{t('admin.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-3">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))}
              {!isLoading && data?.appointments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink/60">
                    {t('admin.noRows')}
                  </td>
                </tr>
              )}
              {data?.appointments.map((a) => (
                <tr key={a.id} className="border-t border-brand-navy/10 hover:bg-brand-cream/30">
                  <td className="px-4 py-3">{a.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.time}</td>
                  <td className="px-4 py-3">
                    {a.first_name} {a.last_name}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">{serviceTitle(locale, a.service as ServiceSlug)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(a.status)}>{statusLabel(a.status, t)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDetailId(a.id)
                        setModalOpen(true)
                      }}
                    >
                      {t('admin.view')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.total > data.per_page && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-ink/60">
              {t('admin.pageOf')} {data.page} {t('admin.of')} {totalPages} ({data.total} {t('admin.total')})
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                {t('admin.prev')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('admin.nextPage')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <AppointmentDetailModal appointmentId={detailId} open={modalOpen} onOpenChange={setModalOpen} />
    </Card>
  )
}
