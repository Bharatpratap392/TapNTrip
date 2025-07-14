import React from 'react';
import EmergencyButton from './EmergencyButton';

const EmergencyPage = ({ onClose }) => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
    {onClose && (
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 28, color: '#b91c1c', cursor: 'pointer' }} aria-label="Close Emergency Page">&times;</button>
    )}
    <h1 style={{ color: '#b91c1c', fontWeight: 'bold', marginBottom: 24, fontSize: 32 }}>Emergency Assistance</h1>
    <p style={{ color: '#f3f4f6', fontSize: 18, marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
      If you are in an emergency, press the button below to alert your contacts and service providers.
    </p>
    <EmergencyButton showFloating={false} />
  </div>
);

export default EmergencyPage; 