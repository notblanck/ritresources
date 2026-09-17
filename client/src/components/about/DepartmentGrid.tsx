import React, { useEffect, useRef } from 'react';

interface DepartmentGridProps {
  highlightDept?: string;
}

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({ highlightDept }) => {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightDept && cardRefs.current[highlightDept]) {
      const el = cardRefs.current[highlightDept];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight');
        const timer = setTimeout(() => {
          el.classList.remove('highlight');
        }, 1600);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightDept]);

  return (
    <div className="dept-grid" id="deptGrid">
      {/* CSBS */}
      <div
        className="dept-card"
        data-dept-card="CSBS"
        ref={(el) => { cardRefs.current['CSBS'] = el; }}
      >
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#1E4FDB,#3D8BFF)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 7v6c0 2 4 4 9 4s9-2 9-4V7" />
          </svg>
        </div>
        <div className="dept-full">CSBS</div>
        <h4>Computer Science &amp; Business Systems</h4>
        <p>
          A TCS-aligned curriculum blending core CS — DSA, DBMS, OS — with business, finance, and product thinking. Built for students headed into product engineering and tech-business hybrid roles.
        </p>
      </div>

      {/* CSE */}
      <div
        className="dept-card"
        data-dept-card="CSE"
        ref={(el) => { cardRefs.current['CSE'] = el; }}
      >
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#0B1E4D,#1E4FDB)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
        <div className="dept-full">CSE</div>
        <h4>Computer Science &amp; Engineering</h4>
        <p>
          The core computing track — algorithms, systems, networks, and software engineering. The largest resource-sharing department on ritresources, with the deepest archive of PYQs and lab manuals.
        </p>
      </div>

      {/* AI & DS */}
      <div
        className="dept-card"
        data-dept-card="AIDS"
        ref={(el) => { cardRefs.current['AIDS'] = el; }}
      >
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#FF8A00,#FFB74D)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="dept-full">AI &amp; DS</div>
        <h4>Artificial Intelligence &amp; Data Science</h4>
        <p>
          Statistics, data engineering, and applied ML — turning raw data into decisions. Popular resource categories here are Python notes, ML assignments, and dataset-driven mini-projects.
        </p>
      </div>

      {/* AI & ML */}
      <div
        className="dept-card"
        data-dept-card="AIML"
        ref={(el) => { cardRefs.current['AIML'] = el; }}
      >
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#3D8BFF,#7EB2FF)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          </svg>
        </div>
        <div className="dept-full">AI &amp; ML</div>
        <h4>Artificial Intelligence &amp; Machine Learning</h4>
        <p>
          Deep learning, neural networks, and intelligent systems design. Expect heavier coding-resource traffic here — model notebooks, architecture notes, and research-paper summaries.
        </p>
      </div>

      {/* VLSI */}
      <div
        className="dept-card"
        data-dept-card="VLSI"
        ref={(el) => { cardRefs.current['VLSI'] = el; }}
      >
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#132B63,#1E4FDB)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="6" y="6" width="12" height="12" rx="1" />
            <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
          </svg>
        </div>
        <div className="dept-full">VLSI Design</div>
        <h4>VLSI &amp; Embedded Systems</h4>
        <p>
          Chip design, digital logic, and embedded hardware — from HDL fundamentals to fabrication basics. A smaller but highly focused department archive of lab records and circuit notes.
        </p>
      </div>

      {/* RIT Overview */}
      <div className="dept-card">
        <div className="dept-icon" style={{ background: 'linear-gradient(135deg,#94A3B8,#CBD5E1)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 21c4-3 7-6.5 7-10.5A7 7 0 0 0 5 10.5C5 14.5 8 18 12 21z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
        </div>
        <div className="dept-full">RIT Chennai</div>
        <h4>Believe in the Possibilities</h4>
        <p>
          ritresources is a student-built initiative at Rajalakshmi Institute of Technology — more departments and resource categories are added every semester as the platform grows.
        </p>
      </div>
    </div>
  );
};
