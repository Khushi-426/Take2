// frontend/src/pages/TherapistAnalytics.jsx

import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_TREND_DATA = [
  { date: 'Wk 1', score: 65 }, { date: 'Wk 2', score: 70 }, { date: 'Wk 3', score: 78 },
  { date: 'Wk 4', score: 85 }, { date: 'Wk 5', score: 82 }, { date: 'Wk 6', score: 90 },
];
const MOCK_COMPARATIVE_DATA = [
    { metric: 'Strength', initial: 50, current: 85 },
    { metric: 'Mobility', initial: 60, current: 75 },
    { metric: 'Endurance', initial: 40, current: 70 },
    { metric: 'Balance', initial: 75, current: 90 },
];
const MOCK_FORECAST_DATA = [
    { date: 'Wk 7', score: 92, forecast: 95, lower: 90, upper: 100 },
    { date: 'Wk 8', score: 93, forecast: 98, lower: 92, upper: 100 },
];

// Utility to create a mock chart visualization (CSS/SVG Mockup)
const MockLineChart = ({ data, title, isForecast = false }) => (
    <div style={styles.chartCard}>
        <h3 style={styles.chartHeader}>{title}</h3>
        <div style={styles.chartContainer}>
            <div style={styles.chartYAxis}>
                <span>100</span><span>50</span><span>0</span>
            </div>
            <div style={styles.chartArea}>
                {data.map((item, index) => (
                    <div key={index} style={styles.dataPoint(item.score)}>
                        <div style={styles.dot}></div>
                        <span style={styles.label}>{item.score}</span>
                    </div>
                ))}
                {isForecast && MOCK_FORECAST_DATA.map((item, index) => (
                    <div key={index} style={{...styles.dataPoint(item.forecast), borderLeft: '1px dashed #999'}}>
                        <div style={{...styles.dot, backgroundColor: '#faad14'}}></div>
                        <span style={{...styles.label, backgroundColor: '#faad14'}}>{item.forecast} (AI)</span>
                    </div>
                ))}
            </div>
            <div style={styles.chartXAxis}>
                {data.map(item => <span key={item.date}>{item.date}</span>)}
                {isForecast && MOCK_FORECAST_DATA.map(item => <span key={item.date} style={{color: '#faad14'}}>{item.date}</span>)}
            </div>
        </div>
        {isForecast && (
            <div style={styles.forecastInsight}>
                <p><strong>AI Insight:</strong> Estimated full functional recovery in 4-6 weeks (95% confidence).</p>
            </div>
        )}
    </div>
);

