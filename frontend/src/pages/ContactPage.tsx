import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { siteConfig } from '@/config/site'
import { isAxiosError, submitContact } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/context'

export function ContactPage() {
  const { t } = useI18n()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setSent(true)
      setError(null)
      toast.success(t('contact.toastSuccess'))
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        setError(e.message)
        toast.error(e.message)
      } else {
        setError(t('contact.toastError'))
        toast.error(t('contact.toastError'))
      }
    },
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    mutation.mutate({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      subject: String(fd.get('subject') ?? ''),
      message: String(fd.get('message') ?? ''),
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-brand-navy">{t('contact.pageTitle')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/70">{t('contact.pageSub')}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.office')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink/80">
            <p>{t('business.address')}</p>
            <p>
              <span className="font-medium text-brand-navy">{t('contact.officePhoneLabel')} </span>
              <a
                href={`tel:${siteConfig.officePhone.replace(/\D/g, '')}`}
                className="text-brand-gold hover:underline"
              >
                {siteConfig.officePhone}
              </a>
            </p>
            <p>
              <span className="font-medium text-brand-navy">{t('contact.mobilePhoneLabel')} </span>
              <a
                href={`tel:${siteConfig.mobilePhone.replace(/\D/g, '')}`}
                className="text-brand-gold hover:underline"
              >
                {siteConfig.mobilePhone}
              </a>
            </p>
            <p>
              <span className="font-medium text-brand-navy">{t('contact.faxPhoneLabel')} </span>
              <span>{siteConfig.faxPhone}</span>
            </p>
            <p>
              <span className="font-medium text-brand-navy">{t('contact.emailLabel')} </span>
              <a href={`mailto:${siteConfig.email}`} className="text-brand-gold hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <div>
              <p className="font-medium text-brand-navy">{t('contact.hoursLabel')}</p>
              <p className="mt-1">{t('business.hours')}</p>
            </div>
            <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-brand-navy/10">
              <iframe
                title={t('contact.mapEmbedTitle')}
                src={siteConfig.mapsEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('contact.sendTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <p className="text-emerald-700">{t('contact.sent')}</p>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                {error && (
                  <p className="text-sm text-rose-600" role="alert">
                    {error}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact.name')}</Label>
                  <Input id="name" name="name" required autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact.email')}</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input id="subject" name="subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea id="message" name="message" required rows={5} />
                </div>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t('contact.sending') : t('contact.send')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
