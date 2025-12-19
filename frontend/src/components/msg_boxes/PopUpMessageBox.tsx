import React, { useEffect } from 'react';
import { PopupMessageBoxProps } from './../../services/types'

export const PopupMessageBox: React.FC<PopupMessageBoxProps> = ({ 
  message, 
  type = 'success',
  onClose,
  autoClose = false,
  autoCloseDuration = 3000
}) => {
  // Auto close functionality
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  // Get icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-os-green/10',
          iconColor: 'text-os-green',
          borderColor: 'border-os-green/20'
        };
      case 'error':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-os-red/10',
          iconColor: 'text-os-red',
          borderColor: 'border-os-red/20'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          iconBg: 'bg-os-yellow/10',
          iconColor: 'text-os-yellow',
          borderColor: 'border-os-yellow/20'
        };
      case 'info':
      default:
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-opensea-blue/10',
          iconColor: 'text-opensea-blue',
          borderColor: 'border-opensea-blue/20'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-os-bg-secondary border border-os-border rounded-2xl shadow-os-lg w-full max-w-md animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center border ${styles.borderColor}`}>
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1 pt-1">
            <p className="text-os-text-primary font-medium leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-os-bg-hover transition-colors text-os-text-secondary hover:text-os-text-primary"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Got it
          </button>
        </div>

        {/* Auto-close Progress Bar */}
        {autoClose && (
          <div className="h-1 bg-os-bg-hover overflow-hidden rounded-b-2xl">
            <div 
              className={`h-full ${styles.iconColor.replace('text-', 'bg-')} animate-progress`}
              style={{ 
                animation: `progress ${autoCloseDuration}ms linear`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupMessageBox;
