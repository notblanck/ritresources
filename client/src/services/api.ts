import type { Resource, Department, ResourceType } from '../types/index.js';
import { supabase } from '../lib/supabaseClient.js';
import type { Database } from '../types/database.js';

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

function computeDaysAgo(dateString?: string | null): number {
  if (!dateString) return 0;
  try {
    const diffTime = Math.abs(Date.now() - new Date(dateString).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export async function fetchResources(params: GetResourcesParams): Promise<ResourceListResponse> {
  const page = params.page || 1;
  const limit = params.limit || 8;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('resources').select('*', { count: 'exact' });

  if (params.dept && params.dept !== 'all') {
    query = query.or(`dept_id.eq.${params.dept},department_id.eq.${params.dept}`);
  }
  if (params.sem && params.sem !== 'all') {
    query = query.eq('semester', params.sem);
  }
  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type);
  }
  if (params.subject && params.subject !== 'all') {
    query = query.eq('subject', params.subject);
  }
  if (params.types && params.types.length > 0) {
    query = query.in('type', params.types);
  }
  if (params.search) {
    const term = params.search.trim();
    if (term) {
      query = query.or(`title.ilike.%${term}%,subject.ilike.%${term}%`);
    }
  }

  if (params.sort === 'downloads') {
    query = query.order('downloads_count', { ascending: false });
  } else if (params.sort === 'title') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Supabase fetchResources error:', error);
    throw new Error(error.message);
  }

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  type ResourceRow = Database['public']['Tables']['resources']['Row'];

  const resources: Resource[] = ((data as ResourceRow[] | null) || []).map((row) => ({
    id: row.id,
    title: row.title,
    subject: row.subject,
    type: row.type as ResourceType,
    dept_id: row.dept_id || row.department_id || 'CSE',
    department_id: row.department_id || row.dept_id || 'CSE',
    semester: row.semester,
    description: row.description || undefined,
    file_url: row.file_url || undefined,
    file_name: row.file_name || undefined,
    file_size: row.file_size ? Number(row.file_size) : undefined,
    file_type: row.file_type || undefined,
    visibility: row.visibility || 'Visible to all students',
    uploader_name: row.uploader_name || 'Anonymous Student',
    uploader_email: row.uploader_email || undefined,
    uploader_id: row.uploader_id || undefined,
    downloads_count: row.downloads_count || 0,
    created_at: row.created_at || new Date().toISOString(),
    days_ago: computeDaysAgo(row.created_at)
  }));

  return {
    success: true,
    data: resources,
    pagination: {
      total,
      page,
      totalPages
    }
  };
}

export async function fetchSubjects(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from('resources').select('subject');
    if (error) {
      console.warn('Supabase fetchSubjects error:', error);
      return [];
    }
    const rows = (data || []) as { subject: string }[];
    const subjects = Array.from(new Set(rows.map((r) => r.subject))).filter(Boolean);
    return subjects;
  } catch (err) {
    console.warn('Error fetching subjects:', err);
    return [];
  }
}

export async function fetchDepartments(): Promise<Department[]> {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetchDepartments error:', error);
      return [];
    }
    type DepartmentRow = Database['public']['Tables']['departments']['Row'];
    return ((data as DepartmentRow[] | null) || []).map((d) => ({
      id: d.id,
      name: d.name,
      full_name: d.full_name,
      description: d.description,
      icon_gradient: d.icon_gradient || undefined,
      display_order: d.display_order ?? undefined
    }));
  } catch (err) {
    console.warn('Error fetching departments:', err);
    return [];
  }
}

export async function createResourceApi(formData: FormData): Promise<Resource> {
  const title = (formData.get('title') as string) || '';
  const type = (formData.get('type') as ResourceType) || 'Notes';
  const subject = (formData.get('subject') as string) || 'General';
  const dept_id = (formData.get('dept_id') as string) || 'CSE';
  const semester = (formData.get('semester') as string) || '1st Year';
  const description = (formData.get('description') as string) || '';
  const visibility = (formData.get('visibility') as string) || 'Visible to all students';
  const uploader_name = (formData.get('uploader_name') as string) || 'Anonymous Student';
  const uploader_email = (formData.get('uploader_email') as string) || undefined;
  const file = formData.get('file') as File | null;

  let file_url: string | undefined;
  let file_name = file?.name;
  let file_size = file?.size;
  let file_type = file?.type;

  // If a file is uploaded, attempt to store it in Supabase Storage if configured
  if (file && file.name) {
    try {
      const cleanName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(cleanName, file);

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('resources')
          .getPublicUrl(cleanName);
        file_url = publicUrlData.publicUrl;
      }
    } catch {
      // Storage upload optional fallback
    }
  }

  type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
  const insertPayload: ResourceInsert = {
    title,
    type,
    subject,
    dept_id,
    department_id: dept_id,
    semester,
    description,
    visibility,
    uploader_name,
    uploader_email,
    file_url,
    file_name,
    file_size,
    file_type
  };

  const { data, error } = await supabase
    .from('resources')
    .insert(insertPayload as never)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  type ResourceRow = Database['public']['Tables']['resources']['Row'];
  const row = data as unknown as ResourceRow;

  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    type: row.type as ResourceType,
    dept_id: row.dept_id || row.department_id || dept_id,
    department_id: row.department_id || row.dept_id || dept_id,
    semester: row.semester,
    description: row.description || undefined,
    file_url: row.file_url || undefined,
    file_name: row.file_name || undefined,
    file_size: row.file_size ? Number(row.file_size) : undefined,
    file_type: row.file_type || undefined,
    visibility: row.visibility || 'Visible to all students',
    uploader_name: row.uploader_name || 'Anonymous Student',
    uploader_email: row.uploader_email || undefined,
    uploader_id: row.uploader_id || undefined,
    downloads_count: row.downloads_count || 0,
    created_at: row.created_at || new Date().toISOString(),
    days_ago: 0
  };
}

export async function registerDownload(resourceId: string): Promise<{ downloads_count: number; file_url?: string }> {
  try {
    const { data } = await supabase
      .from('resources')
      .select('downloads_count, file_url')
      .eq('id', resourceId)
      .single();

    type DownloadRow = { downloads_count: number | null; file_url: string | null };
    const row = data as unknown as DownloadRow;

    return {
      downloads_count: (row?.downloads_count || 0) + 1,
      file_url: row?.file_url || undefined
    };
  } catch (err) {
    console.warn('Download registration error:', err);
    return { downloads_count: 0 };
  }
}

export async function sendContactMessage(payload: { name: string; email: string; message: string }): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(payload as never);
  if (error) {
    throw new Error(error.message);
  }
}
