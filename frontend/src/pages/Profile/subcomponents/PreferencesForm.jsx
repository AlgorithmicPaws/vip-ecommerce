import React from 'react';

const PreferencesForm = ({ preferences, onChange }) => {
  return (
    <div className="preferences-section">
      <h3>Preferencias de comunicación</h3>
      <div className="preferences-grid">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={onChange}
          />
          Recibir notificaciones
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="newsletter"
            checked={preferences.newsletter}
            onChange={onChange}
          />
          Suscribirse al boletín
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="smsAlerts"
            checked={preferences.smsAlerts}
            onChange={onChange}
          />
          Alertas por SMS
        </label>
      </div>
    </div>
  );
};

export default PreferencesForm;