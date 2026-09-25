import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.js';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, deptKey?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNav = (view: string, deptKey?: string) => {
    setMobileMenuOpen(false);
    setDeptOpen(false);
    onNavigate(view, deptKey);
  };

  const handleDeptClick = (deptKey: string) => {
    setDeptOpen(false);
    setMobileMenuOpen(false);
    onNavigate('about', deptKey);
  };

  return (
    <>
      <header className="app-header">
        <div className="brand" onClick={() => handleNav('home')}>
          <img src="/logo.png" alt="ritresources" className="brand-logo" />
          <div className="brand-name">RITRESOURCES</div>
        </div>

        {/* Desktop Pill Navigation */}
        <nav className="pillnav">
          <button
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentView === 'resources' ? 'active' : ''}`}
            onClick={() => handleNav('resources')}
          >
            Resources
          </button>
          <button
            className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => handleNav('upload')}
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
            onClick={() => handleNav('about')}
          >
            About
          </button>
          <button
            className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => handleNav('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="header-right">
          {user?.loggedIn ? (
            <div className="user-badge">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-name-text">{user.name}</span>
              <button className="btn-logout" title="Sign Out" onClick={() => logout()}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <button className="cta-login" id="loginBtn" onClick={() => handleNav('login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
              <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="drawer-header">
          <div className="brand" onClick={() => handleNav('home')}>
            <img src="/logo.png" alt="ritresources" className="brand-logo" />
            <div className="brand-name">RITRESOURCES</div>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="drawer-nav">
          <button
            className={`drawer-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>

          <button
            className={`drawer-link ${currentView === 'resources' ? 'active' : ''}`}
            onClick={() => handleNav('resources')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Browse Resources
          </button>

          <button
            className={`drawer-link ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => handleNav('upload')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 8a4.5 4.5 0 0 1-.5 9H7z" />
              <path d="M12 12v6M9 15l3-3 3 3" />
            </svg>
            Upload Resource
          </button>

          {/* Mobile Departments Collapsible */}
          <div className="drawer-dept-section">
            <button
              className={`drawer-link drawer-dept-toggle ${mobileDeptOpen ? 'open' : ''}`}
              onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
            >
              <div className="drawer-link-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                Departments
              </div>
              <svg className="drawer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {mobileDeptOpen && (
              <div className="drawer-dept-sublist">
                <button onClick={() => handleDeptClick('CSBS')}>
                  <strong>CSBS</strong> <span>Computer Science &amp; Business Systems</span>
                </button>
                <button onClick={() => handleDeptClick('CSE')}>
                  <strong>CSE</strong> <span>Computer Science &amp; Engineering</span>
                </button>
                <button onClick={() => handleDeptClick('AIDS')}>
                  <strong>AI &amp; DS</strong> <span>Artificial Intelligence &amp; Data Science</span>
                </button>
                <button onClick={() => handleDeptClick('AIML')}>
                  <strong>AI &amp; ML</strong> <span>Artificial Intelligence &amp; Machine Learning</span>
                </button>
                <button onClick={() => handleDeptClick('VLSI')}>
                  <strong>VLSI Design</strong> <span>VLSI &amp; Embedded Systems</span>
                </button>
              </div>
            )}
          </div>

          <button
            className={`drawer-link ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => handleNav('about')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            About
          </button>

          <button
            className={`drawer-link ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => handleNav('contact')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact
          </button>
        </nav>

        <div className="drawer-footer">
          {user?.loggedIn ? (
            <div className="drawer-user-info">
              <div className="drawer-user-row">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="drawer-user-meta">
                  <div className="drawer-user-name">{user.name}</div>
                  {user.email && <div className="drawer-user-email">{user.email}</div>}
                </div>
              </div>
              <button className="btn-drawer-logout" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary drawer-login-btn" onClick={() => handleNav('login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
              </svg>
              Login to ritresources
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
