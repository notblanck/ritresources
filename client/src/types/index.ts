export type ResourceType =
  | 'Notes'
  | 'Assignments'
  | 'Previous Year Paper'
  | 'Important Questions'
  | 'Coding Resources';

export interface Department {
  id: string;
  name: string;
  full_name: string;
  description: string;
  icon_gradient?: string;
  display_order?: number;
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
  days_ago?: number;
}

export interface ResourceFilterState {
  search: string;
  type: string;
  dept: string;
  sem: string;
  subject: string;
  types: Set<string>;
  sort: 'latest' | 'downloads' | 'title';
  page: number;
}

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  loggedIn: boolean;
}
