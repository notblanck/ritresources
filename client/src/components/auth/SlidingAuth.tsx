import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface SlidingAuthProps {
  onBackToHome: () => void;
  onSuccess: () => void;
}

export const SlidingAuth: React.FC<SlidingAuthProps> = ({ onBackToHome, onSuccess }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please enter both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        showToast('Please enter your name.');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        await signup(name.trim(), email.trim(), password);
        showToast('Account created successfully! Welcome to ritresources.');
        setTimeout(() => {
          onSuccess();
        }, 800);
      } catch (err: any) {
        console.warn('Signup error:', err);
        showToast(err.message || 'Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await login(email.trim(), password);
        showToast('Welcome back to ritresources!');
        setTimeout(() => {
          onSuccess();
        }, 800);
      } catch (err: any) {
        console.warn('Login error:', err);
        showToast(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google Auth error:', err);
      showToast(err.message || 'Failed to initialize Google login.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="shadcn-auth-page">
      {/* Left Branding / Testimonial Column (Desktop) */}
      <div className="shadcn-auth-left">
        <div className="shadcn-auth-brand">
          <img src="/emblem.png" alt="ritresources emblem" className="shadcn-brand-icon" />
          <span className="shadcn-brand-title">ritresources</span>
        </div>

        <div className="shadcn-auth-quote">
          <blockquote>
            &ldquo;This platform has completely transformed how students and faculty at RIT share and discover academic materials across every department.&rdquo;
          </blockquote>
          <cite>— Sofia Davis, RIT Student Contributor</cite>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="shadcn-auth-right">
        {/* Top Navigation */}
        <button
          type="button"
          onClick={onBackToHome}
          className="shadcn-nav-btn shadcn-back-btn"
          title="Back to home"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setPassword('');
            setConfirmPassword('');
          }}
          className="shadcn-nav-btn shadcn-mode-toggle"
        >
          {mode === 'signup' ? 'Login' : 'Create an account'}
        </button>

        {/* Center Card */}
        <div className="shadcn-form-box">
          <div className="shadcn-form-header">
            <h1 className="shadcn-form-title">
              {mode === 'signup' ? 'Create an account' : 'Sign in to your account'}
            </h1>
            <p className="shadcn-form-subtitle">
              {mode === 'signup'
                ? 'Enter your email below to create your account'
                : 'Enter your email and password below to sign in'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="shadcn-form">
            {mode === 'signup' && (
              <div className="shadcn-field">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadcn-input"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="shadcn-field">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadcn-input"
                required
                disabled={loading}
              />
            </div>

            <div className="shadcn-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadcn-input"
                required
                disabled={loading}
              />
            </div>

            {mode === 'signup' && (
              <div className="shadcn-field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadcn-input"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" className="shadcn-submit-btn" disabled={loading}>
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'signup' ? (
                'Create Account with Email'
              ) : (
                'Sign In with Email'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="shadcn-divider">
            <div className="shadcn-divider-line" />
            <span className="shadcn-divider-text">Or continue with</span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="shadcn-oauth-btn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Google'}</span>
          </button>

          {/* Footer Terms */}
          <p className="shadcn-terms">
            By clicking continue, you agree to our{' '}
            <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service: Respect intellectual property and academic integrity.'); }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy: User credentials and data are secured with Supabase.'); }}>
              Privacy Policy
            </a>
            .
          </p>

          {/* Switch mode footer */}
          <div className="shadcn-switch-footer">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="shadcn-switch-btn"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="shadcn-switch-btn"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
