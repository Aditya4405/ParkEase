import React from 'react';
import { Search, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Search,
  title = 'No parking found',
  description = 'Try changing your search query, location or filter options.',
  actionText = 'Find Nearby Parking',
  actionLink = '/parking-lots',
  onAction,
}) => {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        border: '1px dashed var(--border)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
        {description}
      </p>

      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary">
            {actionText}
          </Link>
        ) : onAction ? (
          <button onClick={onAction} className="btn btn-primary">
            {actionText}
          </button>
        ) : null
      )}
    </div>
  );
};

export default EmptyState;
