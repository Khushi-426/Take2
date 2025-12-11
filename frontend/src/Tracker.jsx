import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowLeft, Maximize, PlayCircle, StopCircle } from 'lucide-react';

const Tracker = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [feedback, setFeedback] = useState("Press Start");
  
  // NEW: State to force video reload
  const [videoTimestamp, setVideoTimestamp] = useState(Date.now()); 
  
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  // Start/Stop Logic
  const toggleTracking = async () => {
    if (active) {
      // STOP SESSION
      try {
          await fetch('http://localhost:5000/stop_tracking');
      } catch(e) { console.error(e) }
      
      setActive(false);
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      navigate('/report'); 
    } else {
      // START SESSION
      try {
          const res = await fetch('http://localhost:5000/start_tracking');
          const json = await res.json();
          if (json.status === 'success') {
            // FIX: Update timestamp to force video reload
            setVideoTimestamp(Date.now()); 
            setActive(true);
            setSessionTime(0);
            intervalRef.current = setInterval(fetchData, 100);
            timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
          }
      } catch (e) {
          alert("Backend error. Check console.");
      }
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/data_feed');
      const json = await res.json();
      setData(json);
      
      if (json.status === 'COUNTDOWN') {
        setFeedback(`Starting in ${json.remaining}...`);
      } else if (json.status === 'ACTIVE') {
        let msg = "MAINTAIN FORM";
        let color = "#76B041"; // Success Green

        if (json.RIGHT.feedback) { msg = `RIGHT: ${json.RIGHT.feedback}`; color = "#D32F2F"; }
        else if (json.LEFT.feedback) { msg = `LEFT: ${json.LEFT.feedback}`; color = "#D32F2F"; }
        
        setFeedback(msg);
        const fbBox = document.getElementById('feedback-box');
        if(fbBox) {
            fbBox.style.color = color;
            fbBox.style.borderColor = color;
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    return () => { clearInterval(intervalRef.current); clearInterval(timerRef.current); }
  }, []);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--bg-color)' }}>
      
      {/* SIDEBAR */}
      <div style={{ 
          width: '340px', 
          background: 'var(--card-bg)', 
          borderRight: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '10px 0 30px rgba(0,0,0,0.02)',
          zIndex: 10
      }}>
        
        {/* Header / Timer */}
        <div style={{ padding: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--primary-color)', fontSize: '2rem', fontWeight: '800' }}>
            <Timer size={28} />
            {formatTime(sessionTime)}
          </div>
          <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', marginTop:'5px', letterSpacing:'1px', fontWeight:'600'}}>ACTIVE SESSION</div>
        </div>

        {/* Scrollable Metrics Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
            {['RIGHT', 'LEFT'].map(arm => {
                const metrics = data ? data[arm] : null;
                const color = 'var(--primary-color)';
                
                return (
                <div key={arm} style={{ marginBottom: '25px', background: 'var(--bg-color)', borderRadius: '18px', padding: '20px', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                        {arm} ARM
                        <span style={{color:'var(--primary-color)'}}>{metrics ? metrics.stage : '--'}</span>
                    </h3>
                    
                    {/* Primary Stats */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700' }}>REPS</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics ? metrics.rep_count : '--'}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700' }}>ANGLE</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{metrics ? metrics.angle : '--'}°</div>
                        </div>
                    </div>

                    {/* Angle Visual Bar */}
                    <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '15px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: metrics ? `${(metrics.angle / 180) * 100}%` : '0%', 
                            height: '100%', background: color, transition: 'width 0.1s linear', borderRadius: '4px'
                        }} />
                    </div>

                    {/* Detailed Time Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', color: '#aaa' }}>
                        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'center', boxShadow:'0 2px 5px rgba(0,0,0,0.03)' }}>
                            <div style={{color:'var(--text-secondary)'}}>TEMPO</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight:'bold' }}>{metrics && metrics.curr_rep_time > 0 ? metrics.curr_rep_time.toFixed(1) : '--'}s</div>
                        </div>
                        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', textAlign: 'center', boxShadow:'0 2px 5px rgba(0,0,0,0.03)' }}>
                            <div style={{color:'var(--text-secondary)'}}>BEST</div>
                            <div style={{ color: 'var(--primary-color)', fontWeight:'bold' }}>{metrics && metrics.min_rep_time > 0 ? metrics.min_rep_time.toFixed(1) : '--'}s</div>
                        </div>
                    </div>
                </div>
            )})}
        </div>

        {/* Footer Controls */}
        <div style={{ padding: '25px', background: 'var(--card-bg)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <button 
                onClick={toggleTracking}
                style={{ 
                    width: '100%', padding: '16px', borderRadius: '50px', border: 'none', 
                    fontWeight: '800', cursor: 'pointer', fontSize: '1rem',
                    background: active ? '#D32F2F' : 'var(--primary-color)', 
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 8px 20px rgba(118, 176, 65, 0.3)',
                    transition: 'all 0.2s'
                }}
            >
                {active ? <><StopCircle size={20}/> END SESSION</> : <><PlayCircle size={20}/> START SESSION</>}
            </button>
            <div 
                onClick={() => navigate('/')} 
                style={{ textAlign: 'center', marginTop: '15px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: '600' }}>
                <ArrowLeft size={16} /> Exit to Dashboard
            </div>
        </div>
      </div>

      {/* VIDEO AREA */}
      <div style={{ flex: 1, position: 'relative', background: 'var(--bg-color)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Video Container Frame */}
        <div style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '30px', 
            overflow: 'hidden', 
            background: '#F0F4F0',
            position: 'relative',
            boxShadow: active ? '0 20px 50px rgba(118, 176, 65, 0.15)' : 'none',
            border: active ? 'none' : '2px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {active ? (
            // FIX: Added videoTimestamp to force reload
            <img 
                src={`http://localhost:5000/video_feed?t=${videoTimestamp}`} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    background: '#000' 
                }} 
                alt="Stream"
            />
            ) : (
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <Maximize size={48} style={{ color: 'var(--primary-color)' }} />
                </div>
                <h2 style={{color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '10px'}}>Ready to Workout</h2>
                <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>Ensure your upper body is clearly visible</p>
            </div>
            )}

            {/* FEEDBACK OVERLAY */}
            {active && (
                <div id="feedback-box" style={{ 
                position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.9)', padding: '15px 50px', borderRadius: '50px',
                fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'all 0.2s', border: '1px solid rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)'
                }}>
                {feedback}
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default Tracker;