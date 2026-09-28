import React from 'react';

export function LoadingSpinner({ size = 32, color = '#EC3B91', text = '', fullScreen = false, style = {} }) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', ...style }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: '50%',
          border: `${Math.max(3, size * 0.09)}px solid ${color}20`,
          borderTopColor: color,
          animation: 'spinnerRotate 0.8s linear infinite',
        }} />
      </div>
      {text && (
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
      }}>
        <style>{`@keyframes spinnerRotate { to { transform: rotate(360deg); } }`}</style>
        {spinner}
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spinnerRotate { to { transform: rotate(360deg); } }`}</style>
      {spinner}
    </>
  );
}

export function PageLoader({ text = 'Cargando...' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '300px', width: '100%',
    }}>
      <LoadingSpinner size={36} text={text} />
    </div>
  );
}

function SkeletonPulse({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, #F1F0F2 25%, #F8F7FA 37%, #F1F0F2 63%)',
      backgroundSize: '400% 100%',
      animation: 'skeletonShimmer 1.4s ease infinite',
      ...style,
    }} />
  );
}

export function SkeletonCard({ lines = 3, style = {} }) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px',
      background: '#fff', border: '1px solid #F1F0F2',
      display: 'flex', flexDirection: 'column', gap: '12px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkeletonPulse width="44px" height="44px" borderRadius="12px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonPulse width="60%" height="12px" />
          <SkeletonPulse width="40%" height="10px" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height="12px"
        />
      ))}
    </div>
  );
}

export function SkeletonPost({ style = {} }) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px',
      background: '#fff', border: '1px solid #F1F0F2',
      display: 'flex', flexDirection: 'column', gap: '12px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkeletonPulse width="40px" height="40px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <SkeletonPulse width="50%" height="12px" />
        </div>
      </div>
      <SkeletonPulse width="100%" height="12px" />
      <SkeletonPulse width="85%" height="12px" />
      <SkeletonPulse width="60%" height="12px" />
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <SkeletonPulse width="60px" height="28px" borderRadius="14px" />
        <SkeletonPulse width="60px" height="28px" borderRadius="14px" />
      </div>
    </div>
  );
}

export function SkeletonDashboard({ style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', ...style }}>
      <SkeletonPulse width="200px" height="24px" />
      <SkeletonPulse width="160px" height="14px" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '8px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: '20px', borderRadius: '16px', background: '#fff', border: '1px solid #F1F0F2' }}>
            <SkeletonPulse width="100%" height="14px" />
            <SkeletonPulse width="60%" height="28px" style={{ marginTop: '8px' }} />
          </div>
        ))}
      </div>
      <SkeletonCard lines={4} style={{ marginTop: '8px' }} />
      <SkeletonCard lines={3} />
    </div>
  );
}

export default LoadingSpinner;
