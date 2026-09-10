import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OwnerRegisterPage from './pages/auth/OwnerRegisterPage';
import ParkingLotsPage from './pages/user/ParkingLotsPage';
import ParkingLotDetailsPage from './pages/user/ParkingLotDetailsPage';

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
          {/* ================= PUBLIC MARKETING ROUTES ================= */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/find-parking" element={<PublicLayout><ParkingLotsPage /></PublicLayout>} />
          <Route path="/parking-lots" element={<PublicLayout><ParkingLotsPage /></PublicLayout>} />
          <Route path="/parking-lots/:id" element={<PublicLayout><ParkingLotDetailsPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/register-owner" element={<PublicLayout><OwnerRegisterPage /></PublicLayout>} />

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
