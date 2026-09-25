import React, { useState, useEffect, useCallback } from 'react';
import type { Resource, Department } from '../types/index.js';
import { fetchResources, fetchSubjects, fetchDepartments } from '../services/api.js';
import { CategoryTabs } from '../components/resources/CategoryTabs.js';
import { FilterSidebar } from '../components/resources/FilterSidebar.js';
import { ResourceCard } from '../components/resources/ResourceCard.js';
import { Pagination } from '../components/resources/Pagination.js';
import { useToast } from '../context/ToastContext.js';

const ALL_TYPES = [
  'Notes',
  'Assignments',
  'Previous Year Paper',
  'Important Questions',
  'Coding Resources'
];

export const ResourcesPage: React.FC = () => {
  const { showToast } = useToast();

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dept, setDept] = useState('all');
  const [sem, setSem] = useState('all');
  const [subject, setSubject] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(ALL_TYPES));
  const [sortBy, setSortBy] = useState<'latest' | 'downloads' | 'title'>('latest');
  const [page, setPage] = useState(1);

  // Data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  // Fetch distinct subjects and departments on mount
  useEffect(() => {
    fetchSubjects().then((subs) => setSubjectsList(subs));
    fetchDepartments().then((depts) => setDepartmentsList(depts));
  }, []);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchResources({
        search: search.trim(),
        type: selectedCategory,
        dept,
        sem,
        subject,
        types: Array.from(selectedTypes),
        sort: sortBy,
        page,
        limit: 8
      });

      setResources(response.data || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.warn('Error loading resources:', err);
      showToast('Could not load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, dept, sem, subject, selectedTypes, sortBy, page, showToast]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleTypeToggle = (t: string) => {
    const next = new Set(selectedTypes);
    if (next.has(t)) {
      next.delete(t);
    } else {
      next.add(t);
    }
    setSelectedTypes(next);
  };

  const handleApplyFilters = () => {
    setPage(1);
    loadResources();
    showToast('Filters applied');
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setDept('all');
    setSem('all');
    setSubject('all');
    setSelectedTypes(new Set(ALL_TYPES));
    setSortBy('latest');
    setPage(1);
    showToast('Filters reset');
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrap" id="view-resources">
      <div className="page-header">
        <h2>Browse <span>Academic Resources</span></h2>
        <p>Search, filter, and download notes, question papers, and solutions shared by RIT students &amp; faculty.</p>
      </div>

      {/* Toolbar: Search + Filter button for mobile */}
      <div className="res-toolbar">
        <div className="res-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="resSearch"
            placeholder="Search by title, subject, or topic (e.g. Data Structures, DBMS, Python)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button
          className="res-filters-btn"
          id="mobileFilterToggle"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filters
        </button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs activeType={selectedCategory} onSelectType={handleCategorySelect} />

      {/* Main Body: Sidebar + Grid */}
      <div className="res-body">
        {/* Mobile Filter Backdrop */}
        <div
          className={`filter-drawer-backdrop ${mobileFilterOpen ? 'active' : ''}`}
          onClick={() => setMobileFilterOpen(false)}
          aria-hidden="true"
        />

        <FilterSidebar
          dept={dept}
          sem={sem}
          subject={subject}
          types={selectedTypes}
          subjectsList={subjectsList}
          departments={departmentsList}
          isOpenMobile={mobileFilterOpen}
          onDeptChange={(d) => { setDept(d); setPage(1); }}
          onSemChange={(s) => { setSem(s); setPage(1); }}
          onSubjectChange={(sub) => { setSubject(sub); setPage(1); }}
          onTypeToggle={handleTypeToggle}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        <main>
          <div className="res-results-bar">
            <span id="resultsCount">
              {loading ? 'Loading resources...' : `Showing ${total} result${total !== 1 ? 's' : ''}`}
            </span>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'latest' | 'downloads' | 'title');
                setPage(1);
              }}
            >
              <option value="latest">Sort: Newest First</option>
              <option value="downloads">Sort: Most Downloaded</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {loading ? (
            <div className="res-empty" style={{ minHeight: '260px', display: 'grid', placeItems: 'center' }}>
              <div>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--blue)" strokeWidth="2" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <p>Loading resources from database...</p>
              </div>
            </div>
          ) : resources.length === 0 ? (
            <div className="res-empty">
              No resources match your filters. Try widening your search or clearing active filters.
            </div>
          ) : (
            <div className="res-grid" id="resGrid">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};
