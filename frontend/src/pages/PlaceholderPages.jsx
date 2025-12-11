import React from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ title, subtitle, color = "var(--primary-color)" }) => (
  <div style={{ padding: '60px', maxWidth: '1000px', margin: '0 auto' }}>
    <motion.h1 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ fontSize: '3rem', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: '900' }}
    >
      {title} <span style={{ color }}>.</span>
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}
    >
      {subtitle}
    </motion.p>
    <div style={{ 
        padding: '60px', 
        background: 'var(--card-bg)', 
        border: '1px dashed #ccc', 
        borderRadius: '20px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
    }}>
        Content for <strong>{title}</strong> is coming soon.
    </div>
  </div>
);

// --- Auth ---
export const Login = () => <PageLayout title="Login" subtitle="Access your recovery journey" />;
export const Signup = () => <PageLayout title="Create Account" subtitle="Join PhysioCheck today" />;
export const Onboarding = () => <PageLayout title="Onboarding" subtitle="Let's get you set up" />;

// --- Profile ---
export const ProfileOverview = () => <PageLayout title="Profile Overview" subtitle="Your stats and personal details" />;
export const MedicalInfo = () => <PageLayout title="Medical Info" subtitle="Your history and constraints" color="#D32F2F" />;
export const Preferences = () => <PageLayout title="Preferences" subtitle="Customize your experience" />;

// --- Training ---
export const ExerciseDetail = () => <PageLayout title="Exercise Detail" subtitle="Deep dive into technique" />;

// --- Programs ---
export const MyPrograms = () => <PageLayout title="My Programs" subtitle="Your assigned routines" />;
export const CustomProgram = () => <PageLayout title="Custom Program" subtitle="Build your own workflow" />;

// --- Analytics ---
export const AccuracyGraphs = () => <PageLayout title="Accuracy Graphs" subtitle="Visualizing your form improvement" />;
export const RiskPrediction = () => <PageLayout title="Risk Prediction" subtitle="AI-based injury prevention analysis" color="#D32F2F" />;

// --- Community ---
export const Achievements = () => <PageLayout title="Achievements" subtitle="Badges and milestones" color="#FFD700" />;
export const Challenges = () => <PageLayout title="Challenges" subtitle="Compete with the community" />;
export const TherapistModule = () => <PageLayout title="Therapist Portal" subtitle="Patient monitoring dashboard" />;

// --- Support ---
export const FAQ = () => <PageLayout title="FAQ" subtitle="Frequently Asked Questions" />;
export const Contact = () => <PageLayout title="Contact Support" subtitle="We are here to help" />;
export const Legal = () => <PageLayout title="Legal" subtitle="Terms of Service & Privacy Policy" />;