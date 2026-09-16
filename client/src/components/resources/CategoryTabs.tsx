import React from 'react';

interface CategoryTabsProps {
  activeType: string;
  onSelectType: (type: string) => void;
}

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Resources',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  },
  {
    id: 'Notes',
    label: 'Notes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    )
  },
  {
    id: 'Assignments',
    label: 'Assignments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4h6v2H9z" />
        <path d="M8 11h8M8 15h5" />
      </svg>
    )
  },
  {
    id: 'Previous Year Paper',
    label: 'PYQ Papers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    )
  },
  {
    id: 'Important Questions',
    label: 'Important Questions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6z" />
      </svg>
    )
  },
  {
    id: 'Coding Resources',
    label: 'Coding Resources',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
      </svg>
    )
  }
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeType, onSelectType }) => {
  return (
    <div className="cat-tabs" id="catTabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={activeType === cat.id ? 'active' : ''}
          onClick={() => onSelectType(cat.id)}
        >
          {cat.icon}
          {cat.label}
        </button>
      ))}
    </div>
  );
};
