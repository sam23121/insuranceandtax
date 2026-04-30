import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { adminLogin, isAxiosError } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/i18n/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLoginPage() {
  const { t } = useI18n()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '')
    const password = String(fd.get('password') ?? '')
    try {
      const res = await adminLogin(email, password)
      login(res.access_token)
      void navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError(t('admin.loginInvalid'))
        toast.error(t('admin.loginInvalid'))
      } else {
        setError(t('admin.loginFailed'))
        toast.error(t('admin.loginFailed'))
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{t('admin.loginTitle')}</CardTitle>
          <CardDescription>{t('admin.loginSub')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {error && (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.email')}</Label>
              <Input id="email" name="email" type="email" required autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.password')}</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? t('admin.signingIn') : t('admin.signIn')}
            </Button>
            <p className="text-center text-sm text-ink/60">
              <Link to="/" className="text-brand-navy underline-offset-4 hover:underline">
                {t('admin.backSite')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
