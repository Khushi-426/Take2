import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAICommentary } from '../services/aiService';
import { Mic, Radio, AlertTriangle } from 'lucide-react';

const RobotAvatar = ({ state }) => {
    // States: 'IDLE', 'LISTENING', 'SPEAKING', 'THINKING', 'ERROR'
    const glowVariants = {
        IDLE: { scale: [1, 1.05, 1], opacity: 0.1, transition: { duration: 2, repeat: Infinity } },
        LISTENING: { scale: [1, 1.2, 1], opacity: 0.6, fill: "#2196F3", transition: { duration: 1, repeat: Infinity } },
        SPEAKING: { scale: [1, 1.1, 1], opacity: 0.4, fill: "#69B341", transition: { duration: 0.5, repeat: Infinity } },
        THINKING: { scale: [1, 0.9, 1], opacity: 0.5, fill: "#FF9800", transition: { duration: 0.8, repeat: Infinity } },
        ERROR: { scale: [1, 1.1, 1], opacity: 0.5, fill: "#D32F2F", transition: { duration: 0.5, repeat: Infinity } }
    };

    return (
        <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle cx="100" cy="100" r="90" fill="#69B341" variants={glowVariants} animate={state} />
            <circle cx="100" cy="110" r="50" fill="#fff" stroke="#1A3C34" strokeWidth="4"/>
            <path d="M50 110 Q30 110 30 140" stroke="#1A3C34" strokeWidth="4" strokeLinecap="round"/>
            <path d="M150 110 Q170 110 170 140" stroke="#1A3C34" strokeWidth="4" strokeLinecap="round"/>
            <motion.g animate={{ y: state === 'SPEAKING' ? [0, -2, 0] : 0 }}>
                <rect x="60" y="40" width="80" height="70" rx="20" fill="#1A3C34"/>
                <rect x="65" y="45" width="70" height="60" rx="15" fill="#222"/>
                <motion.circle cx="85" cy="70" r="8" fill={state === 'LISTENING' ? '#2196F3' : (state === 'ERROR' ? '#D32F2F' : '#00E676')} animate={{ scaleY: state === 'SPEAKING' ? [1, 0.1, 1] : 1 }} />
                <motion.circle cx="115" cy="70" r="8" fill={state === 'LISTENING' ? '#2196F3' : (state === 'ERROR' ? '#D32F2F' : '#00E676')} animate={{ scaleY: state === 'SPEAKING' ? [1, 0.1, 1] : 1 }} />
                <motion.rect x="90" y="90" width="20" height="4" rx="2" fill={state === 'ERROR' ? '#D32F2F' : '#00E676'} animate={{ height: state === 'SPEAKING' ? [4, 12, 4] : 4, width: state === 'SPEAKING' ? [20, 24, 20] : 20, x: state === 'SPEAKING' ? [90, 88, 90] : 90 }} />
            </motion.g>
            <line x1="100" y1="40" x2="100" y2="20" stroke="#1A3C34" strokeWidth="4"/>
            <motion.circle cx="100" cy="15" r="6" fill="#D32F2F" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
        </svg>
    );
};

