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
