// frontend/src/pages/TherapistPatientMonitoring.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA (Enhanced with Compliance and Risk) ---
const MOCK_PATIENTS = [
  { id: 101, name: 'Alice Smith', email: 'alice.s@example.com', compliance: 95, risk: 'Stable', lastSession: '2 hours ago' },
  { id: 102, name: 'Bob Johnson', email: 'bob.j@example.com', compliance: 42, risk: 'High Risk', lastSession: '5 days ago' },
  { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com', compliance: 78, risk: 'Alert', lastSession: 'Yesterday' },
  { id: 104, name: 'Diana Prince', email: 'diana.p@example.com', compliance: 88, risk: 'Stable', lastSession: '1 day ago' },
  { id: 105, name: 'Ethan Hunt', email: 'ethan.h@example.com', compliance: 65, risk: 'Alert', lastSession: '3 days ago' },
];

const getStatusColor = (risk) => {
  switch (risk) {
    case 'High Risk': return '#ff4d4f'; // Red
    case 'Alert': return '#faad14'; // Orange/Yellow
    case 'Stable': return '#52c41a'; // Green
    default: return '#999';
  }
};

// Component for the compliance progress bar (visual element)
const ComplianceBar = ({ percentage }) => {
  const color = percentage < 50 ? '#ff4d4f' : percentage < 80 ? '#faad14' : '#52c41a';
  return (
    <div style={styles.progressBarWrapper}>
      <div style={{...styles.progressBar, width: `${percentage}%`, backgroundColor: color}}></div>
      <span style={styles.progressText}>{percentage}%</span>
    </div>
  );
};

const TherapistPatientMonitoring = () => {
  const patients = MOCK_PATIENTS;
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button 
        onClick={() => navigate('/therapist-dashboard')} 
        style={styles.backButtonStyle}
      >
        &larr; Back to Dashboard
      </button>

      <h1 style={styles.header}>Patient Monitoring Overview ({patients.length} Active)</h1>
      
      {/* Status Legend */}
      <div style={styles.legendContainer}>
        <h3 style={{color: '#0050b3', width: '100%', margin: '0 0 10px 0'}}>Status Legend</h3>
        <p style={styles.legendItem}>
          <span style={{...styles.dot, backgroundColor: '#52c41a'}}></span> Stable (Compliant)
        </p>
        <p style={styles.legendItem}>
          <span style={{...styles.dot, backgroundColor: '#faad14'}}></span> Alert (Threshold/Low Compliance)
        </p>
        <p style={styles.legendItem}>
          <span style={{...styles.dot, backgroundColor: '#ff4d4f'}}></span> High Risk (Non-Compliant/Severe Alert)
        </p>
      </div>

      {/* Patient List Grid (Responsive) */}
      <div style={styles.gridContainer}>
        {patients.map(patient => {
          const statusColor = getStatusColor(patient.risk);
          return (
            <div key={patient.id} style={styles.card}>
              
              {/* Status Indicator (Color-Coded) */}
              <div style={{...styles.statusIndicator, backgroundColor: statusColor}}></div>
              
              <div style={styles.cardContent}>
                <h2 style={styles.cardName}>{patient.name}</h2>
                <p style={styles.cardDetail}><strong>Email:</strong> {patient.email}</p>
                <p style={{...styles.cardDetail, color: statusColor, fontWeight: 'bold'}}>
                    Status: {patient.risk}
                </p>
                <p style={styles.cardDetail}><strong>Last Session:</strong> {patient.lastSession}</p>
                
                {/* Compliance Tracking */}
                <h3 style={styles.complianceHeader}>Compliance</h3>
                <ComplianceBar percentage={patient.compliance} />

                <button style={styles.cardButton} onClick={() => alert(`Mock: Viewing detailed report for ${patient.name}`)}>
                  View Detailed Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Styles (with Mobile Responsiveness considerations) ---
const styles = {
  container: { 
    padding: '30px', 
    backgroundColor: '#f9f9f9', 
    minHeight: '100vh',
  },
  backButtonStyle: {
    background: 'none',
    border: 'none',
    color: '#1890ff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '20px'
  },
  header: { 
    color: '#0050b3', 
    borderBottom: '2px solid #ddd', 
    paddingBottom: '10px',
    fontSize: '1.8rem',
  },
  legendContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    fontSize: '0.9rem'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '8px',
  },
  gridContainer: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
  },
  statusIndicator: {
    width: '10px',
    height: '100%',
    flexShrink: 0,
  },
  cardContent: {
    padding: '20px',
    flexGrow: 1,
  },
  cardName: { 
    margin: '0 0 10px 0', 
    color: '#0050b3',
    fontSize: '1.5rem' 
  },
  cardDetail: { 
    margin: '5px 0', 
    fontSize: '0.95rem', 
    color: '#333' 
  },
  complianceHeader: {
    fontSize: '1rem',
    marginTop: '15px',
    marginBottom: '5px',
    color: '#555'
  },
  progressBarWrapper: {
    backgroundColor: '#eee',
    borderRadius: '4px',
    height: '15px',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progressText: {
    position: 'absolute',
    right: '5px',
    color: 'black',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    mixBlendMode: 'difference',
  },
  cardButton: { 
    padding: '10px 15px', 
    backgroundColor: '#1890ff', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    marginTop: '15px',
    fontWeight: '600',
    width: '100%',
    transition: 'background-color 0.2s'
  },
};

export default TherapistPatientMonitoring;