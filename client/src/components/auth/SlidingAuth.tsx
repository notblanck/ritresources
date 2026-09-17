import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface SlidingAuthProps {
  onBackToHome: () => void;
  onSuccess: () => void;
}

export const SlidingAuth: React.FC<SlidingAuthProps> = ({ onBackToHome, onSuccess }) => {
  const { login, signup } = useAuth();
  const { showToast } = useToast();

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Welcome to ritresources!');
  const [shakeSignIn, setShakeSignIn] = useState(false);
  const [shakeSignUp, setShakeSignUp] = useState(false);

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setShowSuccessOverlay(true);
    setTimeout(() => {
      setShowSuccessOverlay(false);
      onSuccess();
    }, 1800);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setShakeSignIn(true);
      setTimeout(() => setShakeSignIn(false), 400);
      showToast('Please enter both email and password.');
      return;
    }

    try {
      await login(signInEmail.trim(), signInPassword);
      triggerSuccess('Welcome back to ritresources!');
    } catch (err: any) {
      setShakeSignIn(true);
      setTimeout(() => setShakeSignIn(false), 400);
      showToast(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirm) {
      setShakeSignUp(true);
      setTimeout(() => setShakeSignUp(false), 400);
      showToast('Please fill in all fields.');
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      setShakeSignUp(true);
      setTimeout(() => setShakeSignUp(false), 400);
      showToast('Passwords do not match.');
      return;
    }

    try {
      await signup(signUpName.trim(), signUpEmail.trim(), signUpPassword);
      triggerSuccess('Account created! Welcome to ritresources.');
    } catch (err: any) {
      setShakeSignUp(true);
      setTimeout(() => setShakeSignUp(false), 400);
      showToast(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      showToast('Please enter your email address first.');
      return;
    }
    showToast(`Password reset link sent to ${signInEmail}`);
  };

  return (
    <div className="login-page-container">
      <button className="back-link" onClick={onBackToHome}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        <img src="/logo.png" alt="ritresources" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
        <h1 className="auth-headline" style={{ margin: 0 }}>ritresources</h1>
      </div>

      <div className={`container-auth ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Container */}
        <div className="form-container sign-up-container">
          <form className={`auth-form ${shakeSignUp ? 'shake-animation' : ''}`} onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#google" title="Google" onClick={(e) => { e.preventDefault(); showToast('Google OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </a>
              <a href="#github" title="GitHub" onClick={(e) => { e.preventDefault(); showToast('GitHub OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#linkedin" title="LinkedIn" onClick={(e) => { e.preventDefault(); showToast('LinkedIn OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <span className="small-text">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signUpConfirm}
              onChange={(e) => setSignUpConfirm(e.target.value)}
              required
            />
            <button type="submit" className="btn-auth">Sign Up</button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className="form-container sign-in-container">
          <form className={`auth-form ${shakeSignIn ? 'shake-animation' : ''}`} onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-container">
              <a href="#google" title="Google" onClick={(e) => { e.preventDefault(); showToast('Google OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </a>
              <a href="#github" title="GitHub" onClick={(e) => { e.preventDefault(); showToast('GitHub OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#linkedin" title="LinkedIn" onClick={(e) => { e.preventDefault(); showToast('LinkedIn OAuth available via Supabase'); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <span className="small-text">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            <button type="button" className="forgot-link" onClick={handleForgotPassword}>
              Forgot your password?
            </button>
            <button type="submit" className="btn-auth">Sign In</button>
          </form>
        </div>

        {/* Sliding Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="btn-auth ghost" id="signIn" onClick={() => setIsRightPanelActive(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with ritresources</p>
              <button className="btn-auth ghost" id="signUp" onClick={() => setIsRightPanelActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="brand-watermark">ritresources — RIT Chennai</div>

      {/* Success Animation Overlay */}
      <div className={`success-overlay ${showSuccessOverlay ? 'show' : ''}`} id="successOverlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p>{successMsg}</p>
      </div>
    </div>
  );
};
