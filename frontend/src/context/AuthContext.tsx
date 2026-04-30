import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStoredToken, setAuthToken } from '@/lib/api'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  /** Store JWT after successful admin login (same as setToken). */
  login: (accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredToken()
    setTokenState(stored)
    setAuthToken(stored)
  }, [])

  const setToken = useCallback((t: string | null) => {
    setTokenState(t)
    setAuthToken(t)
    if (t) {
      localStorage.setItem('admin_token', t)
    } else {
      localStorage.removeItem('admin_token')
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
  }, [setToken])

  const login = useCallback(
    (accessToken: string) => {
      setToken(accessToken)
    },
    [setToken],
  )

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      setToken,
      login,
      logout,
    }),
    [token, setToken, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return ctx
}
