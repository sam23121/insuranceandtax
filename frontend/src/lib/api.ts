import axios, { type AxiosError } from 'axios'
import type {
  AdminAppointmentsResponse,
  AdminAvailabilityResponse,
  Appointment,
  AvailabilityDatesResponse,
  AvailabilitySlotsResponse,
  CreateAppointmentRequest,
  DashboardStats,
  LoginResponse,
  ServiceSlug,
} from '@/types'

const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('admin_token')
}

export async function fetchAvailableDates(year: number, month: number) {
  const { data } = await api.get<AvailabilityDatesResponse>('/availability/dates', {
    params: { year, month },
  })
  return data
}

export async function fetchSlotsForDate(date: string) {
  const { data } = await api.get<AvailabilitySlotsResponse>('/availability/slots', {
    params: { date },
  })
  return data
}

export async function createAppointment(body: CreateAppointmentRequest) {
  const { data } = await api.post<Appointment>('/appointments', body)
  return data
}

export async function submitContact(form: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { data } = await api.post<{ message: string }>('/contact', form)
  return data
}

export async function adminLogin(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/admin/login', { email, password })
  return data
}

export async function fetchAdminAppointments(params: {
  service?: ServiceSlug
  status?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}) {
  const { data } = await api.get<AdminAppointmentsResponse>('/admin/appointments', { params })
  return data
}

export async function fetchAdminAppointment(id: string) {
  const { data } = await api.get<Appointment>(`/admin/appointments/${id}`)
  return data
}

export async function patchAdminAppointment(
  id: string,
  body: Partial<{ status: string; admin_notes: string }>,
) {
  const { data } = await api.patch<Appointment>(`/admin/appointments/${id}`, body)
  return data
}

export async function fetchAdminAvailability(dateFrom: string, dateTo: string) {
  const { data } = await api.get<AdminAvailabilityResponse>('/admin/availability', {
    params: { date_from: dateFrom, date_to: dateTo },
  })
  return data
}

export async function postAdminAvailability(date: string, times: string[]) {
  const { data } = await api.post('/admin/availability', { date, times })
  return data
}

export async function deleteAdminSlot(slotId: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/availability/${slotId}`)
  return data
}

export async function postAdminAvailabilityBulk(body: {
  start_date: string
  end_date: string
  weekdays: number[]
  start_time: string
  end_time: string
  interval_minutes: number
}) {
  const { data } = await api.post<{ count?: number }>('/admin/availability/bulk', body)
  return data
}

export async function fetchDashboardStats() {
  const { data } = await api.get<DashboardStats>('/admin/dashboard/stats')
  return data
}

export function isAxiosError(e: unknown): e is AxiosError<{ detail?: string | unknown }> {
  return axios.isAxiosError(e)
}
