import React, { useState, useEffect, useCallback, useRef } from 'react';

const TOAST_STYLES = {
  success: {
    bg: '#F0FDF4',
    border: '1px solid #BBF7D0',
    icon: '✓',
    iconBg: '#22C55E',
    text: '#166534',
  },
  error: {
    bg: '#FEF2F2',
    border: '1px solid #FECACA',
    icon: '✕',
    iconBg: '#EF4444',
    text: '#991B1B',
  },
  info: {
    bg: '#EFF6FF',
    border: '1px solid #BFDBFE',
    icon: 'ℹ',
    iconBg: '#3B82F6',
    text: '#1E40AF',
  },
  warning: {
    bg: '#FFFBEB',
    border: '1px solid #FDE68A',
    icon: '⚠',
    iconBg: '#F59E0B',
    text: '#92400E',
  },
};

function Toast({ toasts, onRemove }) {
  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        return (
          <div key={t.id} style={{
            background: s.bg,
            border: s.border,
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            pointerEvents: 'auto',
            animation: 'toastSlideIn 0.35s ease',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: s.iconBg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, color: '#fff',
              fontSize: '13px', fontWeight: 700,
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {t.title && (
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: s.text, lineHeight: 1.3 }}>
                  {t.title}
                </p>
              )}
              <p style={{ margin: t.title ? '3px 0 0' : 0, fontSize: '12px', fontWeight: 500, color: s.text, opacity: 0.85, lineHeight: 1.4 }}>
                {t.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: s.text, opacity: 0.5, fontSize: '16px', padding: '2px',
                lineHeight: 1, flexShrink: 0,
              }}
            >
              ✕
            </button>
            {/* Progress bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, height: '3px',
              background: s.iconBg, borderRadius: '0 0 14px 14px',
              animation: `toastProgress ${t.duration || 3000}ms linear forwards`,
              width: '100%',
              transformOrigin: 'left',
            }} />
          </div>
        );
      })}
    </div>
  );
}

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = ++toastIdCounter;
    const duration = options.duration || 3000;
    const toast = {
      id,
      title: options.title || '',
      message,
      type: options.type || 'info',
      duration,
    };
    setToasts(prev => [...prev.slice(-4), toast]);
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const success = useCallback((message, opts = {}) =>
    addToast(message, { ...opts, type: 'success' }), [addToast]);

  const error = useCallback((message, opts = {}) =>
    addToast(message, { ...opts, type: 'error', duration: opts.duration || 4500 }), [addToast]);

  const info = useCallback((message, opts = {}) =>
    addToast(message, { ...opts, type: 'info' }), [addToast]);

  const warning = useCallback((message, opts = {}) =>
    addToast(message, { ...opts, type: 'warning' }), [addToast]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return { toasts, addToast, success, error, info, warning, removeToast };
}

export function ToastProvider({ children }) {
  const toast = useToast();

  useEffect(() => {
    window.__safetyLoveToast = toast;
    return () => { delete window.__safetyLoveToast; };
  }, [toast]);

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <Toast toasts={toast.toasts} onRemove={toast.removeToast} />
      {children}
    </>
  );
}

export function toast(message, options) {
  if (window.__safetyLoveToast) {
    return window.__safetyLoveToast.addToast(message, options);
  }
}

export function toastSuccess(message, options) {
  if (window.__safetyLoveToast) {
    return window.__safetyLoveToast.success(message, options);
  }
}

export function toastError(message, options) {
  if (window.__safetyLoveToast) {
    return window.__safetyLoveToast.error(message, options);
  }
}

export function toastInfo(message, options) {
  if (window.__safetyLoveToast) {
    return window.__safetyLoveToast.info(message, options);
  }
}

export default Toast;