const AICoach = ({ data, feedback, exerciseName, active, gesture, onCommand, onListeningChange }) => {
    const [message, setMessage] = useState("Standing by...");
    const [botState, setBotState] = useState('IDLE'); 
    const [micError, setMicError] = useState(false);
    
    const recognitionRef = useRef(null);
    const isListeningForWakeWord = useRef(true);
    const isBotSpeaking = useRef(false); // [FIX] New Flag to ignore self-voice
    const lastGestureRef = useRef(null);
    const listenTimeoutRef = useRef(null);
    const lastFeedbackRef = useRef("");
    const lastRepTotalRef = useRef(0);

    // --- 1. SEAMLESS TTS LOGIC (FIXED) ---
    const speak = (text, onEndCallback = null) => {
        if (!window.speechSynthesis) return;
        
        // [FIX] DO NOT STOP RECOGNITION HERE
        // Instead, mark that bot is speaking so we can ignore its voice in onResult
        isBotSpeaking.current = true;

        window.speechSynthesis.cancel();
        setBotState('SPEAKING');
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; 
        
        utterance.onend = () => {
            isBotSpeaking.current = false; // [FIX] Bot finished speaking

            // Only reset state if we are technically still "speaking" visually
            setBotState(prevState => {
                if (prevState === 'SPEAKING') return 'IDLE';
                return prevState;
            });

            if (onEndCallback) {
                onEndCallback();
            } else {
                // If not waiting for a specific answer, return to Wake Word mode
                if (!listenTimeoutRef.current) {
                    isListeningForWakeWord.current = true;
                }
            }
        };
        
        utterance.onerror = () => {
            isBotSpeaking.current = false;
            setBotState('IDLE');
        };

        window.speechSynthesis.speak(utterance);
    };

    // --- 2. ACTIVATION MODES ---
    const activateListeningMode = () => {
        // [FIX] Allow re-triggering even if already false, to reset timer
        console.log("🎤 Listening Mode ACTIVATED");
        isListeningForWakeWord.current = false;
        if (onListeningChange) onListeningChange(true); 
        
        setBotState('LISTENING');
        setMessage("Listening...");
        
        speak("Yes?", () => {
             // Force visual state back to listening after saying "Yes?"
             setBotState('LISTENING');
             startSilenceTimer(); 
        });
    };

    const deactivateListeningMode = () => {
        console.log("🚫 Listening Mode OFF");
        if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
        
        isListeningForWakeWord.current = true;
        setBotState('IDLE');
        if (onListeningChange) onListeningChange(false); 
    };

    const startSilenceTimer = () => {
        if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
        
        listenTimeoutRef.current = setTimeout(() => {
            console.log("⏰ Silence Timeout (7s)");
            speak("Resuming exercise.", () => deactivateListeningMode());
        }, 7000); 
    };

    // --- 3. ROBUST SPEECH RECOGNITION ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicError(true);
            setMessage("No Voice Support");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; 
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Status: Mic Started");
            setMicError(false);
        };

        recognition.onerror = (e) => {
            if (e.error === 'not-allowed') {
                setMicError(true);
                setBotState('ERROR');
                setMessage("Mic Access Denied");
            } else {
                console.log("Mic Error:", e.error);
            }
        };

        recognition.onresult = async (event) => {
            // [FIX] If the bot is currently talking, ignore any input (Echo Cancellation)
            if (isBotSpeaking.current) {
                console.log("Ignored input while speaking.");
                return;
            }

            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log("Heard:", transcript);

            // User spoke -> Reset 7s timer
            if (!isListeningForWakeWord.current) {
                if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
            }

            // A. FAST LOCAL CHECK
            if (isStopCommand(transcript)) { 
                await executeCommand("stop", "Stopping session."); 
                return; 
            }
            if (isRecalibrateCommand(transcript)) { 
                await executeCommand("recalibrate", "Recalibrating now."); 
                return; 
            }

            // B. WAKE WORD CHECK
            if (isListeningForWakeWord.current) {
                if (transcript.includes("madona") || transcript.includes("madonna") || transcript.includes("hey bot")) {
                    activateListeningMode();
                }
            } 
            // C. ACTIVE LISTENING (Gemini)
            else {
                await processSmartQuery(transcript);
            }
        };

        // [FIX] Aggressive Keep-Alive
        recognition.onend = () => {
            console.log("Mic stopped. Restarting...");
            if(active && !micError) {
                try { recognition.start(); } catch(e){ console.log("Restart failed", e); }
            }
        };

        recognitionRef.current = recognition;
        if (active) {
            try { recognition.start(); } catch(e){}
        }

        return () => { 
            if (recognitionRef.current) recognitionRef.current.stop(); 
            if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
        };
    }, [active]);

    // --- 4. GESTURE TRIGGER ---
    useEffect(() => {
        if (gesture === 'V_SIGN' && lastGestureRef.current !== 'V_SIGN') {
            console.log("✌️ V-Sign Detected!");
            activateListeningMode();
        }
        lastGestureRef.current = gesture;
    }, [gesture]);

    const isRecalibrateCommand = (text) => 
        text.includes("calibrate") || text.includes("reset") || text.includes("restart") || 
        text.includes("setup") || text.includes("start over") || text.includes("fix");
        
    const isStopCommand = (text) => 
        text.includes("stop") || text.includes("quit") || text.includes("end session") || text.includes("finish");

    const executeCommand = async (cmd, reply) => {
        if (onCommand) onCommand(cmd.toUpperCase());
        speak(reply, () => deactivateListeningMode());
    };

    // --- SMART QUERY ---
    const processSmartQuery = async (text) => {
        console.log("🧠 Processing Smart Query:", text);
        setBotState('THINKING');
        
        // Local Shortcuts
        if (text.includes("stats") || text.includes("count") || text.includes("reps")) {
            const r = data?.RIGHT?.rep_count || 0;
            const l = data?.LEFT?.rep_count || 0;
            speak(`You have done ${r+l} reps total.`, () => deactivateListeningMode());
            return;
        }

        try {
            const context = { exercise: exerciseName, reps: (data?.LEFT?.rep_count || 0) + (data?.RIGHT?.rep_count || 0) };
            
            // Call Backend
            const aiResponse = await fetchAICommentary(context, text);
            console.log("🤖 Received Response:", aiResponse);
            
            // Parse Action Codes
            if (aiResponse.includes("ACTION: RECALIBRATE")) {
                executeCommand("recalibrate", "On it. Recalibrating.");
            } else if (aiResponse.includes("ACTION: STOP")) {
                executeCommand("stop", "Stopping session.");
            } else if (aiResponse.includes("ACTION: STATS")) {
                const r = data?.RIGHT?.rep_count || 0;
                const l = data?.LEFT?.rep_count || 0;
                speak(`Total reps: ${r+l}.`, () => deactivateListeningMode());
            } else {
                speak(aiResponse, () => deactivateListeningMode());
            }
        } catch (error) {
            console.error("AI Error:", error);
            speak("I'm having trouble connecting.", () => deactivateListeningMode());
        }
    };

    // --- 5. IDLE FEEDBACK ---
    useEffect(() => {
        if (!active || botState !== 'IDLE' || !isListeningForWakeWord.current || isBotSpeaking.current) return;

        const currentReps = (data?.LEFT?.rep_count || 0) + (data?.RIGHT?.rep_count || 0);
        const currentFeedback = feedback;
        
        if (currentReps > lastRepTotalRef.current) {
            lastRepTotalRef.current = currentReps;
            speak(["Nice work!", "Solid rep!", "Keep it up!"][Math.floor(Math.random()*3)]);
            return;
        }

        if (currentFeedback && currentFeedback !== lastFeedbackRef.current) {
             lastFeedbackRef.current = currentFeedback;
             if (!currentFeedback.includes("MAINTAIN") && !currentFeedback.includes("Initializing")) {
                 setMessage(currentFeedback);
                 speak(currentFeedback);
             }
        }
    }, [data, feedback, active]);

    return (
        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(180deg, #F0F8FF 0%, #E6F4EA 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center', position: 'relative', borderTop: '2px solid #eee' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <RobotAvatar state={micError ? 'ERROR' : botState} />
            </motion.div>
            <AnimatePresence mode='wait'>
                <motion.div key={message} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: '#fff', padding: '12px 18px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '15px', maxWidth: '90%', border: '1px solid #e1e1e1' }}>
                    <p style={{ margin: 0, color: '#1A3C34', fontWeight: '600', fontSize: '0.9rem' }}>"{message}"</p>
                </motion.div>
            </AnimatePresence>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.65rem', color: micError ? '#D32F2F' : '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mic size={10} color={botState === 'LISTENING' ? '#2196F3' : '#aaa'} /> 
                {micError ? "MIC ACCESS DENIED" : (botState === 'LISTENING' ? 'LISTENING (7s)' : 'AI ACTIVE')}
            </div>
            {gesture === 'V_SIGN' && <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#E3F2FD', color: '#2196F3', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>✌️ V-Sign</div>}
        </div>
    );
};

export default AICoach;