// frontend/src/pages/TherapistExerciseLibrary.jsx

import React, { useState } from 'react';

// --- MOCK EXERCISE DATA ---
const MOCK_EXERCISES = [
  { id: 1, name: 'Bicep Curl', category: 'Arm', difficulty: 'Beginner', target: 'Biceps, Elbow' },
  { id: 2, name: 'Shoulder Extension', category: 'Shoulder', difficulty: 'Intermediate', target: 'Deltoid, Rotator Cuff' },
  { id: 3, name: 'Wall Squat', category: 'Leg', difficulty: 'Beginner', target: 'Quads, Knee' },
  { id: 4, name: 'Hamstring Stretch', category: 'Leg', difficulty: 'Beginner', target: 'Hamstring' },
  { id: 5, name: 'Lunge with Twist', category: 'Core', difficulty: 'Advanced', target: 'Core, Hips' },
];

const categories = ['All', 'Arm', 'Shoulder', 'Leg', 'Core'];

const TherapistExerciseLibrary = () => {
  const [filter, setFilter] = useState('All');
  const [exercises, setExercises] = useState(MOCK_EXERCISES);

  const filteredExercises = filter === 'All' 
    ? exercises 
    : exercises.filter(e => e.category === filter);

  // Mock function for Edit action (UI only)
  const handleEdit = (exerciseName) => {
    alert(`Mock: Opening edit view for "${exerciseName}"`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Exercise Library Management</h1>
      <div style={styles.controls}>
        <div style={styles.filterGroup}>
          <strong style={{ marginRight: '10px' }}>Filter by Category:</strong>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{ ...styles.filterButton, ...(filter === cat ? styles.activeFilter : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button style={styles.addButton}>+ Add New Exercise</button>
      </div>

      <div style={styles.grid}>
        {filteredExercises.map(exercise => (
          <div key={exercise.id} style={styles.card}>
            <span style={styles.tag}>{exercise.category}</span>
            <h2 style={styles.cardTitle}>{exercise.name}</h2>
            <p style={styles.cardDetail}><strong>Target:</strong> {exercise.target}</p>
            <p style={{...styles.cardDetail, color: styles.difficultyColors[exercise.difficulty]}}>
              <strong>Difficulty:</strong> {exercise.difficulty}
            </p>
            <div style={styles.cardActions}>
              <button style={styles.actionButton} onClick={() => alert(`Mock: Viewing details for ${exercise.name}`)}>
                View
              </button>
              <button 
                style={{ ...styles.actionButton, backgroundColor: '#faad14' }} 
                onClick={() => handleEdit(exercise.name)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredExercises.length === 0 && (
        <p style={styles.emptyState}>No exercises found for this category.</p>
      )}
    </div>
  );
};

// --- Styles ---
const styles = {
  container: { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { color: '#0050b3', borderBottom: '2px solid #e8e8e8', paddingBottom: '15px', marginBottom: '20px' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  filterGroup: { display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
  filterButton: { 
    padding: '8px 15px', 
    marginRight: '10px', 
    backgroundColor: '#fff', 
    border: '1px solid #d9d9d9', 
    borderRadius: '4px', 
    cursor: 'pointer' 
  },
  activeFilter: { 
    backgroundColor: '#0050b3', 
    color: 'white', 
    borderColor: '#0050b3' 
  },
  addButton: { 
    padding: '10px 20px', 
    backgroundColor: '#52c41a', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    position: 'relative',
    borderLeft: '5px solid #0050b3'
  },
  tag: { 
    position: 'absolute', 
    top: '15px', 
    right: '15px', 
    backgroundColor: '#e6f7ff', 
    color: '#0050b3', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '0.8rem' 
  },
  cardTitle: { 
    fontSize: '1.4rem', 
    margin: '0 0 10px 0', 
    color: '#333' 
  },
  cardDetail: { 
    margin: '5px 0', 
    fontSize: '0.95rem' 
  },
  difficultyColors: {
    Beginner: 'green',
    Intermediate: 'orange',
    Advanced: 'red',
  },
  cardActions: { 
    marginTop: '15px', 
    display: 'flex', 
    gap: '10px' 
  },
  actionButton: {
    padding: '8px 15px',
    backgroundColor: '#0050b3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: { 
    textAlign: 'center', 
    padding: '40px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    border: '1px dashed #ccc', 
    marginTop: '20px' 
  }
};

export default TherapistExerciseLibrary;