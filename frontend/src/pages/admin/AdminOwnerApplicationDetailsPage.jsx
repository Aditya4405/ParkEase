import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ownerApplicationApi } from '../../api/ownerApplicationApi';
import { 
  Building2, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Zap, 
  Car,
  X,
  Check,
  RefreshCw,
  Lock
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminOwnerApplicationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalAction, setModalAction] = useState(null); // 'APPROVE' or 'REJECT'
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApplicationApi.getAdminApplicationById(id);
      setApp(res.data);
    } catch (err) {
      console.error('Failed to load application details:', err);
      setError('Unable to load partner application details.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!modalAction) return;
    if (modalAction === 'REJECT' && !reviewNotes.trim()) {
      setError('Please provide a rejection note/reason.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      if (modalAction === 'APPROVE') {
        const res = await ownerApplicationApi.approveApplication(id, { reviewNotes });
        setApp(res.data);
        setActionSuccess(`Partner application ${res.data.applicationNumber} approved successfully! User promoted to OWNER.`);
      } else {
        const res = await ownerApplicationApi.rejectApplication(id, { reviewNotes });
        setApp(res.data);
        setActionSuccess(`Partner application ${res.data.applicationNumber} has been rejected.`);
      }
      setModalAction(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Action failed:', err);
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <LoadingSpinner text="Loading application dossier..." />
      </div>
    );
  }

  if (!app && !loading) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <AlertCircle size={40} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Application Not Found</h3>
        <p style={{ color: '#64748b' }}>No owner partner application found with ID: {id}</p>
        <Link to="/admin/owner-applications" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          ← Return to Applications List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/admin/owner-applications"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#475569',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Partner Applications
        </Link>

        {app.status === 'PENDING' && (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => {
                setModalAction('APPROVE');
                setReviewNotes('Property authorization and capacity credentials verified.');
              }}
              className="btn btn-primary"
              style={{ background: '#059669', borderColor: '#059669', padding: '0.55rem 1.1rem', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Check size={16} /> Approve & Grant Owner Role
            </button>

            <button
              onClick={() => {
                setModalAction('REJECT');
                setReviewNotes('');
              }}
              className="btn btn-danger"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <X size={16} /> Reject Application
            </button>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      )}

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* Main Dossier Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        
        {/* Header Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', paddingBottom: '1.75rem', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                Application Dossier
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
              {app.parkingName}
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Application ID: <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{app.applicationNumber}</strong> • Submitted {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div>
            {app.status === 'PENDING' && (
              <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} /> Pending Verification
              </span>
            )}
            {app.status === 'APPROVED' && (
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> Approved Partner (Role: OWNER)
              </span>
            )}
            {app.status === 'REJECTED' && (
              <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={16} /> Application Rejected
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Applicant Profile */}
        <div style={{ padding: '1.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary)' }} /> 01. Applicant Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Full Name</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Email Address</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantEmail}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Phone Number</span>
              <strong style={{ color: '#0f172a' }}>{app.applicantPhone || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>User Account ID</span>
              <strong style={{ color: '#0f172a' }}>#{app.userId}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Business Information */}
        <div style={{ padding: '1.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--primary)' }} /> 02. Legal Entity & Business Specs
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Business / Operator Name</span>
              <strong style={{ color: '#0f172a' }}>{app.businessName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Business Type</span>
              <strong style={{ color: '#0f172a' }}>{app.businessType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Registration / GSTIN</span>
              <strong style={{ color: '#0f172a' }}>{app.businessRegistrationNumber || 'Not provided / Unregistered'}</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Parking Facility Details */}
        <div style={{ padding: '1.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} /> 03. Facility Location & Capacity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Full Physical Address</span>
              <strong style={{ color: '#0f172a' }}>{app.address}, {app.city}, {app.state} - {app.pincode}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Facility Type</span>
              <strong style={{ color: '#0f172a' }}>{app.parkingType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Declared Total Capacity</span>
              <strong style={{ color: '#0f172a' }}>{app.approxCapacity} Parking Slots</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Operating Hours</span>
              <strong style={{ color: '#0f172a' }}>{app.operatingHours}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Supported Vehicles</span>
              <strong style={{ color: '#0f172a' }}>{app.vehicleTypesSupported}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>EV Fast Charging</span>
              <strong style={{ color: app.hasEVCharging ? '#059669' : '#64748b' }}>
                {app.hasEVCharging ? '⚡ Included (Fast Charging Station)' : 'No EV Charging'}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 4: Verification & Property Rights */}
        <div style={{ padding: '1.75rem 0', borderBottom: app.reviewedAt ? '1px solid #f1f5f9' : 'none' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} style={{ color: 'var(--primary)' }} /> 04. Verification & Authorization Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Property Rights / Deed</span>
              <strong style={{ color: '#0f172a' }}>{app.ownershipInfo || 'Declared legal operator'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Verification Reference</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>
                {app.verificationDocumentUrl || 'DOC-DIGITAL-PROTOTYPE'}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 5: Review & Audit Notes (if reviewed) */}
        {app.reviewedAt && (
          <div style={{ padding: '1.75rem 0 0' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#059669' }} /> 05. Administrative Audit Trail
            </h3>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.86rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Reviewed By</span>
                  <strong style={{ color: '#0f172a' }}>{app.reviewedBy || 'System Admin'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Reviewed Timestamp</span>
                  <strong style={{ color: '#0f172a' }}>
                    {new Date(app.reviewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </strong>
                </div>
              </div>
              {app.reviewNotes && (
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Review Notes</span>
                  <p style={{ margin: '0.2rem 0 0', color: '#1e293b', fontWeight: 600, fontSize: '0.88rem' }}>
                    "{app.reviewNotes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          APPROVE / REJECT MODAL
          ========================================================================= */}
      {modalAction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {modalAction === 'APPROVE' ? 'Confirm Partner Approval' : 'Confirm Partner Rejection'}
              </h3>
              <button onClick={() => setModalAction(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {modalAction === 'APPROVE' ? (
                <>
                  Approve <strong>{app.applicantName}</strong> for facility <strong>{app.parkingName}</strong>. This updates their account role to <strong>OWNER</strong> in the database.
                </>
              ) : (
                <>
                  Enter the reason for rejecting <strong>{app.applicantName}</strong>'s application for <strong>{app.parkingName}</strong>.
                </>
              )}
            </p>

            <div className="form-group">
              <label className="form-label">
                {modalAction === 'APPROVE' ? 'Audit Notes (Optional)' : 'Rejection Reason *'}
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={modalAction === 'APPROVE' ? 'Verified property deed and facility specs.' : 'Explain what documentation or verification is required.'}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                required={modalAction === 'REJECT'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteAction}
                className={modalAction === 'APPROVE' ? 'btn btn-primary' : 'btn btn-danger'}
                style={{
                  background: modalAction === 'APPROVE' ? '#059669' : undefined,
                  borderColor: modalAction === 'APPROVE' ? '#059669' : undefined,
                  fontWeight: 700
                }}
                disabled={actionLoading}
              >
                {actionLoading ? <LoadingSpinner text="Processing..." /> : (
                  modalAction === 'APPROVE' ? 'Confirm & Approve' : 'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOwnerApplicationDetailsPage;
