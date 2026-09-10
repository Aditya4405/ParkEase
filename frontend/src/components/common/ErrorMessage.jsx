import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  const message = typeof error === 'string' 
    ? error 
    : error.response?.data?.message || error.message || 'An error occurred. Please try again.';

  const validationErrors = error.response?.data?.validationErrors;

  return (
    <div className="alert alert-danger" style={{ position: 'relative' }}>
      <AlertCircle size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600 }}>{message}</p>
        {validationErrors && Object.keys(validationErrors).length > 0 && (
          <ul style={{ marginTop: '0.35rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
            {Object.entries(validationErrors).map(([field, err]) => (
              <li key={field}><strong>{field}</strong>: {err}</li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{ color: 'inherit', padding: '0.25rem' }}>
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
