import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from './UserLayout';
import OwnerLayout from './OwnerLayout';
import AdminLayout from './AdminLayout';
import PublicLayout from './PublicLayout';
import PartnerApplicationLayout from './PartnerApplicationLayout';

const AdaptiveParkingLayout = ({ children, pageTitle, partnerMode = false }) => {
  const { user, isAuthenticated, portalMode, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>Loading ParkEase portal...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <AdminLayout>{children}</AdminLayout>;
    }
    if (user?.role === 'OWNER') {
      return <OwnerLayout>{children}</OwnerLayout>;
    }
    if (partnerMode || portalMode === 'PARTNER') {
      return <PartnerApplicationLayout pageTitle={pageTitle}>{children}</PartnerApplicationLayout>;
    }
    return <UserLayout pageTitle={pageTitle}>{children}</UserLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

export default AdaptiveParkingLayout;
