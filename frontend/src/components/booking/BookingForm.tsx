import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/context'

export type BookingFormValues = {
  first_name: string
  last_name: string
  email: string
  phone: string
  notes?: string
}

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void
  isSubmitting?: boolean
}

export function BookingForm({ onSubmit, isSubmitting }: BookingFormProps) {
  const { t } = useI18n()
  const schema = useMemo(
    () =>
      z.object({
        first_name: z.string().min(1, t('booking.formRequired')),
        last_name: z.string().min(1, t('booking.formRequired')),
        email: z.string().email(t('booking.formEmailInvalid')),
        phone: z.string().min(10, t('booking.formPhoneInvalid')),
        notes: z.string().optional(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { notes: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">{t('booking.formFirstName')}</Label>
          <Input id="first_name" autoComplete="given-name" {...register('first_name')} />
          {errors.first_name && <p className="text-xs text-rose-500">{errors.first_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">{t('booking.formLastName')}</Label>
          <Input id="last_name" autoComplete="family-name" {...register('last_name')} />
          {errors.last_name && <p className="text-xs text-rose-500">{errors.last_name.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('booking.formEmail')}</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t('booking.formPhone')}</Label>
        <Input id="phone" type="tel" autoComplete="tel" placeholder="7025551234" {...register('phone')} />
        {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">{t('booking.formNotes')}</Label>
        <Textarea id="notes" rows={4} placeholder={t('booking.formNotesPlaceholder')} {...register('notes')} />
      </div>
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? t('booking.submitting') : t('booking.confirm')}
      </Button>
    </form>
  )
}
