import React from 'react';
import { HeroOrbit } from '../components/hero/HeroOrbit.js';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <section id="view-home" className="view active">
      <main className="hero">
        <div className="hero-copy">
          <h1 className="headline">
            <span className="c-navy">SHARING</span>
            <span className="c-blue">ACADEMIC RESOURCES</span>
            <span className="c-navy">MADE SIMPLE</span>
          </h1>
          <div className="divider" />
          <p className="lede">
            Access all your college notes, assignments, coding resources, previous year question papers and important questions — all in one place.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 8a4.5 4.5 0 0 1-.5 9H7z" />
                <path d="M12 12v6M9 15l3-3 3 3" />
              </svg>
              Upload Resource
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('resources')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
              Browse Resources
            </button>
          </div>
        </div>

        <HeroOrbit />
      </main>

      <div className="social-rail">
        <a href="#linkedin" title="LinkedIn" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a href="#github" title="GitHub" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a href="#instagram" title="Instagram" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      </div>

      <div className="scroll-hint" onClick={() => onNavigate('resources')} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="7" />
          <line x1="12" y1="6" x2="12" y2="10" />
        </svg>
        Scroll to Explore
      </div>
    </section>
  );
};
