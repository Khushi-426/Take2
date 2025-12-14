// frontend/src/TherapistDashboard.jsx

import React from 'react';
import { useAuth } from './context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import TherapistAlertsPanel from './components/TherapistAlertsPanel.jsx';

const TherapistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const userName = user ? user.name || 'Therapist' : 'Therapist';

  // Handlers for navigation
  const handleGoToPatientMonitoring = () => {
    navigate('/therapist/monitoring');
  };

  const handleGoToLibrary = () => {
    navigate('/therapist/library');
  };

  const handleGoToProtocolManager = () => {
    navigate('/therapist/protocols');
  };

  const handleGoToNotifications = () => {
    navigate('/therapist/notifications');
  };
  
  // NEW Handler for Analytics
  const handleGoToAnalytics = () => {
    navigate('/therapist/analytics');
  };


  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>
        Welcome, Dr. {userName}
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '20px' }}>
        Dashboard Summary & Quick Actions
      </p>

      {/* Top Section: Alerts Panel + Quick Stats (Responsive Layout) */}
      <div style={styles.topSection}>
        <TherapistAlertsPanel />
        
        {/* Quick Stats Placeholder */}
        <div style={styles.quickStatsCard}>
            <h2 style={{color: '#0050b3'}}>Total Patients</h2>
            <p style={{fontSize: '3rem', margin: '0'}}>42</p>
            <p style={{color: '#52c41a', fontWeight: 'bold'}}>+5 since last month</p>
        </div>
      </div>


      {/* Main Grid: Core Features (Responsive Grid) */}
      <div style={styles.mainGrid}>
        
        {/* Card 1: Patient Monitoring */}
        <div style={styles.cardStyle}>
          <h2 style={styles.cardHeaderStyle}>Patient Monitoring</h2>
          <p>Review compliance, risk status, and session data for all assigned patients.</p>
          <ul style={styles.listStyle}>
            <li>View color-coded status indicators</li>
            <li>Track compliance percentage</li>
          </ul>
          <button style={styles.buttonStyle} onClick={handleGoToPatientMonitoring}>
            Go to Monitoring
          </button>
        </div>

        {/* Card 2: Advanced Analytics & Progress (NEW) */}
        <div style={styles.cardStyle}>
          <h2 style={styles.cardHeaderStyle}>Advanced Analytics</h2>
          <p>Visualize Quality Score trends, functional improvements, and AI-driven forecasts.</p>
          <ul style={styles.listStyle}>
            <li>Quality score trend charts (weekly/monthly)</li>
            <li>Compare baseline vs current performance</li>
          </ul>
          <button style={styles.buttonStyle} onClick={handleGoToAnalytics}>
            View Analytics
          </button>
        </div>

        {/* Card 3: Exercise Library Management (Functional) */}
        <div style={styles.cardStyle}>
          <h2 style={styles.cardHeaderStyle}>Exercise Library</h2>
          <p>Create, categorize, and manage the core exercises used in patient protocols.</p>
          <ul style={styles.listStyle}>
            <li>Filter and categorize exercises</li>
            <li>Create new exercise definitions</li>
          </ul>
          <button style={styles.buttonStyle} onClick={handleGoToLibrary}>Manage Library</button>
        </div>

        {/* Card 4: Protocol Creation & Modification (Functional) */}
        <div style={styles.cardStyle}>
          <h2 style={styles.cardHeaderStyle}>Protocols & Assignment</h2>
          <p>Define sets, reps, and difficulty, then assign protocols to one or more patients.</p>
          <ul style={styles.listStyle}>
            <li>Create multi-step protocols</li>
            <li>Modify existing assigned protocols</li>
          </ul>
          <button style={styles.buttonStyle} onClick={handleGoToProtocolManager}>Manage Protocols</button>
        </div>
        
        {/* Card 5: Automated Notifications (Functional) */}
        <div style={styles.cardStyle}>
          <h2 style={styles.cardHeaderStyle}>Notifications Log</h2>
          <p>View automated reminders, assignment confirmations, and low adherence alerts.</p>
          <ul style={styles.listStyle}>
            <li>Protocol assignment feedback</li>
            <li>Patient reminders sent</li>
          </ul>
          <button style={styles.buttonStyle} onClick={handleGoToNotifications}>View Notifications</button>
        </div>
      </div>
    </div>
  );
};

// --- Styles (with responsiveness) ---
const styles = {
    dashboardContainer: { 
        padding: '20px', 
        backgroundColor: '#e6f7ff', 
        minHeight: '100vh',
    },
    header: { 
        color: '#0050b3', 
        borderBottom: '3px solid #0050b3', 
        paddingBottom: '10px',
        fontSize: '2rem',
        marginBottom: '10px'
    },
    topSection: {
        display: 'flex',
        flexWrap: 'wrap', // Allows wrapping on small screens
        gap: '20px',
        marginBottom: '30px'
    },
    quickStatsCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        flex: '1 1 200px', 
        textAlign: 'center',
    },
    mainGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px', 
    },
    cardStyle: { 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        borderLeft: '5px solid #0050b3'
    },
    cardHeaderStyle: { 
        marginBottom: '10px', 
        color: '#0050b3' 
    },
    listStyle: { 
        listStyleType: 'disc', 
        paddingLeft: '20px', 
        margin: '15px 0' 
    },
    buttonStyle: { 
        padding: '10px 15px', 
        backgroundColor: '#0050b3', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        marginTop: '15px',
        fontWeight: 'bold',
        width: '100%',
    }
};

export default TherapistDashboard;