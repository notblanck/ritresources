import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { BgDecor } from './components/layout/BgDecor.js';
import { Header } from './components/layout/Header.js';
import { HomePage } from './pages/HomePage.js';
import { ResourcesPage } from './pages/ResourcesPage.js';
import { UploadPage } from './pages/UploadPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { LoginPage } from './pages/LoginPage.js';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'resources', 'upload', 'about', 'contact', 'login'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [highlightDept, setHighlightDept] = useState<string | undefined>();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'resources', 'upload', 'about', 'contact', 'login'].includes(hash)) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string, deptKey?: string) => {
    setCurrentView(view);
    window.location.hash = view;
    if (deptKey) {
      setHighlightDept(deptKey);
    } else {
      setHighlightDept(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'login') {
    return (
      <LoginPage
        onBackToHome={() => navigateTo('home')}
        onSuccess={() => navigateTo('home')}
      />
    );
  }

  return (
    <>
      <BgDecor />
      <Header currentView={currentView} onNavigate={navigateTo} />

      <div className="main-content">
        {currentView === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentView === 'resources' && <ResourcesPage />}
        {currentView === 'upload' && <UploadPage onSuccess={() => navigateTo('resources')} />}
        {currentView === 'about' && <AboutPage highlightDept={highlightDept} />}
        {currentView === 'contact' && <ContactPage />}
      </div>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
