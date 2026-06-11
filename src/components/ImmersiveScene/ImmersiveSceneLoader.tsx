'use client';

import dynamic from 'next/dynamic';

// ImmersiveScene uses WebGL + browser-only APIs — must be client-side
const ImmersiveSceneInner = dynamic(
  () => import('./ImmersiveScene').then(m => ({ default: m.ImmersiveScene })),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, #00a868, transparent)',
        }} />
      </div>
    ),
  }
);

export function ImmersiveSceneLoader() {
  return <ImmersiveSceneInner />;
}
