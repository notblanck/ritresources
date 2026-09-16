import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.js';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, deptKey?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [deptOpen, setDeptOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDeptOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDeptClick = (deptKey: string) => {
    setDeptOpen(false);
    onNavigate('about', deptKey);
  };

  return (
    <header className="app-header">
      <div className="brand" onClick={() => onNavigate('home')}>
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>
        </div>
        <div className="brand-name">REWARE</div>
      </div>

      <nav className="pillnav">
        <button
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={`nav-link ${currentView === 'resources' ? 'active' : ''}`}
          onClick={() => onNavigate('resources')}
        >
          Resources
        </button>
        <button
          className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
          onClick={() => onNavigate('upload')}
        >
          Upload
        </button>

        <div className={`dept-dropdown ${deptOpen ? 'open' : ''}`} ref={dropdownRef}>
          <button
            className="nav-link"
            id="deptToggle"
            onClick={(e) => {
              e.stopPropagation();
              setDeptOpen(!deptOpen);
            }}
          >
            Departments{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="dept-menu" id="deptMenu">
            <button onClick={() => handleDeptClick('CSBS')}>
              CSBS <span>Computer Science &amp; Business Systems</span>
            </button>
            <button onClick={() => handleDeptClick('CSE')}>
              CSE <span>Computer Science &amp; Engineering</span>
            </button>
            <button onClick={() => handleDeptClick('AIDS')}>
              AI &amp; DS <span>Artificial Intelligence &amp; Data Science</span>
            </button>
            <button onClick={() => handleDeptClick('AIML')}>
              AI &amp; ML <span>Artificial Intelligence &amp; Machine Learning</span>
            </button>
            <button onClick={() => handleDeptClick('VLSI')}>
              VLSI Design <span>VLSI &amp; Embedded Systems</span>
            </button>
          </div>
        </div>

        <button
          className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
          onClick={() => onNavigate('about')}
        >
          About
        </button>
        <button
          className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
          onClick={() => onNavigate('contact')}
        >
          Contact
        </button>
      </nav>

      <div className="header-right">
        {user?.loggedIn ? (
          <div className="user-badge">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span>{user.name}</span>
            <button className="btn-logout" title="Sign Out" onClick={() => logout()}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="cta-login" id="loginBtn" onClick={() => onNavigate('login')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
            Login
          </button>
        )}
      </div>
    </header>
  );
};
