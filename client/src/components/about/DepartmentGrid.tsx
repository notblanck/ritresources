import React, { useEffect, useRef, useState } from 'react';
import type { Department } from '../../types/index.js';
import { fetchDepartments } from '../../services/api.js';

interface DepartmentGridProps {
  highlightDept?: string;
}

const DEPARTMENT_ICONS: Record<string, React.ReactNode> = {
  CSBS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v6c0 2 4 4 9 4s9-2 9-4V7" />
    </svg>
  ),
  CSE: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  AIDS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" strokeLinecap="round" />
    </svg>
  ),
  AIML: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  ),
  VLSI: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </svg>
  )
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({ highlightDept }) => {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDepartments()
      .then((data) => {
        if (isMounted) {
          setDepartments(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load departments from Supabase:', err);
          setError('Could not load departments from database');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
  }, [highlightDept, departments]);

  return (
    <div className="dept-grid" id="deptGrid">
      {loading && departments.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          Loading departments from database...
        </div>
      )}

      {error && departments.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#EF4444' }}>
          {error}
        </div>
      )}

      {departments.map((dept) => (
        <div
          key={dept.id}
          className="dept-card"
          data-dept-card={dept.id}
          ref={(el) => {
            cardRefs.current[dept.id] = el;
          }}
        >
          <div
            className="dept-icon"
            style={{
              background: dept.icon_gradient || 'linear-gradient(135deg,#1E4FDB,#3D8BFF)'
            }}
          >
            {DEPARTMENT_ICONS[dept.id] || DEFAULT_ICON}
          </div>
          <div className="dept-full">{dept.name}</div>
          <h4>{dept.full_name}</h4>
          <p>{dept.description}</p>
        </div>
      ))}

      {/* RIT Overview Card */}
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
          REWARE is a student-built initiative at Rajalakshmi Institute of Technology — more departments and resource categories are added every semester as the platform grows.
        </p>
      </div>
    </div>
  );
};
