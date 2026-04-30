import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'
import { fetchDashboardStats } from '@/lib/api'
import { useI18n } from '@/i18n/context'
import { serviceTitle } from '@/i18n/dictionary'
import type { ServiceSlug } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function formatTime(time: string) {
  try {
    return format(parse(time, 'HH:mm', new Date()), 'h:mm a')
  } catch {
    return time
  }
}

function statusLabel(status: string, t: (path: string) => string) {
  if (status === 'completed') return t('admin.statusCompleted')
  if (status === 'cancelled') return t('admin.statusCancelled')
  return t('admin.statusUpcoming')
}

export function AdminDashboardPage() {
  const { locale, t } = useI18n()
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })

  const errToast = useRef(false)
  useEffect(() => {
    if (isError && !errToast.current) {
      errToast.current = true
      toast.error(t('admin.dashboardLoadError'))
    }
    if (!isError) {
      errToast.current = false
    }
  }, [isError, t])

  const topService =
    data?.most_booked_service != null
      ? serviceTitle(locale, data.most_booked_service as ServiceSlug)
      : '—'

  if (isError) {
    return (
      <div className="space-y-4" role="alert" aria-live="polite">
        <h1 className="font-heading text-2xl font-semibold text-brand-navy">{t('admin.dashboardTitle')}</h1>
        <p className="text-rose-700">{error instanceof Error ? error.message : t('admin.requestFailed')}</p>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          {t('admin.tryAgain')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-navy">{t('admin.dashboardTitle')}</h1>
        <p className="mt-1 text-sm text-ink/60">{t('admin.dashboardSub')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-ink/60">{t('admin.statsMonth')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-semibold text-brand-navy">{data?.total_this_month ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-ink/60">{t('admin.statsWeek')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-semibold text-brand-navy">{data?.upcoming_next_7_days ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-ink/60">{t('admin.statsCancelled')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-semibold text-rose-600">{data?.cancelled_this_month ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-ink/60">{t('admin.statsTopService')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-brand-navy">{topService}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('admin.recent')}</CardTitle>
          <Link to="/admin/appointments" className="text-sm font-medium text-brand-gold hover:text-brand-navy">
            {t('admin.viewAll')}
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-navy/10 text-ink/60">
                    <th className="pb-2 pr-4">{t('admin.tableDate')}</th>
                    <th className="pb-2 pr-4">{t('admin.tableTime')}</th>
                    <th className="pb-2 pr-4">{t('admin.tableClient')}</th>
                    <th className="pb-2 pr-4">{t('admin.tableService')}</th>
                    <th className="pb-2">{t('admin.tableStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recent_appointments ?? []).map((a) => (
                    <tr key={a.id} className="border-b border-brand-navy/5">
                      <td className="py-2 pr-4">{a.date}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{formatTime(a.time)}</td>
                      <td className="py-2 pr-4">
                        {a.first_name} {a.last_name}
                      </td>
                      <td className="py-2 pr-4">{serviceTitle(locale, a.service as ServiceSlug)}</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            a.status === 'completed' ? 'completed' : a.status === 'cancelled' ? 'cancelled' : 'upcoming'
                          }
                        >
                          {statusLabel(a.status, t)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data?.recent_appointments?.length && (
                <p className="py-8 text-center text-sm text-ink/50">{t('admin.noRecent')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
