export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null;
          id: string;
          resource_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          resource_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          resource_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "resources";
            referencedColumns: ["id"];
          }
        ];
      };
      contact_messages: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          created_at: string | null;
          description: string;
          display_order: number | null;
          full_name: string;
          icon_gradient: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          display_order?: number | null;
          full_name: string;
          icon_gradient?: string | null;
          id: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          display_order?: number | null;
          full_name?: string;
          icon_gradient?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          department_id: string | null;
          email: string;
          full_name: string;
          id: string;
          role: string;
          roll_number: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          department_id?: string | null;
          email: string;
          full_name: string;
          id: string;
          role?: string;
          roll_number?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          department_id?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          role?: string;
          roll_number?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          }
        ];
      };
      resources: {
        Row: {
          approved: boolean | null;
          created_at: string | null;
          department_id: string | null;
          dept_id: string | null;
          description: string | null;
          downloads_count: number | null;
          file_name: string | null;
          file_size: number | null;
          file_type: string | null;
          file_url: string | null;
          id: string;
          semester: string;
          subject: string;
          title: string;
          type: string;
          updated_at: string | null;
          uploaded_by: string | null;
          uploader_email: string | null;
          uploader_id: string | null;
          uploader_name: string | null;
          visibility: string | null;
        };
        Insert: {
          approved?: boolean | null;
          created_at?: string | null;
          department_id?: string | null;
          dept_id?: string | null;
          description?: string | null;
          downloads_count?: number | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          semester: string;
          subject: string;
          title: string;
          type: string;
          updated_at?: string | null;
          uploaded_by?: string | null;
          uploader_email?: string | null;
          uploader_id?: string | null;
          uploader_name?: string | null;
          visibility?: string | null;
        };
        Update: {
          approved?: boolean | null;
          created_at?: string | null;
          department_id?: string | null;
          dept_id?: string | null;
          description?: string | null;
          downloads_count?: number | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          semester?: string;
          subject?: string;
          title?: string;
          type?: string;
          updated_at?: string | null;
          uploaded_by?: string | null;
          uploader_email?: string | null;
          uploader_id?: string | null;
          uploader_name?: string | null;
          visibility?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "resources_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_dept_id_fkey";
            columns: ["dept_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_my_department: { Args: never; Returns: string };
      get_my_role: { Args: never; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];
export type TablesInsert<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Insert"];
export type TablesUpdate<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Update"];
