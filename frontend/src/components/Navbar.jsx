import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Activity, User, BookOpen, BarChart2, Users, LifeBuoy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ title, icon: Icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="nav-item"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', cursor: 'pointer', padding: '10px 15px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '600' }}>
        {Icon && <Icon size={18} color="var(--primary-color)" />}
        {title}
        {items && <ChevronDown size={14} style={{ opacity: 0.5 }} />}
      </div>

      <AnimatePresence>
        {isOpen && items && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: '220px',
              background: 'var(--card-bg)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '12px',
              boxShadow: '0 15px 40px rgba(26,60,52,0.1)',
              padding: '10px 0',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {items.map((sub, idx) => (
              <Link 
                key={idx} 
                to={sub.path}
                style={{ 
                  display: 'block', 
                  padding: '12px 20px', 
                  color: 'var(--text-secondary)', 
                  textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'var(--bg-color)'; e.target.style.color = 'var(--primary-color)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}
              >
                {sub.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav style={{ 
      height: '80px', 
      background: 'rgba(249, 247, 242, 0.9)', /* Creamy semi-transparent */
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      backdropFilter: 'blur(10px)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-1px' }}>
          PHYSIO<span style={{ color: 'var(--primary-color)' }}>CHECK</span>
        </h2>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <NavItem title="Profile" icon={User} items={[
           { name: 'Overview', path: '/profile/overview' },
           { name: 'Medical Info', path: '/profile/medical' },
           { name: 'Preferences', path: '/profile/preferences' }
        ]} />
        
        <NavItem title="Training" icon={Activity} items={[
           { name: 'Exercise Library', path: '/training/library' },
           { name: 'Live Session', path: '/track' },
        ]} />

        <NavItem title="Programs" icon={BookOpen} items={[
           { name: 'My Programs', path: '/programs/my-programs' },
           { name: 'Custom Program', path: '/programs/custom' }
        ]} />

        <NavItem title="Analytics" icon={BarChart2} items={[
           { name: 'Daily Report', path: '/report' },
           { name: 'Risk Prediction', path: '/analytics/risk' }
        ]} />

        <NavItem title="Community" icon={Users} items={[
           { name: 'Achievements', path: '/community/achievements' },
           { name: 'Therapist', path: '/community/therapist' }
        ]} />
        
        <NavItem title="Support" icon={LifeBuoy} items={[
           { name: 'Contact', path: '/support/contact' }
        ]} />
      </div>

      {/* Auth Buttons */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/auth/login" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-primary)', 
            fontWeight: '700', 
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center'
        }}>Login</Link>
        
        <Link to="/auth/signup" style={{ 
            textDecoration: 'none', 
            background: 'var(--primary-color)', 
            color: '#fff', 
            padding: '10px 24px', 
            borderRadius: '30px', 
            fontWeight: '700',
            boxShadow: '0 4px 14px rgba(118, 176, 65, 0.4)' 
        }}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;