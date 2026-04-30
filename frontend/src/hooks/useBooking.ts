import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAppointment } from '@/lib/api'
import type { CreateAppointmentRequest } from '@/types'

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAppointmentRequest) => createAppointment(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['availability'] })
    },
  })
}
