export type ServiceSlug =
  | 'auto_insurance'
  | 'commercial_auto'
  | 'business_insurance'
  | 'tax_preparation'
  | 'immigration_forms'
  | 'notary_services'

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

export interface TimeSlot {
  id: string
  time: string
  is_booked: boolean
}

export interface AvailabilityDatesResponse {
  available_dates: string[]
}

export interface AvailabilitySlotsResponse {
  date: string
  slots: TimeSlot[]
}

export interface CreateAppointmentRequest {
  slot_id: string
  service: ServiceSlug
  first_name: string
  last_name: string
  email: string
  phone: string
  notes?: string
}

export interface Appointment {
  id: string
  confirmation_code?: string
  service: ServiceSlug
  date: string
  time: string
  first_name: string
  last_name: string
  email: string
  phone: string
  notes?: string | null
  status: AppointmentStatus
  admin_notes?: string | null
  created_at?: string
}

export interface AdminAppointmentsResponse {
  total: number
  page: number
  per_page: number
  appointments: Appointment[]
}

export interface AdminSlot {
  id: string
  date: string
  time: string
  is_booked: boolean
  appointment_id: string | null
}

export interface AdminAvailabilityResponse {
  slots: AdminSlot[]
}

export interface DashboardStats {
  total_this_month: number
  upcoming_next_7_days: number
  cancelled_this_month: number
  most_booked_service: ServiceSlug | null
  recent_appointments: Appointment[]
}

export interface LoginResponse {
  access_token: string
  token_type: string
}
