import type { Resource, Department } from '../types/index.js';
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getResourceDownloadUrl(resourceId: string): string {
  return `${API_BASE}/resources/${resourceId}/download`;
}

export interface GetResourcesParams {
  search?: string;
  type?: string;
  dept?: string;
  sem?: string;
  subject?: string;
  types?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ResourceListResponse {
  success: boolean;
  data: Resource[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export async function fetchResources(params: GetResourcesParams): Promise<ResourceListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.dept && params.dept !== 'all') query.append('dept', params.dept);
  if (params.sem && params.sem !== 'all') query.append('sem', params.sem);
  if (params.subject && params.subject !== 'all') query.append('subject', params.subject);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  if (params.types && params.types.length > 0) {
    params.types.forEach((t) => query.append('types', t));
  }

  const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch resources: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSubjects(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/resources/subjects`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Error fetching subjects:', err);
    return [];
  }
}

export async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${API_BASE}/departments`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Error fetching departments:', err);
    return [];
  }
}

export async function createResourceApi(formData: FormData): Promise<Resource> {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    body: formData
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create resource');
  }
  return json.data;
}

export async function registerDownload(resourceId: string): Promise<{ downloads_count: number; file_url?: string }> {
  try {
    const res = await fetch(`${API_BASE}/resources/${resourceId}/download`, {
      method: 'POST'
    });
    const json = await res.json();
    return json.data || { downloads_count: 0 };
  } catch (err) {
    console.warn('Download registration error:', err);
    return { downloads_count: 0 };
  }
}

export async function sendContactMessage(payload: { name: string; email: string; message: string }): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to send message');
  }
}
