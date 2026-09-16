import { supabase, isSupabaseConfigured, DEFAULT_RESOURCES } from '../config/supabase.js';
import { Resource, ResourceFilterQuery } from '../types/index.js';
import crypto from 'crypto';

// In-memory array for fallback mode if Supabase is not configured
let localResources: Resource[] = [...DEFAULT_RESOURCES];

function computeDaysAgo(dateString: string): number {
  const diffTime = Math.abs(Date.now() - new Date(dateString).getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export async function getResources(query: ResourceFilterQuery): Promise<{
  resources: Resource[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const {
    search = '',
    type = 'all',
    dept = 'all',
    sem = 'all',
    subject = 'all',
    types,
    sort = 'latest',
    page = 1,
    limit = 8
  } = query;

  if (isSupabaseConfigured() && supabase) {
    try {
      let req = supabase.from('resources').select('*', { count: 'exact' });

      if (type && type !== 'all') {
        req = req.eq('type', type);
      }
      if (dept && dept !== 'all') {
        req = req.eq('dept_id', dept);
      }
      if (sem && sem !== 'all') {
        req = req.eq('semester', sem);
      }
      if (subject && subject !== 'all') {
        req = req.eq('subject', subject);
      }
      if (types) {
        const typeArray = Array.isArray(types) ? types : [types];
        if (typeArray.length > 0) {
          req = req.in('type', typeArray);
        }
      }
      if (search) {
        req = req.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
      }

      if (sort === 'downloads') {
        req = req.order('downloads_count', { ascending: false });
      } else if (sort === 'title') {
        req = req.order('title', { ascending: true });
      } else {
        req = req.order('created_at', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      req = req.range(from, to);

      const { data, count, error } = await req;
      if (error) throw error;

      const resources: Resource[] = (data || []).map((r) => ({
        ...r,
        days_ago: computeDaysAgo(r.created_at)
      }));

      const total = count || 0;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return { resources, total, page: Number(page), totalPages };
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Fallback in-memory logic
  let filtered = localResources.filter((r) => {
    if (type !== 'all' && r.type !== type) return false;
    if (dept !== 'all' && r.dept_id !== dept) return false;
    if (sem !== 'all' && r.semester !== sem) return false;
    if (subject !== 'all' && r.subject !== subject) return false;
    if (types) {
      const typeArray = Array.isArray(types) ? types : [types];
      if (typeArray.length > 0 && !typeArray.includes(r.type)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  if (sort === 'downloads') {
    filtered.sort((a, b) => b.downloads_count - a.downloads_count);
  } else if (sort === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit).map((r) => ({
    ...r,
    days_ago: computeDaysAgo(r.created_at)
  }));

  return { resources: paged, total, page: Number(page), totalPages };
}

export async function getResourceById(id: string): Promise<Resource | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('resources').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        return { ...data, days_ago: computeDaysAgo(data.created_at) };
      }
    } catch (err) {
      console.warn('Supabase fetchById error:', err);
    }
  }

  const found = localResources.find((r) => r.id === id);
  return found ? { ...found, days_ago: computeDaysAgo(found.created_at) } : null;
}

export async function createResource(resourceData: Partial<Resource>, file?: Express.Multer.File): Promise<Resource> {
  let fileUrl = '';
  let fileName = file?.originalname || '';
  let fileSize = file?.size || 0;
  let fileType = file?.mimetype || '';

  if (file && isSupabaseConfigured() && supabase) {
    try {
      const cleanFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(cleanFileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(cleanFileName);
        fileUrl = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.warn('Storage upload error, using local reference:', err);
    }
  }

  const newResource: Resource = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: resourceData.title || '',
    subject: resourceData.subject || '',
    type: resourceData.type || 'Notes',
    dept_id: resourceData.dept_id || 'CSE',
    semester: resourceData.semester || '1st Year',
    description: resourceData.description || '',
    visibility: resourceData.visibility || 'Visible to all students',
    uploader_name: resourceData.uploader_name || 'Anonymous Student',
    uploader_email: resourceData.uploader_email || '',
    uploader_id: resourceData.uploader_id,
    downloads_count: 0,
    file_url: fileUrl,
    file_name: fileName,
    file_size: fileSize,
    file_type: fileType,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('resources').insert([newResource]).select().single();
      if (error) throw error;
      if (data) {
        return { ...data, days_ago: 0 };
      }
    } catch (err) {
      console.warn('Supabase insert error, saving to local store:', err);
    }
  }

  localResources.unshift(newResource);
  return { ...newResource, days_ago: 0 };
}

export async function incrementDownload(id: string): Promise<Resource | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: current } = await supabase.from('resources').select('downloads_count').eq('id', id).single();
      const newCount = (current?.downloads_count || 0) + 1;
      const { data, error } = await supabase
        .from('resources')
        .update({ downloads_count: newCount })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      if (data) return { ...data, days_ago: computeDaysAgo(data.created_at) };
    } catch (err) {
      console.warn('Supabase increment download error:', err);
    }
  }

  const res = localResources.find((r) => r.id === id);
  if (res) {
    res.downloads_count += 1;
    return { ...res, days_ago: computeDaysAgo(res.created_at) };
  }
  return null;
}

export async function getDistinctSubjects(): Promise<string[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('resources').select('subject');
      if (!error && data) {
        const subjects = Array.from(new Set(data.map((r) => r.subject))).filter(Boolean);
        return subjects;
      }
    } catch (err) {
      console.warn('Supabase getDistinctSubjects error:', err);
    }
  }

  return Array.from(new Set(localResources.map((r) => r.subject))).filter(Boolean);
}