const MockComparativeChart = ({ data, title }) => (
    <div style={styles.chartCard}>
        <h3 style={styles.chartHeader}>{title}</h3>
        <div style={styles.comparativeChartArea}>
            {data.map((item, index) => (
                <div key={index} style={styles.barGroup}>
                    <p style={styles.barLabel}>{item.metric}</p>
                    <div style={styles.barWrapper}>
                        <div style={{...styles.bar, width: `${item.initial}%`, backgroundColor: '#40a9ff'}}>
                            <span style={styles.barText}>{item.initial}%</span>
                        </div>
                        <div style={{...styles.bar, width: `${item.current}%`, backgroundColor: '#0050b3'}}>
                            <span style={styles.barText}>{item.current}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div style={styles.legend}>
            <span style={{...styles.legendDot, backgroundColor: '#40a9ff'}}></span> Initial Assessment
            <span style={{...styles.legendDot, backgroundColor: '#0050b3', marginLeft: '20px'}}></span> Current Performance
        </div>
    </div>
);


const TherapistAnalytics = () => {
  const [selectedExercise, setSelectedExercise] = useState('Bicep Curl');

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeader}>Advanced Patient Analytics</h1>
      <p style={{marginBottom: '30px', color: '#555'}}>Visualizations for tracking progress, errors, and recovery forecasts.</p>
      
      {/* Exercise Selector */}
      <div style={styles.controlPanel}>
          <strong>Select Exercise:</strong>
          <select 
              value={selectedExercise} 
              onChange={(e) => setSelectedExercise(e.target.value)}
              style={styles.selectStyle}
          >
              <option>Bicep Curl</option>
              <option>Shoulder Extension</option>
              <option>Wall Squat</option>
          </select>
          <strong style={{marginLeft: '20px'}}>Time View:</strong>
          <select style={styles.selectStyle}>
              <option>Weekly</option>
              <option>Monthly</option>
          </select>
      </div>

      {/* Grid for Quality Score Trend and Forecasting */}
      <div style={styles.twoColumnGrid}>
        <MockLineChart 
            data={MOCK_TREND_DATA} 
            title={`Quality Score Trend - ${selectedExercise}`} 
        />
        <MockLineChart 
            data={MOCK_TREND_DATA.slice(-4)} 
            title={`AI Recovery Forecast`} 
            isForecast={true}
        />
      </div>

      {/* Grid for Comparative and Spider Charts */}
      <div style={styles.twoColumnGrid}>
        <MockComparativeChart 
            data={MOCK_COMPARATIVE_DATA} 
            title="Functional Improvement (Initial vs Current)" 
        />
        
        {/* Mock Radar Chart (Styled Div) */}
        <div style={styles.chartCard}>
            <h3 style={styles.chartHeader}>Functional Domain Tracking (Radar Chart Mock)</h3>
            <div style={styles.radarPlaceholder}>
                <p>Mobility: 75% | Strength: 85% | Balance: 90%</p>
                <p style={{color: '#999'}}>* Visualization requires charting library (Mock Data)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Styles (Data-dense, Responsive) ---
const styles = {
    container: { 
        padding: '30px', 
        backgroundColor: '#f0f2f5', 
        minHeight: '100vh',
    },
    mainHeader: { 
        color: '#0050b3', 
        borderBottom: '2px solid #e8e8e8', 
        paddingBottom: '10px', 
        marginBottom: '10px' 
    },
    controlPanel: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        gap: '15px'
    },
    selectStyle: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #d9d9d9'
    },
    twoColumnGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    },
    chartCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto', // Ensure chart is scrollable if needed
    },
    chartHeader: {
        color: '#333',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    // --- Mock Line Chart Styles ---
    chartContainer: { 
        display: 'flex', 
        height: '250px', 
        position: 'relative',
        paddingLeft: '30px'
    },
    chartYAxis: {
        position: 'absolute',
        left: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#777',
        textAlign: 'right',
        paddingRight: '5px'
    },
    chartArea: {
        flexGrow: 1,
        borderLeft: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        position: 'relative'
    },
    dataPoint: (score) => ({
        position: 'relative',
        height: `${score}%`, // Mock value representation
        width: '1px', 
        backgroundColor: '#0050b3', 
        transition: 'height 0.5s',
        display: 'flex',
        justifyContent: 'center'
    }),
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#0050b3',
        position: 'absolute',
        top: '-5px',
        transform: 'translateX(-50%)',
    },
    label: {
        position: 'absolute',
        top: '-25px',
        fontSize: '0.8rem',
        backgroundColor: '#0050b3',
        color: 'white',
        padding: '2px 5px',
        borderRadius: '3px'
    },
    chartXAxis: {
        position: 'absolute',
        bottom: '-20px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '0.8rem',
        color: '#777',
        paddingLeft: '30px'
    },
    forecastInsight: {
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f6ffed',
        border: '1px solid #bae637',
        borderRadius: '4px',
    },
    // --- Mock Comparative Chart Styles ---
    comparativeChartArea: {
        padding: '10px 0',
    },
    barGroup: {
        marginBottom: '20px',
    },
    barLabel: {
        fontSize: '1rem',
        marginBottom: '5px',
        color: '#333',
        fontWeight: 'bold'
    },
    barWrapper: {
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
    },
    bar: {
        height: '100%',
        position: 'absolute',
        borderRadius: '4px',
        transition: 'width 0.5s',
        display: 'flex',
        alignItems: 'center',
    },
    barText: {
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginLeft: '5px',
        mixBlendMode: 'difference',
    },
    legend: {
        marginTop: '10px',
        fontSize: '0.9rem',
        color: '#555',
    },
    legendDot: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        marginRight: '5px',
    },
    // --- Mock Radar Chart Styles ---
    radarPlaceholder: {
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7ff',
        border: '2px dashed #91d5ff',
        borderRadius: '8px',
        textAlign: 'center'
    }
};

export default TherapistAnalytics;