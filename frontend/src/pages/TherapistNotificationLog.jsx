// frontend/src/pages/TherapistNotificationLog.jsx

import React from 'react';

// --- MOCK NOTIFICATION DATA ---
const MOCK_NOTIFICATIONS = [
  { id: 1, message: 'Protocol assigned successfully', patient: 'Alice Smith', type: 'Protocol', timestamp: '2025-12-14 10:30 AM' },
  { id: 2, message: 'Protocol updated: Reps increased by 2', patient: 'Bob Johnson', type: 'Modification', timestamp: '2025-12-14 09:15 AM' },
  { id: 3, message: 'Low adherence: John Doe missed 3 sessions', patient: 'John Doe', type: 'Alert', timestamp: '2025-12-13 06:00 PM' },
  { id: 4, message: 'Exercise reminder sent to Alice Smith', patient: 'Alice Smith', type: 'Reminder', timestamp: '2025-12-13 08:00 AM' },
  { id: 5, message: 'Protocol created: Post-Op Shoulder', patient: 'N/A', type: 'Protocol', timestamp: '2025-12-12 04:30 PM' },
];

const getTagStyle = (type) => {
    switch (type) {
        case 'Alert': return { backgroundColor: '#ff4d4f', color: 'white' };
        case 'Protocol': return { backgroundColor: '#40a9ff', color: 'white' };
        case 'Reminder': return { backgroundColor: '#faad14', color: 'white' };
        case 'Modification': return { backgroundColor: '#722ed1', color: 'white' };
        default: return { backgroundColor: '#f5f5f5', color: '#333' };
    }
};

const TherapistNotificationLog = () => {
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Automated Notifications Log</h1>
      <p style={{marginBottom: '20px', color: '#555'}}>Track key events related to patient protocols and reminders.</p>
      
      <div style={styles.logContainer}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>No recent notifications.</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} style={styles.notificationItem}>
              <div style={styles.contentArea}>
                <span style={{...styles.tag, ...getTagStyle(notif.type)}}>{notif.type}</span>
                <p style={styles.message}>{notif.message}</p>
              </div>
              <div style={styles.metaArea}>
                <p style={styles.metaText}>
                  {notif.patient !== 'N/A' && <strong>Patient: </strong>}
                  {notif.patient !== 'N/A' ? notif.patient : ''}
                </p>
                <p style={styles.metaText}><strong>Time: </strong>{notif.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
    container: { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
    header: { color: '#0050b3', borderBottom: '2px solid #e8e8e8', paddingBottom: '15px' },
    logContainer: { 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
        overflow: 'hidden' 
    },
    notificationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
        transition: 'background-color 0.2s',
    },
    contentArea: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
    },
    metaArea: {
        textAlign: 'right',
        minWidth: '200px'
    },
    tag: {
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginRight: '15px',
    },
    message: {
        margin: 0,
        fontSize: '1rem',
        color: '#333'
    },
    metaText: {
        margin: '2px 0',
        fontSize: '0.9rem',
        color: '#777'
    },
    emptyState: { 
        textAlign: 'center', 
        padding: '40px', 
        color: '#999'
    }
};

export default TherapistNotificationLog;