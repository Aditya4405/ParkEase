import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ownerApplicationApi } from '../../api/ownerApplicationApi';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  RefreshCw,
  ArrowLeft,
  Check,
  Zap,
  Layers,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const PartnerApplicationStatusPage = () => {
  const { user, refreshProfile } = useAuth();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApplicationApi.getMyApplication();
      if (res && res.data) {
        setApp(res.data);
      } else {
        setApp(null);
      }
    } catch (err) {
      console.error('Failed to load application:', err);
      setApp(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshProfile();
    await fetchApplication();
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner text="Loading verification status and dossier..." />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: '2rem auto', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <Building2 size={44} style={{ color: '#0284c7', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
          No Active Partner Application
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0 0 1.75rem', lineHeight: '1.6' }}>
          You have not submitted a parking partner application yet. Submit your parking facility for verification to begin.
        </p>
        <Link to="/owner/apply" className="btn btn-primary" style={{ padding: '0.75rem 1.8rem', fontWeight: 800 }}>
          Submit Parking Partner Application →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Top Header & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.5px' }}>
            Verification Dossier
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0 0', letterSpacing: '-0.02em' }}>
            Application Status & Verification Timeline
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', padding: '0.55rem 1rem' }}
        >
          <RefreshCw size={15} /> Refresh Status
        </button>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Verification Timeline Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem' }}>
          Verification Progress Timeline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', position: 'relative' }}>
          
          {/* Step 1 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            borderTop: '3px solid #059669'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                ✓
              </div>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>01. Submitted</strong>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
              {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Step 2 */}
          <div style={{
            background: app.status === 'APPROVED' ? '#f8fafc' : '#fffbeb',
            border: app.status === 'APPROVED' ? '1px solid #e2e8f0' : '1px solid #fde68a',
            borderRadius: '12px',
            padding: '1.25rem',
            borderTop: app.status === 'APPROVED' ? '3px solid #059669' : '3px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: app.status === 'APPROVED' ? '#ecfdf5' : '#fef3c7',
                color: app.status === 'APPROVED' ? '#059669' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {app.status === 'APPROVED' ? '✓' : '●'}
              </div>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>02. Admin Review</strong>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
              {app.status === 'APPROVED' ? 'Verified by Admin' : (app.status === 'REJECTED' ? 'Action Required' : 'In Progress')}
            </span>
          </div>

          {/* Step 3 */}
          <div style={{
            background: app.status === 'APPROVED' ? '#f8fafc' : '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            borderTop: app.status === 'APPROVED' ? '3px solid #059669' : '3px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: app.status === 'APPROVED' ? '#ecfdf5' : '#f1f5f9',
                color: app.status === 'APPROVED' ? '#059669' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {app.status === 'APPROVED' ? '✓' : <Lock size={12} />}
              </div>
              <strong style={{ fontSize: '0.86rem', color: app.status === 'APPROVED' ? '#0f172a' : '#64748b' }}>
                03. Concession Audit
              </strong>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
              {app.status === 'APPROVED' ? 'Passed Audit' : 'Pending Verification'}
            </span>
          </div>

          {/* Step 4 */}
          <div style={{
            background: app.status === 'APPROVED' ? '#ecfdf5' : '#f8fafc',
            border: app.status === 'APPROVED' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            borderTop: app.status === 'APPROVED' ? '3px solid #059669' : '3px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: app.status === 'APPROVED' ? '#059669' : '#f1f5f9',
                color: app.status === 'APPROVED' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {app.status === 'APPROVED' ? <Check size={14} /> : <Lock size={12} />}
              </div>
              <strong style={{ fontSize: '0.86rem', color: app.status === 'APPROVED' ? '#065f46' : '#64748b' }}>
                04. Owner Portal Access
              </strong>
            </div>
            <span style={{ fontSize: '0.78rem', color: app.status === 'APPROVED' ? '#047857' : '#64748b', display: 'block' }}>
              {app.status === 'APPROVED' ? 'Access Activated' : 'Locked until approval'}
            </span>
          </div>
        </div>
      </div>

      {/* Full Dossier Breakdown */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>
              {app.parkingName}
            </h2>
            <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
              Application ID: <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{app.applicationNumber}</strong>
            </div>
          </div>

          <div>
            <span style={{
              background: app.status === 'APPROVED' ? '#ecfdf5' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
              color: app.status === 'APPROVED' ? '#065f46' : app.status === 'REJECTED' ? '#991b1b' : '#92400e',
              border: `1px solid ${app.status === 'APPROVED' ? '#a7f3d0' : app.status === 'REJECTED' ? '#fecaca' : '#fde68a'}`,
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.84rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              ● Status: {app.status}
            </span>
          </div>
        </div>

        {/* Rejection / Note Banner */}
        {app.status === 'REJECTED' && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '1.5rem', margin: '1.5rem 0' }}>
            <h4 style={{ margin: '0 0 0.4rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 800 }}>
              <AlertCircle size={18} /> Administrative Review Notes
            </h4>
            <p style={{ margin: '0 0 1rem', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.5' }}>
              "{app.reviewNotes || 'Verification could not be completed.'}"
            </p>
            <Link to="/owner/apply" className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', padding: '0.55rem 1.1rem', fontSize: '0.86rem', fontWeight: 700 }}>
              Update Application & Resubmit →
            </Link>
          </div>
        )}

        {/* Section 1: Business & Applicant */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} style={{ color: 'var(--primary)' }} /> Business & Applicant Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.86rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Primary Applicant</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Email Address</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantEmail}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Phone</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantPhone || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Business Entity</span>
              <strong style={{ color: '#0f172a' }}>{app.businessName} ({app.businessType})</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Registration / GSTIN</span>
              <strong style={{ color: '#0f172a' }}>{app.businessRegistrationNumber || 'Not declared'}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Facility Specs & Location */}
        <div style={{ padding: '1.5rem 0', borderBottom: app.reviewedAt ? '1px solid #f1f5f9' : 'none' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} /> Location & Structural Specs
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.86rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Address</span>
              <strong style={{ color: '#0f172a' }}>{app.address}, {app.city}, {app.state} - {app.pincode}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Capacity</span>
              <strong style={{ color: '#0f172a' }}>{app.approxCapacity} Slots</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Parking Structure</span>
              <strong style={{ color: '#0f172a' }}>{app.parkingType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Operating Hours</span>
              <strong style={{ color: '#0f172a' }}>{app.operatingHours}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>EV Fast Charging</span>
              <strong style={{ color: app.hasEVCharging ? '#059669' : '#64748b' }}>
                {app.hasEVCharging ? '⚡ Included' : 'No'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Property Authorization</span>
              <strong style={{ color: '#0f172a' }}>{app.ownershipInfo || 'Concessionaire lease'}</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Audit Trail (if reviewed) */}
        {app.reviewedAt && (
          <div style={{ padding: '1.5rem 0 0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} style={{ color: '#059669' }} /> Administrative Verification Trail
            </h4>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.84rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Reviewed By</span>
                <strong style={{ color: '#0f172a' }}>{app.reviewedBy}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Review Date</span>
                <strong style={{ color: '#0f172a' }}>
                  {new Date(app.reviewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerApplicationStatusPage;
