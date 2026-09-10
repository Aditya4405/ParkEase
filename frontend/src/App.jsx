import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

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
import ProfilePage from './pages/user/ProfilePage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyParkingLotsPage from './pages/owner/MyParkingLotsPage';
import CreateParkingLotPage from './pages/owner/CreateParkingLotPage';
import ManageSlotsPage from './pages/owner/ManageSlotsPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/find-parking" element={<ParkingLotsPage />} />
              <Route path="/parking-lots" element={<ParkingLotsPage />} />
              <Route path="/parking-lots/:id" element={<ParkingLotDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register-owner" element={<OwnerRegisterPage />} />

              {/* User Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Owner Protected Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/lots"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <MyParkingLotsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/create-lot"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <CreateParkingLotPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/lots/:id/slots"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <ManageSlotsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/bookings"
                element={
                  <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                    <OwnerBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
