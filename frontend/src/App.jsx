// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { GoogleOAuthProvider } from '@react-oauth/google'; 

// Dashboard components
import PatientDashboard from './Dashboard'; 
import TherapistDashboard from './TherapistDashboard'; 
import HomeRedirect from './HomeRedirect'; 

// Therapist-Only Pages
import TherapistPatientMonitoring from './pages/TherapistPatientMonitoring.jsx'; 
import TherapistExerciseLibrary from './pages/TherapistExerciseLibrary.jsx';
import TherapistProtocolManager from './pages/TherapistProtocolManager.jsx';
import TherapistNotificationLog from './pages/TherapistNotificationLog.jsx';
import TherapistAnalytics from './pages/TherapistAnalytics.jsx'; // NEW IMPORT
import SessionReviewScreen from './components/SessionReviewScreen.jsx'; // NEW IMPORT


import Tracker from './Tracker';
import Report from './Report';
import Tutorial from './Tutorial'; 
import Profile from './pages/Profile';
import Analytics from './pages/Analytics'; // Daily Report Graphs
import RiskPrediction from './pages/RiskPrediction'; // AI Recovery Page
import Navbar from './components/Navbar';
import * as Pages from './pages/PlaceholderPages';

// ✅ YOUR GOOGLE CLIENT ID
const GOOGLE_CLIENT_ID = "254404106678-ql7lb3kidfsvdjk5a4fcjl7t7kn61aos.apps.googleusercontent.com"; 

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navbar only on the active tracking page to maximize screen space
  const showNavbar = location.pathname !== '/track';

  return (
    <>
      {showNavbar && <Navbar />}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* --- MAIN ENTRY POINT --- */}
              <Route path="/" element={<HomeRedirect />} />
              
              {/* --- DASHBOARDS --- */}
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
              
              {/* --- THERAPIST-ONLY ROUTES --- */}
              <Route path="/therapist/monitoring" element={<TherapistPatientMonitoring />} /> 
              <Route path="/therapist/library" element={<TherapistExerciseLibrary />} />
              <Route path="/therapist/protocols" element={<TherapistProtocolManager />} />
              <Route path="/therapist/notifications" element={<TherapistNotificationLog />} />
              <Route path="/therapist/analytics" element={<TherapistAnalytics />} />
              <Route path="/therapist/session-review/:sessionId" element={<SessionReviewScreen onClose={() => { /* Mock close logic */ }} sessionId="MOCK_ID_123" />} /> {/* NEW ROUTE */}


              {/* --- Other Main Pages --- */}
              <Route path="/track" element={<Tracker />} />
              <Route path="/report" element={<Report />} />
              
              {/* --- Training Section --- */}
              <Route path="/training/library" element={<Tutorial />} /> 
              <Route path="/training/detail" element={<Pages.ExerciseDetail />} />
              
              {/* --- Authentication --- */}
              <Route path="/auth/login" element={<Pages.Login />} />
              <Route path="/auth/signup" element={<Pages.Signup />} />
              <Route path="/auth/onboarding" element={<Pages.Onboarding />} />

              {/* --- Profile --- */}
              <Route path="/profile/overview" element={<Profile />} />
              <Route path="/profile/medical" element={<Pages.MedicalInfo />} />
              <Route path="/profile/preferences" element={<Pages.Preferences />} />

              {/* --- Programs --- */}
              <Route path="/programs/my-programs" element={<Pages.MyPrograms />} />
              <Route path="/programs/custom" element={<Pages.CustomProgram />} />

              {/* --- ANALYTICS ROUTES (Existing Patient Routes) --- */}
              <Route path="/analytics/accuracy" element={<Analytics />} />
              <Route path="/analytics/risk" element={<RiskPrediction />} />

              {/* --- Community --- */}
              <Route path="/community/achievements" element={<Pages.Achievements />} />
              <Route path="/community/challenges" element={<Pages.Challenges />} />
              <Route path="/community/therapist" element={<Pages.TherapistModule />} />

              {/* --- Support --- */}
              <Route path="/support/faq" element={<Pages.FAQ />} />
              <Route path="/support/contact" element={<Pages.Contact />} />
              <Route path="/support/legal" element={<Pages.Legal />} />

              <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;