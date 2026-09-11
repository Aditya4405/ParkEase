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
  FileText, 
  ArrowRight, 
  RefreshCw,
  Layers,
  Zap,
  Check,
  Lock,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const PartnerDashboard = () => {
  const { user, role, refreshProfile } = useAuth();
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

  const handleRefreshStatus = async () => {
    await refreshProfile();
    await fetchApplication();
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner text="Fetching partner application status..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0284c7 100%)',
        borderRadius: '20px',
        padding: '2.25rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={14} /> Parking Partner Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem', letterSpacing: '-0.5px' }}>
            Welcome, {user?.name || 'Partner Applicant'} 👋
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '0.92rem', margin: 0, maxWidth: '520px', lineHeight: '1.5' }}>
            Track the verification progress of your parking facility. Once verified by administration, full facility management and slot availability controls will be unlocked.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleRefreshStatus}
            className="btn btn-secondary"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RefreshCw size={15} /> Check Status
          </button>
          
          <Link
            to="/partner/status"
            className="btn btn-primary"
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              padding: '0.75rem 1.4rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <Clock size={16} />
            <span>Timeline</span>
          </Link>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* =========================================================================
          APPLICATION STATUS BANNER
          ========================================================================= */}
      {app ? (
        <div style={{
          background: app.status === 'APPROVED' ? '#ecfdf5' : app.status === 'REJECTED' ? '#fef2f2' : '#fffbeb',
          border: `1.5px solid ${app.status === 'APPROVED' ? '#a7f3d0' : app.status === 'REJECTED' ? '#fecaca' : '#fde68a'}`,
          borderRadius: '18px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: app.status === 'APPROVED' ? '#059669' : app.status === 'REJECTED' ? '#dc2626' : '#d97706',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {app.status === 'APPROVED' ? <CheckCircle2 size={24} /> : app.status === 'REJECTED' ? <AlertCircle size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: app.status === 'APPROVED' ? '#065f46' : app.status === 'REJECTED' ? '#991b1b' : '#92400e'
                  }}>
                    {app.status === 'APPROVED' ? 'Partner Application Approved!' : app.status === 'REJECTED' ? 'Application Requires Attention' : 'Application Under Administrative Review'}
                  </h3>
                </div>
                <span style={{ fontSize: '0.84rem', color: app.status === 'APPROVED' ? '#047857' : app.status === 'REJECTED' ? '#b91c1c' : '#78350f' }}>
                  Application ID: <strong style={{ fontFamily: 'monospace' }}>{app.applicationNumber}</strong> • Submitted {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div>
              <span style={{
                background: app.status === 'APPROVED' ? '#d1fae5' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                color: app.status === 'APPROVED' ? '#065f46' : app.status === 'REJECTED' ? '#991b1b' : '#92400e',
                border: `1px solid ${app.status === 'APPROVED' ? '#a7f3d0' : app.status === 'REJECTED' ? '#fecaca' : '#fde68a'}`,
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                Status: {app.status}
              </span>
            </div>
          </div>

          <p style={{
            margin: '0 0 1.25rem',
            fontSize: '0.92rem',
            color: app.status === 'APPROVED' ? '#065f46' : app.status === 'REJECTED' ? '#991b1b' : '#92400e',
            lineHeight: '1.6'
          }}>
            {app.status === 'APPROVED' 
              ? 'Your facility credentials and location have been verified. You now have full OWNER privileges.'
              : app.status === 'REJECTED'
              ? `Review Note: "${app.reviewNotes || 'Verification incomplete.'}" Please update your details and resubmit.`
              : 'Our operations and audit team is currently verifying your facility ownership, capacity, and physical access parameters.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {app.status === 'APPROVED' ? (
              <Link to="/owner/dashboard" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669', fontWeight: 800 }}>
                Open Owner Dashboard (Operator Hub) →
              </Link>
            ) : app.status === 'REJECTED' ? (
              <Link to="/owner/apply" className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', fontWeight: 700 }}>
                <RefreshCw size={15} style={{ marginRight: '0.4rem' }} /> Edit & Resubmit Application
              </Link>
            ) : (
              <Link to="/partner/status" className="btn btn-secondary" style={{ background: '#ffffff', fontWeight: 700 }}>
                View Verification Dossier →
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* NO APPLICATION YET */
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Building2 size={48} style={{ color: '#0284c7', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Start Your Parking Partner Application
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
            You have not submitted a parking facility application yet. Submit your parking lot details to get verified and start receiving reservations.
          </p>
          <Link to="/owner/apply" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontWeight: 800 }}>
            Fill Partner Application Form →
          </Link>
        </div>
      )}

      {/* Grid: Application Snapshot & Verification Roadmap */}
      {app && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Left Card: Facility Snapshot */}
          <div className="card" style={{ padding: '1.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Building2 size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Facility Snapshot
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Facility Name</span>
                <strong style={{ color: '#0f172a' }}>{app.parkingName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Business Entity</span>
                <strong style={{ color: '#0f172a' }}>{app.businessName} ({app.businessType})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Address</span>
                <strong style={{ color: '#0f172a' }}>{app.address}, {app.city}, {app.pincode}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>Capacity & Type</span>
                  <strong style={{ color: '#0f172a' }}>{app.approxCapacity} Slots ({app.parkingType})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>EV Fast Charging</span>
                  <strong style={{ color: app.hasEVCharging ? '#059669' : '#64748b' }}>
                    {app.hasEVCharging ? '⚡ Included' : 'None'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: What Happens Next? */}
          <div className="card" style={{ padding: '1.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Clock size={20} style={{ color: '#0284c7' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                What Happens Next?
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  <Check size={14} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                    01. Application Submitted
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Facility specs and coordinates entered into ParkEase audit pipeline.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: app.status === 'APPROVED' ? '#ecfdf5' : '#fef3c7',
                  color: app.status === 'APPROVED' ? '#059669' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {app.status === 'APPROVED' ? <Check size={14} /> : '●'}
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                    02. Administrative Verification
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Operations team verifies property lease, physical address, and slot count.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: app.status === 'APPROVED' ? '#ecfdf5' : '#f1f5f9',
                  color: app.status === 'APPROVED' ? '#059669' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {app.status === 'APPROVED' ? <Check size={14} /> : <Lock size={12} />}
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: app.status === 'APPROVED' ? '#0f172a' : '#94a3b8', display: 'block' }}>
                    03. Owner Privileges Activated
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Account elevated to OWNER to manage parking facilities, slots, and revenue.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
