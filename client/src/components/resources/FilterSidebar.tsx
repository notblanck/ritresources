import React from 'react';

interface FilterSidebarProps {
  dept: string;
  sem: string;
  subject: string;
  types: Set<string>;
  subjectsList: string[];
  isOpenMobile: boolean;
  onDeptChange: (dept: string) => void;
  onSemChange: (sem: string) => void;
  onSubjectChange: (sub: string) => void;
  onTypeToggle: (type: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const ALL_TYPES = [
  'Notes',
  'Assignments',
  'Previous Year Paper',
  'Important Questions',
  'Coding Resources'
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  dept,
  sem,
  subject,
  types,
  subjectsList,
  isOpenMobile,
  onDeptChange,
  onSemChange,
  onSubjectChange,
  onTypeToggle,
  onApply,
  onReset
}) => {
  return (
    <aside className={`res-sidebar ${isOpenMobile ? 'show' : ''}`} id="resSidebar">
      <h3>Filter Resources</h3>

      <div className="filter-group">
        <label className="field-label" htmlFor="fDept">
          Department
        </label>
        <select id="fDept" value={dept} onChange={(e) => onDeptChange(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="CSBS">CSBS</option>
          <option value="CSE">CSE</option>
          <option value="AIDS">AI &amp; DS</option>
          <option value="AIML">AI &amp; ML</option>
          <option value="VLSI">VLSI Design</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="field-label" htmlFor="fSem">
          Semester / Year
        </label>
        <select id="fSem" value={sem} onChange={(e) => onSemChange(e.target.value)}>
          <option value="all">All Semesters</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="field-label" htmlFor="fSubject">
          Subject
        </label>
        <select id="fSubject" value={subject} onChange={(e) => onSubjectChange(e.target.value)}>
          <option value="all">All Subjects</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="field-label">Resource Type</label>
        {ALL_TYPES.map((t) => (
          <label key={t} className="check-row">
            <input
              type="checkbox"
              className="typeCheck"
              value={t}
              checked={types.has(t)}
              onChange={() => onTypeToggle(t)}
            />
            {t}
          </label>
        ))}
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary" id="applyFilters" onClick={onApply}>
          Apply Filters
        </button>
        <button className="btn btn-reset" id="resetFilters" onClick={onReset}>
          Reset All
        </button>
      </div>
    </aside>
  );
};
