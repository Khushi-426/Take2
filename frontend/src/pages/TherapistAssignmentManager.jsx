import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronRight, User, Calendar, 
  CheckCircle, X, ArrowRight, Layers, Sparkles, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const MUSCLE_EXERCISE_MAP = {
  shoulders: [
    { id: 'shoulder_press', name: 'Shoulder Press', difficulty: 'Intermediate', type: 'Strength' }
  ],
  biceps: [
    { id: 'bicep_curl', name: 'Bicep Curl', difficulty: 'Beginner', type: 'Strength' }
  ],
  legs: [
    { id: 'squat', name: 'Squat', difficulty: 'Intermediate', type: 'Strength' },
    { id: 'knee_lift', name: 'Knee Lift', difficulty: 'Beginner', type: 'Mobility' }
  ],
  back: [
    { id: 'seated_row', name: 'Seated Row', difficulty: 'Intermediate', type: 'Strength' }
  ]
};

// --- SVG BODY COMPONENTS ---
// UPDATED: Uses 'animate' prop for instant color switching logic
const BodyFront = ({ onPartClick, activePart }) => (
  <svg viewBox="0 0 200 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
    <circle cx="100" cy="35" r="25" fill="#e2e8f0" />
    <path d="M70,70 Q100,60 130,70 L120,180 Q100,190 80,180 Z" fill="#e2e8f0" />

    {/* Interactive Parts */}
    <motion.path 
      d="M60,75 Q50,75 40,90 L50,110 L70,80 Z M140,75 Q150,75 160,90 L150,110 L130,80 Z"
      animate={{ fill: activePart === 'shoulders' ? '#D32F2F' : '#94a3b8' }}
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }}
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('shoulders')}
    />
    <motion.path 
      d="M40,90 L30,160 L50,160 L60,90 Z M160,90 L170,160 L150,160 L140,90 Z"
      animate={{ fill: activePart === 'biceps' ? '#D32F2F' : '#cbd5e1' }}
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }}
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('biceps')}
    />
    <motion.path 
      d="M80,180 L70,300 L90,300 L95,185 Z M120,180 L130,300 L110,300 L105,185 Z"
      animate={{ fill: activePart === 'legs' ? '#D32F2F' : '#cbd5e1' }}
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }}
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('legs')}
    />
  </svg>
);

const BodyBack = ({ onPartClick, activePart }) => (
  <svg viewBox="0 0 200 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
    <circle cx="100" cy="35" r="25" fill="#e2e8f0" />
    <motion.path 
      d="M70,70 L130,70 L120,180 L80,180 Z" 
      animate={{ fill: activePart === 'back' ? '#D32F2F' : '#cbd5e1' }} 
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }} 
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('back')} 
    />
    <motion.path 
      d="M60,75 L40,90 L50,110 L70,80 Z M140,75 L160,90 L150,110 L130,80 Z" 
      animate={{ fill: activePart === 'shoulders' ? '#D32F2F' : '#94a3b8' }} 
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }} 
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('shoulders')} 
    />
    <motion.path 
      d="M80,180 L70,300 L90,300 L95,185 Z M120,180 L130,300 L110,300 L105,185 Z" 
      animate={{ fill: activePart === 'legs' ? '#D32F2F' : '#e2e8f0' }} 
      whileHover={{ scale: 1.02, fill: '#ef4444', cursor: 'pointer' }} 
      transition={{ duration: 0.2 }}
      onClick={() => onPartClick('legs')} 
    />
  </svg>
);

