import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Layout } from '@/components/layout/Layout'
import { AdminAppointmentsPage } from '@/pages/admin/AdminAppointmentsPage'
import { AdminAvailabilityPage } from '@/pages/admin/AdminAvailabilityPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { BookingPage } from '@/pages/BookingPage'
import { BookingSuccessPage } from '@/pages/BookingSuccessPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'
import { ServicesPage } from '@/pages/ServicesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="auto-insurance" element={<ServiceDetailPage slug="auto_insurance" />} />
        <Route path="commercial-auto" element={<ServiceDetailPage slug="commercial_auto" />} />
        <Route path="business-insurance" element={<ServiceDetailPage slug="business_insurance" />} />
        <Route path="tax-preparation" element={<ServiceDetailPage slug="tax_preparation" />} />
        <Route path="immigration-forms" element={<ServiceDetailPage slug="immigration_forms" />} />
        <Route path="notary-services" element={<ServiceDetailPage slug="notary_services" />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="booking/success" element={<BookingSuccessPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="availability" element={<AdminAvailabilityPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}
