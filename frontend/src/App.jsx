import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Dashboard from './Dashboard';
import Tracker from './Tracker';
import Report from './Report';
import Tutorial from './Tutorial'; 
import Navbar from './components/Navbar';
import * as Pages from './pages/PlaceholderPages';

// Layout Component to handle Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  // We hide the Navbar ONLY on the immersive 'Tracker' page
  const showNavbar = location.pathname !== '/track';

  return (
    <>
      {showNavbar && <Navbar />}
      {/* Global background color is handled by index.css */}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/track" element={<Tracker />} />
          <Route path="/report" element={<Report />} />
          
          {/* Training Section */}
          <Route path="/training/library" element={<Tutorial />} /> 
          <Route path="/training/detail" element={<Pages.ExerciseDetail />} />
          
          {/* Auth */}
          <Route path="/auth/login" element={<Pages.Login />} />
          <Route path="/auth/signup" element={<Pages.Signup />} />
          <Route path="/auth/onboarding" element={<Pages.Onboarding />} />

          {/* Profile */}
          <Route path="/profile/overview" element={<Pages.ProfileOverview />} />
          <Route path="/profile/medical" element={<Pages.MedicalInfo />} />
          <Route path="/profile/preferences" element={<Pages.Preferences />} />

          {/* Programs */}
          <Route path="/programs/my-programs" element={<Pages.MyPrograms />} />
          <Route path="/programs/custom" element={<Pages.CustomProgram />} />

          {/* Analytics */}
          <Route path="/analytics/accuracy" element={<Pages.AccuracyGraphs />} />
          <Route path="/analytics/risk" element={<Pages.RiskPrediction />} />

          {/* Community */}
          <Route path="/community/achievements" element={<Pages.Achievements />} />
          <Route path="/community/challenges" element={<Pages.Challenges />} />
          <Route path="/community/therapist" element={<Pages.TherapistModule />} />

          {/* Support */}
          <Route path="/support/faq" element={<Pages.FAQ />} />
          <Route path="/support/contact" element={<Pages.Contact />} />
          <Route path="/support/legal" element={<Pages.Legal />} />

          {/* Redirect old tutorial route if necessary */}
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;