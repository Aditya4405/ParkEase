import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid-3" style={{ gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton skeleton-title" style={{ width: '65%', height: '1.4rem', margin: 0 }}></div>
            <div className="skeleton" style={{ width: '80px', height: '1.5rem', borderRadius: '999px' }}></div>
          </div>
          <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '90px', height: '1.8rem' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '2.2rem', borderRadius: '8px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, idx) => (
              <th key={idx}>
                <div className="skeleton" style={{ height: '1rem', width: '70%' }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx}>
              {Array.from({ length: cols }).map((_, cIdx) => (
                <td key={cIdx}>
                  <div className="skeleton" style={{ height: '1rem', width: cIdx === 0 ? '80%' : '50%' }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="skeleton skeleton-title" style={{ width: '40%', height: '2rem' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '1.5rem' }}></div>
        <div className="grid-4" style={{ gap: '1rem' }}>
          <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
        </div>
      </div>
      <div className="grid-3">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ height: '350px' }}>
            <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
            <div className="skeleton" style={{ height: '220px', borderRadius: '12px' }}></div>
          </div>
        </div>
        <div>
          <div className="card" style={{ height: '350px' }}>
            <div className="skeleton skeleton-title" style={{ width: '50%' }}></div>
            <div className="skeleton" style={{ height: '180px', borderRadius: '12px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
