// frontend/src/components/TherapistAlertsPanel.jsx

import React from 'react';

const MOCK_ALERTS = [
  { id: 1, patient: 'Alice Smith', type: 'Missed Session', timestamp: '10:30 AM', severity: 'High' },
  { id: 2, patient: 'Charlie Brown', type: 'Score Threshold (Knee)', timestamp: 'Yesterday', severity: 'Medium' },
  { id: 3, patient: 'Bob Johnson', type: 'Heart Rate Warning (Vitals)', timestamp: '3 days ago', severity: 'High' },
  { id: 4, patient: 'Diana Prince', type: 'Missed Session', timestamp: '4 days ago', severity: 'Medium' },
];

const getAlertStyle = (severity) => {
    switch (severity) {
        case 'High': return { color: '#ff4d4f', borderLeft: '3px solid #ff4d4f' }; // Red
        case 'Medium': return { color: '#faad14', borderLeft: '3px solid #faad14' }; // Orange/Yellow
        default: return { color: '#333', borderLeft: '3px solid #d9d9d9' };
    }
};

const TherapistAlertsPanel = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <span style={{ marginRight: '10px' }}>🔔</span> 
        Urgent Alerts ({MOCK_ALERTS.length} total)
      </h2>
      <div style={styles.list}>
        {MOCK_ALERTS.map(alert => (
          <div key={alert.id} style={{ ...styles.alertItem, ...getAlertStyle(alert.severity) }}>
            <div style={styles.alertContent}>
              <strong style={{ display: 'block' }}>{alert.patient}</strong>
              <span style={{ fontSize: '0.9rem' }}>{alert.type}</span>
            </div>
            <span style={styles.timestamp}>{alert.timestamp}</span>
          </div>
        ))}
      </div>
      <button style={styles.viewAllButton} onClick={() => alert("Mock: Navigating to Full Alert Log")}>
        View Full Alert Log &rarr;
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    flex: '1 1 300px', // Responsive sizing
  },
  header: {
    color: '#0050b3',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
    fontSize: '1.5rem',
  },
  list: {
    maxHeight: '300px', 
    overflowY: 'auto',
  },
  alertItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    marginBottom: '8px',
    borderRadius: '6px',
    backgroundColor: '#fffbe6', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  alertContent: {
    flexGrow: 1,
  },
  timestamp: {
    fontSize: '0.8rem',
    color: '#777',
    marginLeft: '10px',
  },
  viewAllButton: {
    width: '100%',
    padding: '10px',
    marginTop: '15px',
    backgroundColor: '#e6f7ff',
    color: '#0050b3',
    border: '1px solid #91d5ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default TherapistAlertsPanel;