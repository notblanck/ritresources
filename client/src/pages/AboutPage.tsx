import React from 'react';
import { DepartmentGrid } from '../components/about/DepartmentGrid.js';
import { StatsRow } from '../components/about/StatsRow.js';

interface AboutPageProps {
  highlightDept?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ highlightDept }) => {
  return (
    <section id="view-about" className="view active">
      <div className="page-wrap">
        <div className="about-hero">
          <h2 style={{ textAlign: 'center' }}>About <span>REWARE</span></h2>
          <p>
            REWARE is RIT Chennai's centralized academic resource-sharing platform — one home for the notes, assignments, question papers, and coding material that used to get lost in WhatsApp chats. Built by students, for students, across every department.
          </p>
        </div>

        <h3 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
          Departments on REWARE
        </h3>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', marginBottom: '26px' }}>
          Tap a department from the nav to jump straight here.
        </p>

        <DepartmentGrid highlightDept={highlightDept} />

        <StatsRow />
      </div>
    </section>
  );
};
