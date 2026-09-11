import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerApplicationApi } from '../../api/ownerApplicationApi';
import { 
  Briefcase, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  X, 
  Check, 
  RefreshCw,
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminOwnerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Approve/Reject
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'APPROVE' or 'REJECT'
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await ownerApplicationApi.getAdminApplications(params);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load owner applications:', err);
      setError('Unable to load partner applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const openActionModal = (app, action) => {
    setSelectedApp(app);
    setModalAction(action);
    setReviewNotes(action === 'APPROVE' ? 'All submitted facility details, ownership credentials and capacity verified.' : '');
    setError(null);
  };

  const closeActionModal = () => {
    setSelectedApp(null);
    setModalAction(null);
    setReviewNotes('');
  };

  const handleExecuteAction = async () => {
    if (!selectedApp || !modalAction) return;

    if (modalAction === 'REJECT' && !reviewNotes.trim()) {
      setError('Please provide a rejection reason/note so the applicant knows what needs attention.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      if (modalAction === 'APPROVE') {
        await ownerApplicationApi.approveApplication(selectedApp.id, { reviewNotes });
        setActionSuccess(`Application ${selectedApp.applicationNumber} approved! User ${selectedApp.applicantName} is now an OWNER.`);
      } else {
        await ownerApplicationApi.rejectApplication(selectedApp.id, { reviewNotes });
        setActionSuccess(`Application ${selectedApp.applicationNumber} has been rejected.`);
      }
      closeActionModal();
      fetchApplications();
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> Pending Review</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><RefreshCw size={13} /> In Review</span>;
      case 'APPROVED':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={13} /> Approved</span>;
      case 'REJECTED':
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={13} /> Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#f43f5e', letterSpacing: '0.5px' }}>
              Verification Pipeline
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Owner Partner Applications
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0.25rem 0 0' }}>
            Review, verify, and authorize facility owners before they can publish parking spaces and manage slots.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', padding: '0.55rem 1rem' }}
        >
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {actionSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      )}

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#92400e', marginTop: '0.2rem' }}>
            {statusFilter === 'ALL' ? pendingCount : (statusFilter === 'PENDING' ? applications.length : '—')}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Approved Partners</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46', marginTop: '0.2rem' }}>
            {statusFilter === 'ALL' ? approvedCount : (statusFilter === 'APPROVED' ? applications.length : '—')}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Rejected / Incomplete</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#991b1b', marginTop: '0.2rem' }}>
            {statusFilter === 'ALL' ? rejectedCount : (statusFilter === 'REJECTED' ? applications.length : '—')}
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: 'All Applications' },
              { key: 'PENDING', label: 'Pending Review' },
              { key: 'APPROVED', label: 'Approved' },
              { key: 'REJECTED', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: statusFilter === tab.key ? 700 : 500,
                  background: statusFilter === tab.key ? '#0f172a' : '#f1f5f9',
                  color: statusFilter === tab.key ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search facility, city, applicant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', height: '38px', fontSize: '0.86rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '0 0.9rem', fontSize: '0.84rem' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center' }}>
            <LoadingSpinner text="Fetching partner applications..." />
          </div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
            <Building2 size={42} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.35rem' }}>
              No Partner Applications Found
            </h3>
            <p style={{ fontSize: '0.86rem', margin: 0 }}>
              {statusFilter !== 'ALL' ? `There are currently no applications with status ${statusFilter}.` : 'No owner registration applications submitted yet.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>App ID & Date</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Applicant</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Facility & Business</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Specs</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    
                    {/* App ID & Submission */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.88rem', display: 'block' }}>
                        {app.applicationNumber}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Applicant */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                        {app.applicantName}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                        {app.applicantEmail}
                      </span>
                      {app.applicantPhone && (
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {app.applicantPhone}
                        </span>
                      )}
                    </td>

                    {/* Facility & Business */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                        {app.parkingName}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                        {app.businessName}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} /> {app.city}, {app.pincode}
                      </span>
                    </td>

                    {/* Specs */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.82rem' }}>
                      <div style={{ color: '#334155', fontWeight: 600 }}>{app.approxCapacity} Slots</div>
                      <div style={{ color: '#64748b', fontSize: '0.76rem' }}>{app.parkingType}</div>
                      {app.hasEVCharging && (
                        <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>⚡ EV Charging</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Link
                          to={`/admin/owner-applications/${app.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          title="View Complete Application Details"
                        >
                          <Eye size={14} /> View
                        </Link>

                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => openActionModal(app, 'APPROVE')}
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: '#059669', borderColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Approve & Grant Owner Role"
                            >
                              <Check size={14} /> Approve
                            </button>

                            <button
                              onClick={() => openActionModal(app, 'REJECT')}
                              className="btn btn-danger"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Reject Application"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          APPROVE / REJECT CONFIRMATION MODAL
          ========================================================================= */}
      {selectedApp && modalAction && (
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
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: modalAction === 'APPROVE' ? '#ecfdf5' : '#fee2e2',
                  color: modalAction === 'APPROVE' ? '#059669' : '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {modalAction === 'APPROVE' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {modalAction === 'APPROVE' ? 'Approve Parking Partner' : 'Reject Application'}
                </h3>
              </div>
              <button onClick={closeActionModal} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
              {modalAction === 'APPROVE' ? (
                <>
                  Are you sure you want to approve <strong>{selectedApp.applicantName}</strong> for facility <strong>{selectedApp.parkingName}</strong>? This will promote their account role to <strong>OWNER</strong> and permit live parking creation.
                </>
              ) : (
                <>
                  Please provide a rejection note explaining why <strong>{selectedApp.applicantName}</strong>'s application for <strong>{selectedApp.parkingName}</strong> is rejected.
                </>
              )}
            </p>

            <div className="form-group">
              <label className="form-label">
                {modalAction === 'APPROVE' ? 'Internal Audit / Verification Notes (Optional)' : 'Rejection Reason / Required Remediation *'}
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={modalAction === 'APPROVE' ? 'Verified property deed and municipal lease agreement.' : 'e.g. Incomplete facility address or missing authorization proof.'}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                required={modalAction === 'REJECT'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={closeActionModal}
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
                  modalAction === 'APPROVE' ? 'Confirm & Approve Owner' : 'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOwnerApplicationsPage;
