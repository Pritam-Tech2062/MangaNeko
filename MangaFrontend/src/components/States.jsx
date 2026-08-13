import React from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading manga content...' }) => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
      {message}
    </p>
  </div>
);

export const LoadingSkeletonGrid = ({ count = 12 }) => (
  <div className="loading-skeleton-grid">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-card" />
    ))}
  </div>
);

export const EmptyState = ({
  title = 'No Manga Found',
  message = 'We could not find any manga matching your query. Try searching for something else!',
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <Inbox size={48} />
    </div>
    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>
      {title}
    </h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{message}</p>
  </div>
);

export const ErrorState = ({
  title = 'Something Went Wrong',
  message = 'Failed to load data from server. Please make sure the Spring Boot backend is running at http://localhost:8080.',
  onRetry,
}) => (
  <div className="error-state">
    <div className="error-state-icon">
      <AlertTriangle size={48} />
    </div>
    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>
      {title}
    </h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
      {message}
    </p>
    {onRetry && (
      <button className="btn-primary" onClick={onRetry}>
        <RefreshCw size={16} /> Retry Request
      </button>
    )}
  </div>
);
