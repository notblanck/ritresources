import type { Resource, Department, ResourceType } from '../types/index.js';
import { supabase } from '../lib/supabaseClient.js';
import type { Database } from '../types/database.js';

export const API_BASE = import.meta.env.VITE_API_URL || '';

export function getResourceDownloadUrl(resourceId: string, fileUrl?: string): string {
  if (fileUrl) return fileUrl;
  if (API_BASE) return `${API_BASE}/resources/${resourceId}/download`;
  return '';
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
  let uploader_name = (formData.get('uploader_name') as string) || 'Anonymous Student';
  let uploader_email = (formData.get('uploader_email') as string) || undefined;
  const file = formData.get('file') as File | null;

  // Identify current authenticated user if logged in
  let currentUserId: string | null = null;
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      currentUserId = authData.user.id;
      uploader_email = authData.user.email || uploader_email;
      uploader_name =
        authData.user.user_metadata?.full_name ||
        authData.user.user_metadata?.name ||
        uploader_name;
    }
  } catch {
    // Guest or unauthenticated upload fallback
  }

  let file_url: string | undefined;
  const file_name = file?.name;
  const file_size = file?.size;
  const file_type = file?.type;

  // If a file is uploaded, store it in Supabase Storage
  if (file && file.name) {
    try {
      const fileExt = file.name.split('.').pop() || '';
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = `${Date.now()}_${baseName}${fileExt ? `.${fileExt}` : ''}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(cleanName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('resources')
          .getPublicUrl(cleanName);
        file_url = publicUrlData.publicUrl;
      } else if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError);
      }
    } catch (uploadErr) {
      console.warn('Storage upload exception:', uploadErr);
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
    uploader_email: uploader_email || undefined,
    uploader_id: currentUserId || undefined,
    uploaded_by: currentUserId || undefined,
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
    // 1. Try atomic database RPC
    const { data: rpcCount, error: rpcErr } = await supabase.rpc('increment_resource_downloads', {
      resource_id: resourceId
    });

    if (!rpcErr && typeof rpcCount === 'number') {
      const { data } = await supabase
        .from('resources')
        .select('file_url')
        .eq('id', resourceId)
        .single();
      return {
        downloads_count: rpcCount,
        file_url: (data as { file_url: string | null } | null)?.file_url || undefined
      };
    }

    // 2. Direct fallback
    const { data } = await supabase
      .from('resources')
      .select('downloads_count, file_url')
      .eq('id', resourceId)
      .single();

    type DownloadRow = { downloads_count: number | null; file_url: string | null };
    const row = data as unknown as DownloadRow;
    const nextCount = (row?.downloads_count || 0) + 1;

    await supabase
      .from('resources')
      .update({ downloads_count: nextCount })
      .eq('id', resourceId);

    return {
      downloads_count: nextCount,
      file_url: row?.file_url || undefined
    };
  } catch (err) {
    console.warn('Download registration error:', err);
    return { downloads_count: 0 };
  }
}

export async function downloadResource(resource: Resource): Promise<void> {
  // 1. Register and increment download count in Supabase
  registerDownload(resource.id).catch((err) => console.warn('Could not register download:', err));

  // 2. If a physical remote file exists (e.g. Supabase Storage or direct link)
  if (resource.file_url && resource.file_url.startsWith('http')) {
    try {
      const res = await fetch(resource.file_url, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = resource.file_name || `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      }
    } catch (err) {
      console.warn('Direct blob fetch failed, opening URL in new window:', err);
    }
    window.open(resource.file_url, '_blank', 'noopener,noreferrer');
    return;
  }

  // 3. Fallback for seed resources without physical files on disk:
  // Generate a clean text document representation and trigger browser download
  const content = [
    '=========================================================',
    'ritresources — Academic Resource Sharing Platform',
    'Rajalakshmi Institute of Technology, Chennai',
    '=========================================================',
    '',
    `Title: ${resource.title}`,
    `Subject: ${resource.subject}`,
    `Resource Type: ${resource.type}`,
    `Department: ${resource.dept_id || resource.department_id || 'All'}`,
    `Semester / Year: ${resource.semester}`,
    `Uploader: ${resource.uploader_name || 'Anonymous Student'}`,
    '',
    'Description:',
    resource.description || 'No additional description provided.',
    '',
    '=========================================================',
    'This academic resource was downloaded from ritresources.',
    'Platform URL: https://reware-academic-resource-sharing-ve.vercel.app',
    '========================================================='
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const fallbackFileName = resource.file_name?.endsWith('.pdf')
    ? resource.file_name.replace(/\.pdf$/i, '.txt')
    : (resource.file_name || `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`);

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fallbackFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export async function sendContactMessage(payload: { name: string; email: string; message: string }): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(payload as never);
  if (error) {
    throw new Error(error.message);
  }
}
