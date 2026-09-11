import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import PartnerApplicationLayout from './components/layout/PartnerApplicationLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdaptiveParkingLayout from './components/layout/AdaptiveParkingLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OwnerRegisterPage from './pages/auth/OwnerRegisterPage';
import OwnerApplicationPage from './pages/public/OwnerApplicationPage';
import ParkingLotsPage from './pages/user/ParkingLotsPage';
import ParkingLotDetailsPage from './pages/user/ParkingLotDetailsPage';
import ReservationPage from './pages/user/ReservationPage';
import ParkingTicketPage from './pages/user/ParkingTicketPage';

// Partner Applicant Pages
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerApplicationStatusPage from './pages/partner/PartnerApplicationStatusPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyBookingsPage from './pages/user/MyBookingsPage';
import BookingDetailsPage from './pages/user/BookingDetailsPage';
import PaymentPage from './pages/user/PaymentPage';
import ProfilePage from './pages/user/ProfilePage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyParkingLotsPage from './pages/owner/MyParkingLotsPage';
import CreateParkingLotPage from './pages/owner/CreateParkingLotPage';
import ManageSlotsPage from './pages/owner/ManageSlotsPage';
import OwnerSlotsPage from './pages/owner/OwnerSlotsPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';
import OwnerRevenuePage from './pages/owner/OwnerRevenuePage';
import OwnerStatisticsPage from './pages/owner/OwnerStatisticsPage';
import OwnerProfilePage from './pages/owner/OwnerProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOwnerApplicationsPage from './pages/admin/AdminOwnerApplicationsPage';
import AdminOwnerApplicationDetailsPage from './pages/admin/AdminOwnerApplicationDetailsPage';
import AdminOwnersPage from './pages/admin/AdminOwnersPage';
import AdminParkingPage from './pages/admin/AdminParkingPage';
import AdminSlotsPage from './pages/admin/AdminSlotsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC MARKETING / ADAPTIVE ROUTES ================= */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/find-parking" element={<AdaptiveParkingLayout pageTitle="Find Parking"><ParkingLotsPage /></AdaptiveParkingLayout>} />
          <Route path="/parking-lots" element={<AdaptiveParkingLayout pageTitle="Find Parking"><ParkingLotsPage /></AdaptiveParkingLayout>} />
          <Route path="/parking-lots/:id" element={<AdaptiveParkingLayout pageTitle="Parking Details"><ParkingLotDetailsPage /></AdaptiveParkingLayout>} />
          <Route path="/parking-lots/:id/reserve" element={<AdaptiveParkingLayout pageTitle="Reserve Parking"><ReservationPage /></AdaptiveParkingLayout>} />
          <Route path="/bookings/:id/ticket" element={<AdaptiveParkingLayout pageTitle="Digital Parking Pass"><ParkingTicketPage /></AdaptiveParkingLayout>} />
          <Route path="/owner/apply" element={<AdaptiveParkingLayout pageTitle="Become a Partner" partnerMode={true}><OwnerApplicationPage /></AdaptiveParkingLayout>} />
          <Route path="/partner/apply" element={<AdaptiveParkingLayout pageTitle="Become a Partner" partnerMode={true}><OwnerApplicationPage /></AdaptiveParkingLayout>} />
          <Route path="/owner-registration" element={<Navigate to="/owner/apply" replace />} />
          <Route path="/register-owner" element={<Navigate to="/owner/apply" replace />} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

          {/* ================= PARTNER APPLICANT AUTHENTICATED ROUTES ================= */}
          <Route
            path="/partner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']}>
                <PartnerApplicationLayout pageTitle="Partner Applicant Dashboard">
                  <PartnerDashboard />
                </PartnerApplicationLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/status"
            element={
              <ProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']}>
                <PartnerApplicationLayout pageTitle="Application Status & Timeline">
                  <PartnerApplicationStatusPage />
                </PartnerApplicationLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/application"
            element={
              <ProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']}>
                <PartnerApplicationLayout pageTitle="Application Status & Timeline">
                  <PartnerApplicationStatusPage />
                </PartnerApplicationLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= USER AUTHENTICATED ROUTES ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><UserDashboard /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><UserDashboard /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/find-parking"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout pageTitle="Find Parking"><ParkingLotsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/parking/:id"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout pageTitle="Parking Details"><ParkingLotDetailsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/parking/:id/reserve"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout pageTitle="Reserve Parking"><ReservationPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><MyBookingsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><MyBookingsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'OWNER']}>
                <UserLayout><BookingDetailsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'OWNER']}>
                <UserLayout><BookingDetailsPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings/:id/ticket"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'OWNER']}>
                <UserLayout pageTitle="Digital Parking Pass"><ParkingTicketPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <UserLayout><PaymentPage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><ProfilePage /></UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserLayout><ProfilePage /></UserLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= OWNER AUTHENTICATED ROUTES ================= */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerDashboard /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/parking-locations"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><MyParkingLotsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/lots"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><MyParkingLotsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/parking-locations/create"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><CreateParkingLotPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/create-lot"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><CreateParkingLotPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/parking-locations/:id/slots"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><ManageSlotsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/lots/:id/slots"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><ManageSlotsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/slots"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerSlotsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerBookingsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/revenue"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerRevenuePage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/statistics"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerStatisticsPage /></OwnerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerLayout><OwnerProfilePage /></OwnerLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN AUTHENTICATED ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminUsersPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/owner-applications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminOwnerApplicationsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/owner-applications/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminOwnerApplicationDetailsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminOwnersPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/parking"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminParkingPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/parking-slots"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminSlotsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminBookingsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminPaymentsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminStatisticsPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout><AdminProfilePage /></AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