const TherapistAssignmentManager = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interface State
  const [view, setView] = useState('front'); 
  const [activeMuscle, setActiveMuscle] = useState(null);
  const [assignedExercises, setAssignedExercises] = useState([]);
  const [durations, setDurations] = useState({}); // Stores duration per exercise ID

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/therapist/patients');
        setPatients(res.data.patients || res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // --- HANDLERS ---
  const handleDurationChange = (id, days) => {
    setDurations(prev => ({ ...prev, [id]: days }));
  };

  const handleAssign = (exercise) => {
    const duration = durations[exercise.id] || 7; // Default to 7 days if not set
    const newAssignment = { 
        ...exercise, 
        duration,
        timestamp: Date.now() 
    };
    setAssignedExercises([...assignedExercises, newAssignment]);
    
    // API Call would go here:
    // axios.post('/api/assign', { patient: selectedPatient.email, exercise: exercise.id, duration });
  };

  // --- FILTER & SORT LOGIC ---
  const visiblePatients = useMemo(() => {
    let result = [...patients];

    if (searchQuery) {
      return result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return result
        .sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined))
        .slice(0, 5);
    }
  }, [patients, searchQuery]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Clinical Data...</div>;

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div>
          <button 
            onClick={() => selectedPatient ? setSelectedPatient(null) : navigate('/therapist-dashboard')} 
            style={styles.backButton}
          >
            <ChevronRight style={{ transform: 'rotate(180deg)' }} size={16}/> 
            {selectedPatient ? 'Back to Directory' : 'Dashboard'}
          </button>
          <h1 style={styles.title}>
            {selectedPatient ? `Prescription: ${selectedPatient.name}` : 'Patient Directory'}
          </h1>
        </div>
        {selectedPatient && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Assigned Today</div>
               <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.2rem' }}>{assignedExercises.length} Exercises</div>
             </div>
             <div style={styles.avatarSmall}>
               {selectedPatient.name.charAt(0)}
             </div>
           </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.main}>
        
        {/* VIEW 1: PATIENT DIRECTORY */}
        {!selectedPatient && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* GLASSMORPHIC SEARCH BAR */}
            <div style={styles.searchContainer}>
               <div style={styles.glassSearch}>
                <Search style={{ color: 'var(--primary-color)', opacity: 0.7 }} size={22} />
                <input 
                  type="text" 
                  placeholder="Search patient records..." 
                  style={styles.transparentInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
               </div>
            </div>

            {/* SECTION LABEL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingLeft: '10px' }}>
              <Sparkles size={16} color="var(--primary-color)" />
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {searchQuery ? 'Search Results' : 'New Arrivals'}
              </h3>
            </div>

            {/* PATIENT LIST */}
            <div style={styles.cardList}>
              {visiblePatients.map((p, index) => (
                <motion.div 
                  key={p.email} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPatient(p)}
                  style={styles.patientRow}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={styles.avatarRow}>{p.name.charAt(0)}</div>
                  <div style={{ flex: 1, marginLeft: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14}/> {p.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14}/> {p.date_joined}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                    backgroundColor: p.status === 'High Risk' ? '#fee2e2' : '#f0fdf4',
                    color: p.status === 'High Risk' ? '#ef4444' : '#166534',
                    border: '1px solid',
                    borderColor: p.status === 'High Risk' ? '#fecaca' : '#dcfce7'
                  }}>
                    {p.status || 'Normal'}
                  </span>
                  <ChevronRight style={{ marginLeft: '20px', color: '#cbd5e1' }} />
                </motion.div>
              ))}
              {visiblePatients.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No patients found.</div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: ANATOMY ASSIGNMENT */}
        {selectedPatient && (
          <div style={{ display: 'flex', gap: '30px', height: 'calc(100vh - 140px)', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* LEFT: BODY MODEL */}
            <div style={{ ...styles.card, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              
              <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '5px', zIndex: 10 }}>
                <button onClick={() => setView('front')} style={view === 'front' ? styles.toggleActive : styles.toggleInactive}>Front</button>
                <button onClick={() => setView('back')} style={view === 'back' ? styles.toggleActive : styles.toggleInactive}>Back</button>
              </div>

              <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                <p>Select muscle groups to assign exercises.</p>
              </div>

              <div style={{ height: '500px', width: '250px' }}>
                <AnimatePresence mode='wait'>
                  <motion.div 
                    key={view}
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {view === 'front' ? (
                      <BodyFront onPartClick={setActiveMuscle} activePart={activeMuscle} />
                    ) : (
                      <BodyBack onPartClick={setActiveMuscle} activePart={activeMuscle} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: EXERCISE PANEL */}
            <motion.div 
              style={{ width: '400px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {activeMuscle ? (
                <>
                  <div style={{ padding: '20px', backgroundColor: 'var(--text-primary)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h2 style={{ margin: 0, textTransform: 'capitalize', fontFamily: 'Georgia, serif' }}>{activeMuscle}</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>Select exercises to assign</p>
                      </div>
                      <button onClick={() => setActiveMuscle(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
                    </div>
                  </div>
                  
                  <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {MUSCLE_EXERCISE_MAP[activeMuscle]?.map(ex => {
                      const isAssigned = assignedExercises.find(a => a.id === ex.id);
                      return (
                        <div key={ex.id} style={styles.exerciseCard}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{ex.name}</strong>
                            <span style={styles.difficultyBadge}>{ex.difficulty}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{ex.type} • 3 Sets x 10 Reps</p>
                          
                          {/* DURATION INPUT */}
                          {!isAssigned && (
                            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                              <Clock size={16} color="var(--primary-color)" />
                              <span style={{ color: 'var(--text-secondary)' }}>For:</span>
                              <input 
                                type="number" 
                                min="1" 
                                max="365"
                                value={durations[ex.id] || 7}
                                onChange={(e) => handleDurationChange(ex.id, e.target.value)}
                                style={styles.durationInput}
                              />
                              <span style={{ color: 'var(--text-secondary)' }}>Days</span>
                            </div>
                          )}

                          <button 
                            onClick={() => handleAssign(ex)}
                            disabled={!!isAssigned}
                            style={isAssigned ? styles.btnAssigned : styles.btnAssign}
                          >
                            {isAssigned ? (
                              <><CheckCircle size={16}/> Assigned ({isAssigned.duration} Days)</>
                            ) : (
                              <>Assign <ArrowRight size={16}/></>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#ccc', textAlign: 'center' }}>
                  <Layers size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                  <p>Select a muscle group on the model to view exercises.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  container: { minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'Inter, sans-serif' },
  header: { backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 20 },
  backButton: { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 500 },
  title: { margin: '5px 0 0 0', fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'Georgia, serif' },
  main: { padding: '30px' },
  
  // GLASSMORPHIC SEARCH
  searchContainer: { marginBottom: '30px' },
  glassSearch: {
    display: 'flex', alignItems: 'center', gap: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.65)', 
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '16px 24px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', 
    border: '1px solid rgba(255, 255, 255, 0.4)',
    transition: 'all 0.3s ease'
  },
  transparentInput: {
    border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', width: '100%', color: 'var(--text-primary)', fontFamily: 'Georgia, serif'
  },

  // LIST STYLES
  cardList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  patientRow: { 
    display: 'flex', alignItems: 'center', padding: '20px', 
    backgroundColor: 'rgba(255,255,255,0.6)', 
    borderRadius: '16px', 
    cursor: 'pointer', 
    transition: 'all 0.2s ease',
    border: '1px solid rgba(255,255,255,0.8)'
  },
  avatarRow: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #e2e8f0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Georgia, serif' },
  avatarSmall: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  
  // ASSIGNMENT STYLES
  card: { backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)' },
  toggleActive: { padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: 'var(--text-primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontWeight: 'bold', cursor: 'pointer', color: 'white' },
  toggleInactive: { padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' },
  exerciseCard: { border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px', marginBottom: '16px', transition: '0.2s', backgroundColor: '#fafafa' },
  difficultyBadge: { fontSize: '0.7rem', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '6px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' },
  durationInput: { padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', width: '50px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-color)' },
  btnAssign: { width: '100%', padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(118, 176, 65, 0.2)' },
  btnAssigned: { width: '100%', padding: '12px', backgroundColor: '#dcfce7', color: '#166534', border: 'none', borderRadius: '10px', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }
};

export default TherapistAssignmentManager;