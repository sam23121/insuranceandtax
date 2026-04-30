import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminAppointment, isAxiosError, patchAdminAppointment } from '@/lib/api'
import type { Appointment, AppointmentStatus, ServiceSlug } from '@/types'
import { useI18n } from '@/i18n/context'
import { serviceTitle } from '@/i18n/dictionary'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AppointmentDetailModalProps {
  appointmentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function statusLabel(status: string, t: (path: string) => string) {
  if (status === 'completed') return t('admin.statusCompleted')
  if (status === 'cancelled') return t('admin.statusCancelled')
  return t('admin.statusUpcoming')
}

export function AppointmentDetailModal({ appointmentId, open, onOpenChange }: AppointmentDetailModalProps) {
  const { locale, t } = useI18n()
  const qc = useQueryClient()
  const [notes, setNotes] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'appointment', appointmentId],
    queryFn: () => fetchAdminAppointment(appointmentId!),
    enabled: open && !!appointmentId,
  })

  useEffect(() => {
    if (data?.admin_notes != null) {
      setNotes(data.admin_notes ?? '')
    } else {
      setNotes('')
    }
  }, [data])

  const patch = useMutation({
    mutationFn: (body: Partial<{ status: AppointmentStatus; admin_notes: string }>) =>
      patchAdminAppointment(appointmentId!, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      void qc.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] })
      toast.success(t('admin.modalUpdatedToast'))
      onOpenChange(false)
    },
    onError: (e) => {
      const msg =
        isAxiosError(e) && typeof e.response?.data === 'object' && e.response.data && 'detail' in e.response.data
          ? String((e.response.data as { detail: unknown }).detail)
          : isAxiosError(e)
            ? e.message
            : t('admin.modalUpdateFailed')
      toast.error(msg)
    },
  })

  const appt = data as Appointment | undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('admin.modalTitle')}</DialogTitle>
          <DialogDescription>{t('admin.modalSub')}</DialogDescription>
        </DialogHeader>
        {isLoading && <p className="text-sm text-ink/60">{t('admin.modalLoading')}</p>}
        {appt && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-ink/60">{t('admin.modalClient')}</dt>
              <dd className="font-medium">
                {appt.first_name} {appt.last_name}
              </dd>
              <dt className="text-ink/60">{t('admin.tableEmail')}</dt>
              <dd className="break-all">{appt.email}</dd>
              <dt className="text-ink/60">{t('admin.tablePhone')}</dt>
              <dd>{appt.phone}</dd>
              <dt className="text-ink/60">{t('admin.tableService')}</dt>
              <dd>{serviceTitle(locale, appt.service as ServiceSlug)}</dd>
              <dt className="text-ink/60">{t('admin.modalWhen')}</dt>
              <dd>
                {appt.date} {appt.time}
              </dd>
              <dt className="text-ink/60">{t('admin.tableStatus')}</dt>
              <dd>{statusLabel(appt.status, t)}</dd>
            </dl>
            {appt.notes && (
              <div>
                <p className="text-xs font-semibold uppercase text-ink/50">{t('admin.modalClientNotes')}</p>
                <p className="mt-1 rounded-lg bg-brand-cream/80 p-3 text-ink/80">{appt.notes}</p>
              </div>
            )}
            <div>
              <Label htmlFor="admin_notes">{t('admin.modalAdminNotes')}</Label>
              <Textarea
                id="admin_notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={!appt || patch.isPending}
            onClick={() => patch.mutate({ status: 'completed', admin_notes: notes })}
          >
            {t('admin.modalMarkCompleted')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!appt || patch.isPending}
            onClick={() => patch.mutate({ status: 'cancelled', admin_notes: notes })}
          >
            {t('admin.modalCancelAppt')}
          </Button>
          <Button
            type="button"
            disabled={!appt || patch.isPending}
            onClick={() => patch.mutate({ admin_notes: notes })}
          >
            {t('admin.modalSaveNotes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
