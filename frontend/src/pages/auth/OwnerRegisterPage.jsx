import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerRegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/owner/apply', { replace: true });
  }, [navigate]);

  return null;
};

export default OwnerRegisterPage;
