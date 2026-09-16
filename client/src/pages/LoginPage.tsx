import React from 'react';
import { SlidingAuth } from '../components/auth/SlidingAuth.js';

interface LoginPageProps {
  onBackToHome: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSuccess }) => {
  return <SlidingAuth onBackToHome={onBackToHome} onSuccess={onSuccess} />;
};
