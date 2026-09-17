import React, { useState } from 'react';
import type { Resource } from '../../types/index.js';
import { getResourceDownloadUrl } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface ResourceCardProps {
  resource: Resource;
}

const TYPE_COLORS: Record<string, string> = {
  'Notes': '#1E4FDB',
  'Assignments': '#22A65A',
  'Previous Year Paper': '#7C3AED',
  'Important Questions': '#FF8A00',
  'Coding Resources': '#0EA5E9'
};

function formatDaysAgo(days?: number, createdAt?: string): string {
  if (typeof days === 'number') {
    if (days === 0) return 'today';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    return `${Math.floor(days / 7)} weeks ago`;
  }
  if (createdAt) {
    const diffDays = Math.floor(Math.abs(Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }
  return 'recently';
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { showToast } = useToast();
  const [downloadCount, setDownloadCount] = useState(resource.downloads_count);
  const [bookmarked, setBookmarked] = useState(false);

  const color = TYPE_COLORS[resource.type] || '#1E4FDB';
  const dateLabel = formatDaysAgo(resource.days_ago, resource.created_at);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadCount((prev) => prev + 1);
      showToast(`Downloading "${resource.title}"...`);

      // Stream file directly from server download endpoint
      const downloadUrl = getResourceDownloadUrl(resource.id);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = resource.file_name || `${resource.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.warn('Download error:', err);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    showToast(bookmarked ? 'Bookmark removed' : 'Resource saved to bookmarks!');
  };

  return (
    <div className="res-card">
      <div className="res-card-top">
        <div className="res-pdf-icon" style={{ backgroundColor: color }}>
          {resource.file_type?.includes('zip') ? 'ZIP' : 'PDF'}
        </div>
        <span
          className="res-more"
          onClick={(e) => {
            e.stopPropagation();
            showToast(`Department: ${resource.dept_id} · Semester: ${resource.semester}`);
          }}
        >
          ⋮
        </span>
      </div>

      <div>
        <span className="res-badge" style={{ backgroundColor: `${color}22`, color }}>
          {resource.type}
        </span>
        <div className="res-title">{resource.title}</div>
        <div className="res-subject">{resource.subject}</div>
      </div>

      <div className="res-meta">
        <span>By {resource.uploader_name}</span>
        <span>{dateLabel}</span>
      </div>

      <div className="res-footer">
        <span className="dl" onClick={handleDownload} title="Download Resource">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v10M8 9l4 4 4-4M5 19h14" />
          </svg>
          {downloadCount} Downloads
        </span>
        <span
          style={{ cursor: 'pointer', opacity: bookmarked ? 1 : 0.6 }}
          onClick={handleBookmark}
          title={bookmarked ? 'Bookmarked' : 'Save bookmark'}
        >
          {bookmarked ? '🔖' : '🏷️'}
        </span>
      </div>
    </div>
  );
};
