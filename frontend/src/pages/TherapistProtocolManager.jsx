// frontend/src/pages/TherapistProtocolManager.jsx

import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_PATIENTS = [
  { id: 101, name: 'Alice Smith', email: 'alice.s@example.com', currentProtocol: { name: 'Knee Rehab V2', exercises: 2, lastUpdated: '2025-12-10' } },
  { id: 102, name: 'Bob Johnson', email: 'bob.j@example.com', currentProtocol: { name: 'Shoulder Post-op', exercises: 4, lastUpdated: '2025-11-28' } },
  { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com', currentProtocol: null },
];
const MOCK_EXERCISES = [
  { id: 1, name: 'Bicep Curl', difficulty: 'Beginner', defaultSets: 3, defaultReps: 10 },
  { id: 2, name: 'Shoulder Extension', difficulty: 'Intermediate', defaultSets: 4, defaultReps: 8 },
  { id: 3, name: 'Wall Squat', difficulty: 'Beginner', defaultSets: 3, defaultReps: 12 },
  { id: 4, name: 'Hamstring Stretch', difficulty: 'Beginner', defaultSets: 5, defaultReps: 30 },
];

// --- Sub-components (Simplified for clarity) ---

const CreateProtocol = () => {
  const [protocolName, setProtocolName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [step, setStep] = useState(1);

  const handleAddExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { 
      ...exercise, 
      sets: exercise.defaultSets, 
      reps: exercise.defaultReps, 
      difficulty: exercise.difficulty 
    }]);
  };

  const handleProtocolAssignment = () => {
    if (!protocolName) return alert('Please enter a protocol name.');
    if (selectedExercises.length === 0) return alert('Please add at least one exercise.');
    setStep(2);
  };

  const handleFinalAssignment = () => {
    alert(`Mock: Protocol "${protocolName}" assigned to selected patients!`);
    // Reset or navigate
    setStep(1);
    setProtocolName('');
    setSelectedExercises([]);
  };

  if (step === 2) {
    return (
      <div style={styles.stepContainer}>
        <h2>Step 2: Assign Protocol to Patients</h2>
        <p>Protocol: <strong>{protocolName}</strong> ({selectedExercises.length} exercises)</p>
        <div style={{ marginTop: '20px' }}>
          {MOCK_PATIENTS.map(patient => (
            <div key={patient.id} style={styles.patientSelectCard}>
              <input type="checkbox" id={`patient-${patient.id}`} style={{ marginRight: '10px' }} />
              <label htmlFor={`patient-${patient.id}`}>{patient.name} ({patient.email})</label>
            </div>
          ))}
        </div>
        <button style={styles.backButton} onClick={() => setStep(1)}>
          &larr; Back
        </button>
        <button style={styles.assignButton} onClick={handleFinalAssignment}>
          Assign Protocol Now
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.sectionHeader}>Define Protocol</h2>
      <input 
        type="text" 
        placeholder="Protocol Name (e.g., Post-Op Knee Day 1)" 
        value={protocolName}
        onChange={(e) => setProtocolName(e.target.value)}
        style={styles.inputField}
      />
      
      <h3 style={{marginTop: '20px'}}>Selected Exercises ({selectedExercises.length})</h3>
      {selectedExercises.map((exercise, index) => (
        <div key={index} style={styles.selectedExerciseCard}>
          <span>{exercise.name}</span>
          <input 
            type="number" 
            placeholder="Sets" 
            value={exercise.sets} 
            onChange={(e) => {
              const newExs = [...selectedExercises];
              newExs[index].sets = e.target.value;
              setSelectedExercises(newExs);
            }}
            style={styles.smallInputField}
          />
          <input 
            type="number" 
            placeholder="Reps" 
            value={exercise.reps} 
            onChange={(e) => {
              const newExs = [...selectedExercises];
              newExs[index].reps = e.target.value;
              setSelectedExercises(newExs);
            }}
            style={styles.smallInputField}
          />
        </div>
      ))}
      <button 
        onClick={handleProtocolAssignment} 
        style={{...styles.createButton, opacity: selectedExercises.length > 0 ? 1 : 0.5}}
        disabled={selectedExercises.length === 0}
      >
        Next: Assign to Patients
      </button>

      <h3 style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>Exercise Picker</h3>
      <div style={styles.exercisePickerGrid}>
        {MOCK_EXERCISES.map(exercise => (
          <div key={exercise.id} style={styles.pickerCard}>
            <strong>{exercise.name}</strong>
            <p style={{fontSize: '0.8rem'}}>Sets: {exercise.defaultSets}, Reps: {exercise.defaultReps}</p>
            <button 
              onClick={() => handleAddExercise(exercise)} 
              style={styles.pickerButton}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModifyProtocol = () => {
  // Mock logic for viewing/modifying an existing protocol
  const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]);
  const [isModified, setIsModified] = useState(false);

  if (!selectedPatient.currentProtocol) {
    return (
        <div style={styles.emptyState}>
            No active protocol for {selectedPatient.name}.
        </div>
    );
  }
  
  const handleSaveModification = () => {
    setIsModified(true);
    setTimeout(() => setIsModified(false), 3000); // UI feedback
    alert(`Mock: Protocol for ${selectedPatient.name} updated!`);
  };

  return (
    <div>
        <h2 style={styles.sectionHeader}>Modify Active Protocol</h2>
        <select 
            onChange={(e) => setSelectedPatient(MOCK_PATIENTS.find(p => p.id === parseInt(e.target.value)))}
            style={styles.inputField}
            defaultValue={selectedPatient.id}
        >
            {MOCK_PATIENTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
        </select>
        
        <div style={styles.protocolDetails}>
            <h3>{selectedPatient.currentProtocol.name}</h3>
            <p>Last Modified: {selectedPatient.currentProtocol.lastUpdated}</p>
            {isModified && <p style={styles.successMessage}>✅ Protocol Updated Successfully!</p>}
            
            {/* Mock Exercise List with modification fields */}
            {[...Array(selectedPatient.currentProtocol.exercises)].map((_, index) => (
                <div key={index} style={styles.selectedExerciseCard}>
                    <span>Mock Exercise {index + 1}</span>
                    <input type="number" defaultValue={index === 0 ? 3 : 4} style={styles.smallInputField} />
                    <input type="number" defaultValue={index === 0 ? 10 : 8} style={styles.smallInputField} />
                    <select style={styles.smallInputField} defaultValue={index === 0 ? 'Beginner' : 'Intermediate'}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
            ))}
            
            <button style={styles.saveButton} onClick={handleSaveModification}>
                Save Modifications
            </button>
        </div>
    </div>
  );
};

// --- Main Component ---
const TherapistProtocolManager = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'modify'

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Protocol Manager</h1>
      
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('create')} 
          style={{...styles.tabButton, ...(activeTab === 'create' ? styles.activeTab : {})}}
        >
          Create & Assign New Protocol
        </button>
        <button 
          onClick={() => setActiveTab('modify')} 
          style={{...styles.tabButton, ...(activeTab === 'modify' ? styles.activeTab : {})}}
        >
          View & Modify Protocols
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'create' && <CreateProtocol />}
        {activeTab === 'modify' && <ModifyProtocol />}
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { color: '#0050b3', borderBottom: '2px solid #e8e8e8', paddingBottom: '15px', marginBottom: '20px' },
  tabContainer: { display: 'flex', marginBottom: '20px' },
  tabButton: { 
    padding: '10px 20px', 
    border: 'none', 
    backgroundColor: '#e6f7ff', 
    cursor: 'pointer', 
    fontSize: '1rem',
    borderBottom: '3px solid transparent'
  },
  activeTab: { 
    backgroundColor: 'white', 
    borderBottom: '3px solid #0050b3', 
    fontWeight: 'bold' 
  },
  content: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
  },
  sectionHeader: { 
    color: '#0050b3', 
    marginBottom: '15px' 
  },
  inputField: { 
    width: '100%', 
    padding: '10px', 
    marginBottom: '15px', 
    borderRadius: '4px', 
    border: '1px solid #d9d9d9' 
  },
  smallInputField: {
    width: '80px',
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: '1px solid #d9d9d9'
  },
  selectedExerciseCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 15px',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  exercisePickerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px'
  },
  pickerCard: {
    padding: '15px',
    border: '1px solid #bae637',
    backgroundColor: '#f6ffed',
    borderRadius: '4px',
    textAlign: 'center'
  },
  pickerButton: {
    padding: '6px 12px',
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginTop: '10px',
    cursor: 'pointer'
  },
  createButton: {
    padding: '12px 25px',
    backgroundColor: '#0050b3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
    float: 'right'
  },
  stepContainer: { 
    border: '2px dashed #0050b3', 
    padding: '25px', 
    borderRadius: '8px' 
  },
  patientSelectCard: { 
    padding: '10px', 
    borderBottom: '1px solid #eee' 
  },
  backButton: {
    padding: '10px 20px', 
    backgroundColor: '#f5f5f5', 
    color: '#333',
    border: '1px solid #d9d9d9', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    marginTop: '20px',
  },
  assignButton: {
    padding: '10px 20px', 
    backgroundColor: '#52c41a', 
    color: 'white',
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    marginTop: '20px',
    marginLeft: '15px',
    fontWeight: 'bold'
  },
  protocolDetails: {
    border: '1px solid #d9d9d9',
    padding: '20px',
    borderRadius: '4px',
    marginTop: '15px'
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#faad14',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold'
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    border: '1px solid #bae637',
    backgroundColor: '#f6ffed',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  emptyState: { 
    textAlign: 'center', 
    padding: '40px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    border: '1px dashed #ccc', 
    marginTop: '20px',
    color: '#999'
  }
};

export default TherapistProtocolManager;