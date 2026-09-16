export type ResourceType =
  | 'Notes'
  | 'Assignments'
  | 'Previous Year Paper'
  | 'Important Questions'
  | 'Coding Resources';

export interface Department {
  id: string; // 'CSBS', 'CSE', 'AIDS', 'AIML', 'VLSI'
  name: string;
  full_name: string;
  description: string;
  icon_gradient?: string;
  display_order?: number;
  created_at?: string;
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  dept_id: string;
  semester: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  visibility?: string;
  uploader_name: string;
  uploader_email?: string;
  uploader_id?: string;
  downloads_count: number;
  created_at: string;
  updated_at?: string;
  // Computed / joined fields:
  days_ago?: number;
  department?: Department;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface ResourceFilterQuery {
  search?: string;
  type?: string;
  dept?: string;
  sem?: string;
  subject?: string;
  types?: string | string[];
  sort?: 'latest' | 'downloads' | 'title';
  page?: number;
  limit?: number;
}
