import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from './UserLayout';
import OwnerLayout from './OwnerLayout';
import AdminLayout from './AdminLayout';
import PublicLayout from './PublicLayout';

const AdaptiveParkingLayout = ({ children, pageTitle }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'OWNER') {
      return <OwnerLayout>{children}</OwnerLayout>;
    }
    if (user?.role === 'ADMIN') {
      return <AdminLayout>{children}</AdminLayout>;
    }
    return <UserLayout pageTitle={pageTitle}>{children}</UserLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

export default AdaptiveParkingLayout;
