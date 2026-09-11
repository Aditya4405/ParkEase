import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ownerApplicationApi } from '../../api/ownerApplicationApi';
import { 
  Building2, 
  ShieldCheck, 
  Car, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Send, 
  RefreshCw,
  Zap,
  Info,
  Layers,
  HelpCircle,
  Briefcase,
  UserPlus,
  LogIn,
  UserCheck
} from 'lucide-react';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DRAFT_STORAGE_KEY = 'parkease_owner_application_draft';
const STEP_STORAGE_KEY = 'parkease_owner_application_step';

const defaultInitialForm = {
  businessName: '',
  businessType: 'Commercial Parking Operator',
  businessRegistrationNumber: '',
  parkingName: '',
  address: '',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  pincode: '226010',
  parkingType: 'Multi-Level Covered',
  approxCapacity: 100,
  vehicleTypesSupported: 'CAR,BIKE,EV',
  hasEVCharging: true,
  operatingHours: '06:00 AM - 11:30 PM',
  ownershipInfo: 'Authorized property operator / Concessionaire deed',
  verificationDocumentUrl: '',
  termsAccepted: false
};

const OwnerApplicationPage = () => {
  const { user, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [existingApp, setExistingApp] = useState(null);
  const [checkingApp, setCheckingApp] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form from sessionStorage draft or defaults
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return { ...defaultInitialForm, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved application draft', e);
    }
    return defaultInitialForm;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY);
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 1 && stepNum <= 5) return stepNum;
      }
    } catch (e) {
      console.warn('Failed to parse saved step', e);
    }
    return 1;
  });

  // Sync draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (e) {
      console.warn('Failed to save application draft to sessionStorage', e);
    }
  }, [formData, currentStep]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExistingApplication();
    } else {
      setCheckingApp(false);
    }
  }, [isAuthenticated]);

  const fetchExistingApplication = async () => {
    try {
      setCheckingApp(true);
      const res = await ownerApplicationApi.getMyApplication();
      if (res && res.data) {
        setExistingApp(res.data);
      } else {
        setExistingApp(null);
      }
    } catch {
      setExistingApp(null);
    } finally {
      setCheckingApp(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setError(null);

    // Step Validation
    if (currentStep === 1) {
      if (!formData.businessName.trim()) {
        setError('Please enter your company or business name.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.parkingName.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
        setError('Please complete all required parking location details.');
        return;
      }
      if (parseInt(formData.approxCapacity, 10) < 1) {
        setError('Approximate capacity must be at least 1 vehicle spot.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.operatingHours.trim()) {
        setError('Please specify standard operating hours.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToRegister = () => {
    // Preserve current state at step 5
    sessionStorage.setItem(STEP_STORAGE_KEY, '5');
    navigate('/register?from=owner-application', { state: { from: '/owner/apply', isPartner: true } });
  };

  const goToLogin = () => {
    // Preserve current state at step 5
    sessionStorage.setItem(STEP_STORAGE_KEY, '5');
    navigate('/login?from=owner-application', { state: { from: '/owner/apply', isPartner: true } });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      // Direct user to authentication step cleanly without throwing an error
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please confirm the declaration and verification agreement before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        parkingName: formData.parkingName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        parkingType: formData.parkingType,
        approxCapacity: parseInt(formData.approxCapacity, 10),
        vehicleTypesSupported: formData.vehicleTypesSupported,
        hasEVCharging: formData.hasEVCharging,
        operatingHours: formData.operatingHours,
        ownershipInfo: formData.ownershipInfo,
        verificationDocumentUrl: formData.verificationDocumentUrl || 'DOC-DIGITAL-PROTOTYPE'
      };

      const res = await ownerApplicationApi.submitApplication(payload);
      setExistingApp(res.data);
      
      // Clean up sessionStorage draft after successful submission
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(STEP_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to submit owner application:', err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span style={{
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Clock size={15} /> Pending Administrative Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span style={{
            background: '#e0e7ff',
            color: '#3730a3',
            border: '1px solid #c7d2fe',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <RefreshCw size={15} /> Verification Under Review
          </span>
        );
      case 'APPROVED':
        return (
          <span style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CheckCircle2 size={15} /> Approved Partner (Role: OWNER)
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <AlertCircle size={15} /> Application Requires Attention
          </span>
        );
      default:
        return null;
    }
  };

  if (checkingApp) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Checking partner application status..." />
      </div>
    );
  }

  // If user is already approved as OWNER
  if (isAuthenticated && role === 'OWNER') {
    return (
      <div style={{ background: '#f8fafc', minHeight: '85vh', padding: '3.5rem 1rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '3rem 2.5rem', textAlign: 'center', border: '1px solid #a7f3d0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.15)'
            }}>
              <ShieldCheck size={36} />
            </div>

            <div style={{ display: 'inline-block', background: '#ecfdf5', color: '#065f46', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              ✓ Verified Facility Partner
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>
              You are already a registered parking owner
            </h1>

            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 2rem' }}>
              Your account has full administrative access to create parking locations, manage slots, configure dynamic pricing, and monitor real-time barrier telemetry.
            </p>

            <Link
              to="/owner/dashboard"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Open Operator Hub</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '2.5rem 1rem 4rem' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        {/* Header Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          borderRadius: '24px',
          padding: '2.75rem 2rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          boxShadow: '0 15px 30px -10px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              <ShieldCheck size={15} />
              <span>Verified Operator Ecosystem</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.6rem', color: '#ffffff', letterSpacing: '-0.03em' }}>
              Become a ParkEase Parking Partner
            </h1>
            
            <p style={{ color: '#cbd5e1', fontSize: '1.02rem', margin: 0, maxWidth: '640px', lineHeight: '1.6' }}>
              Submit your parking facility for verification. Once approved by administration, manage parking facilities, configure availability, and reach thousands of daily drivers.
            </p>
          </div>
        </div>

        {/* =========================================================================
            STATE 1: USER ALREADY HAS A SUBMITTED APPLICATION
            ========================================================================= */}
        {existingApp && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Application Tracker
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0.2rem 0 0.3rem', color: '#0f172a' }}>
                  Application ID: <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{existingApp.applicationNumber}</span>
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Submitted on {new Date(existingApp.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div>
                {getStatusBadge(existingApp.status)}
              </div>
            </div>

            {/* Status Breakdown & Details */}
            {existingApp.status === 'PENDING' && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                  <Clock size={18} /> Your parking partner application is currently under review
                </h4>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: '#78350f', lineHeight: '1.6' }}>
                  ParkEase administration is reviewing your facility specifications and property authorization. Once approved, your account will be granted OWNER privileges to manage parking lots.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to="/partner/dashboard"
                    className="btn btn-primary"
                    style={{ background: '#0284c7', borderColor: '#0284c7', padding: '0.6rem 1.25rem', fontSize: '0.86rem', fontWeight: 700 }}
                  >
                    Partner Applicant Dashboard →
                  </Link>
                  <Link
                    to="/partner/status"
                    className="btn btn-secondary"
                    style={{ background: '#ffffff', padding: '0.6rem 1.25rem', fontSize: '0.86rem', fontWeight: 700 }}
                  >
                    View Status Timeline
                  </Link>
                </div>
              </div>
            )}

            {existingApp.status === 'APPROVED' && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                  <CheckCircle2 size={18} /> Verification Approved!
                </h4>
                <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#047857', lineHeight: '1.6' }}>
                  Your facility partner application has been verified. Your account has full <strong>OWNER</strong> privileges.
                </p>
                <Link to="/owner/dashboard" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontWeight: 700 }}>
                  Open Operator Hub →
                </Link>
              </div>
            )}

            {existingApp.status === 'REJECTED' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                  <AlertCircle size={18} /> Application Requires Attention
                </h4>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#b91c1c', lineHeight: '1.6', fontWeight: 600 }}>
                  Review Reason: "{existingApp.reviewNotes || 'Unable to verify facility details or property rights.'}"
                </p>
                <button
                  onClick={() => {
                    setExistingApp(null);
                    setCurrentStep(1);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.86rem' }}
                >
                  <RefreshCw size={15} style={{ marginRight: '0.4rem' }} /> Submit Updated Application
                </button>
              </div>
            )}

            {/* Application Summary Box */}
            <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Submitted Facility Snapshot
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Facility Name</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.parkingName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Business Name</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.businessName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Location</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.city}, {existingApp.pincode}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Approx. Capacity</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.approxCapacity} Slots ({existingApp.parkingType})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Operating Hours</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.operatingHours}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>EV Fast Charging</span>
                  <strong style={{ color: '#0f172a' }}>{existingApp.hasEVCharging ? 'Yes (Available)' : 'No'}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: MULTI-STEP APPLICATION FORM
            ========================================================================= */}
        {!existingApp && (
          <div className="card" style={{ padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            
            {/* Multi-Step Stepper Progress */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '0.75rem' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '4%',
                  right: '4%',
                  height: '2px',
                  background: '#e2e8f0',
                  zIndex: 1,
                  transform: 'translateY(-50%)'
                }} />
                
                {[
                  { step: 1, label: 'Business Profile' },
                  { step: 2, label: 'Facility Specs' },
                  { step: 3, label: 'Operations' },
                  { step: 4, label: 'Verification' },
                  { step: 5, label: 'Confirmation' },
                ].map((item) => {
                  const isCompleted = currentStep > item.step;
                  const isCurrent = currentStep === item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => {
                        if (isCompleted) setCurrentStep(item.step);
                      }}
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        cursor: isCompleted ? 'pointer' : 'default'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCompleted ? '#059669' : isCurrent ? 'var(--primary)' : '#ffffff',
                        color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                        border: isCompleted || isCurrent ? 'none' : '2px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        margin: '0 auto 0.4rem',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(79, 70, 229, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        {isCompleted ? <CheckCircle2 size={18} /> : item.step}
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--primary)' : '#64748b',
                        display: 'block'
                      }} className="step-label">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <ErrorMessage error={error} onDismiss={() => setError(null)} />

            {/* FORM BODY */}
            <form onSubmit={currentStep === 5 ? handleSubmit : handleNext}>

              {/* STEP 1: BUSINESS INFORMATION */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                      01. Business & Operator Information
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                      Provide your company, legal entity, or property operator details.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Operator Legal Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      className="form-input"
                      placeholder="e.g. Avadh Urban Mobility Solutions Ltd"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Business Structure / Type *</label>
                      <select
                        name="businessType"
                        className="form-input"
                        value={formData.businessType}
                        onChange={handleChange}
                      >
                        <option value="Commercial Parking Operator">Commercial Parking Operator</option>
                        <option value="Mall / Shopping Center Facility">Mall / Shopping Center Facility</option>
                        <option value="Transit & Rail Hub Operator">Transit & Rail Hub Operator</option>
                        <option value="Private Property Owner">Private Property Owner</option>
                        <option value="Hotel & Valet Operator">Hotel & Valet Operator</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">GSTIN / Trade Registration Number</label>
                      <input
                        type="text"
                        name="businessRegistrationNumber"
                        className="form-input"
                        placeholder="e.g. GSTIN-09AAACH7409R1ZZ"
                        value={formData.businessRegistrationNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {user && (
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <UserCheck size={18} style={{ color: '#059669' }} />
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Primary Authenticated Applicant:</span>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{user.name} ({user.email})</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: PARKING FACILITY SPECS */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                      02. Parking Facility Location & Structure
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                      Enter physical address and structural capacity specs.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parking Facility Name *</label>
                    <input
                      type="text"
                      name="parkingName"
                      className="form-input"
                      placeholder="e.g. Hazratganj Metro Multi-Level Car Park"
                      value={formData.parkingName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Facility Street Address *</label>
                    <textarea
                      name="address"
                      className="form-input"
                      rows={2}
                      placeholder="Plot No. 12, Mahatma Gandhi Marg, Hazratganj"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-input"
                        placeholder="Lucknow"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="form-input"
                        placeholder="Uttar Pradesh"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        className="form-input"
                        placeholder="226001"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Facility Architecture *</label>
                      <select
                        name="parkingType"
                        className="form-input"
                        value={formData.parkingType}
                        onChange={handleChange}
                      >
                        <option value="Multi-Level Covered">Multi-Level Covered</option>
                        <option value="Basement Secured">Basement Secured</option>
                        <option value="Open Ground Surface">Open Ground Surface</option>
                        <option value="Automated Stack Parking">Automated Stack Parking</option>
                        <option value="Dedicated Valet Lot">Dedicated Valet Lot</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Approximate Total Capacity (Slots) *</label>
                      <input
                        type="number"
                        name="approxCapacity"
                        className="form-input"
                        min="1"
                        placeholder="150"
                        value={formData.approxCapacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: OPERATIONS & FEATURES */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                      03. Operational Hours & Amenities
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                      Configure access timings, supported vehicles, and EV charging.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Daily Operating Hours *</label>
                    <input
                      type="text"
                      name="operatingHours"
                      className="form-input"
                      placeholder="e.g. 06:00 AM - 11:30 PM or 24/7 Open"
                      value={formData.operatingHours}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supported Vehicle Types</label>
                    <select
                      name="vehicleTypesSupported"
                      className="form-input"
                      value={formData.vehicleTypesSupported}
                      onChange={handleChange}
                    >
                      <option value="CAR,BIKE,EV">Cars, Motorcycles & Electric Vehicles</option>
                      <option value="CAR,EV">Cars & Electric Vehicles only</option>
                      <option value="CAR">Standard Cars Only</option>
                      <option value="CAR,BIKE,TRUCK,EV">All Classes including Commercial Vans</option>
                    </select>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <input
                      type="checkbox"
                      id="hasEVCharging"
                      name="hasEVCharging"
                      checked={formData.hasEVCharging}
                      onChange={handleChange}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <label htmlFor="hasEVCharging" style={{ cursor: 'pointer', margin: 0 }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                        ⚡ Dedicated EV Fast Charging Infrastructure
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Check this box if your parking facility offers Type 2 or CCS2 fast charging stations for EV drivers.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: VERIFICATION & AUTHORIZATION */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                      04. Property Rights & Verification Proof
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                      Indicate your authorization to operate or monetize this parking facility.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ownership / Authorization Status</label>
                    <select
                      name="ownershipInfo"
                      className="form-input"
                      value={formData.ownershipInfo}
                      onChange={handleChange}
                    >
                      <option value="Authorized property operator / Concessionaire deed">Authorized property operator / Concessionaire deed</option>
                      <option value="Direct Freehold Deed Owner">Direct Freehold Deed Owner</option>
                      <option value="Commercial Leaseholder with Sublet Authority">Commercial Leaseholder with Sublet Authority</option>
                      <option value="Municipal / Government Parking Contractor">Municipal / Government Parking Contractor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Verification Reference Identifier (Optional Reference)</label>
                    <input
                      type="text"
                      name="verificationDocumentUrl"
                      className="form-input"
                      placeholder="e.g. DOC-LKO-2026-LEASE-AUTH"
                      value={formData.verificationDocumentUrl}
                      onChange={handleChange}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                      🔒 Safe Reference: Document files are verified privately by admin and are never exposed over public APIs.
                    </small>
                  </div>
                </div>
              )}

              {/* STEP 5: CONFIRMATION & AUTHENTICATION REQUIREMENT */}
              {currentStep === 5 && (
                <div className="animate-fade-in">
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                      05. Review & Submission
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                      Please review your facility specifications before submitting for administrative verification.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.86rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Business Name</span>
                        <strong style={{ color: '#0f172a' }}>{formData.businessName || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Facility Name</span>
                        <strong style={{ color: '#0f172a' }}>{formData.parkingName || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Address</span>
                        <strong style={{ color: '#0f172a' }}>{formData.address}, {formData.city}, {formData.pincode}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Capacity & Architecture</span>
                        <strong style={{ color: '#0f172a' }}>{formData.approxCapacity} Slots • {formData.parkingType}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Operating Hours</span>
                        <strong style={{ color: '#0f172a' }}>{formData.operatingHours}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>EV Fast Charging</span>
                        <strong style={{ color: '#0f172a' }}>{formData.hasEVCharging ? 'Included' : 'None'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* AUTHENTICATION REQUIREMENT CARD (Shown if NOT logged in) */}
                  {!isAuthenticated ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                      border: '1.5px solid #bae6fd',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 4px 15px rgba(2, 132, 199, 0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
                        }}>
                          <Sparkles size={22} />
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                            Complete Your Application
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
                            Your parking partner application is ready. For security and application tracking, create a free ParkEase account or log in to submit your details.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={goToRegister}
                          className="btn btn-primary"
                          style={{
                            padding: '0.75rem 1.4rem',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            borderRadius: '10px'
                          }}
                        >
                          <UserPlus size={16} />
                          <span>Create Free Account</span>
                        </button>

                        <button
                          type="button"
                          onClick={goToLogin}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.75rem 1.4rem',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            background: '#ffffff',
                            borderRadius: '10px'
                          }}
                        >
                          <LogIn size={16} />
                          <span>Already have an account? Log In</span>
                        </button>
                      </div>

                      <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={14} style={{ color: '#059669' }} />
                        <span>All your entered application details will be preserved automatically when you return.</span>
                      </div>
                    </div>
                  ) : (
                    /* AUTHENTICATED USER READY TO SUBMIT */
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.06)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: '#059669',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '1rem', color: '#065f46', display: 'block' }}>
                            Ready to Submit Application
                          </strong>
                          <span style={{ fontSize: '0.84rem', color: '#047857' }}>
                            Connected as <strong>{user?.name}</strong> ({user?.email}). You can now submit your Parking Partner application for administrative review.
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #d1fae5' }}>
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer', marginTop: '2px' }}
                          required
                        />
                        <label htmlFor="termsAccepted" style={{ cursor: 'pointer', margin: 0, fontSize: '0.86rem', color: '#064e3b', lineHeight: '1.5', fontWeight: 500 }}>
                          I declare that I am authorized to list and operate this parking facility. I understand that the application will be reviewed by ParkEase Administration before owner credentials and parking creation capabilities are activated.
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Form Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-secondary"
                    style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700 }}
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  isAuthenticated ? (
                    <button
                      type="submit"
                      disabled={submitting || !formData.termsAccepted}
                      className="btn btn-primary"
                      style={{
                        padding: '0.75rem 1.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        background: '#059669',
                        borderColor: '#059669',
                        cursor: submitting || !formData.termsAccepted ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submitting ? (
                        <LoadingSpinner text="Submitting Application..." />
                      ) : (
                        <>
                          <Send size={16} /> Submit Partner Application
                        </>
                      )}
                    </button>
                  ) : null
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .step-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerApplicationPage;
