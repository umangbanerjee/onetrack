export interface ApplicationStatus {
  id: string;
  key: string;
  label: string;
  color: string;
  sort_order: number;
  is_terminal: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationSource {
  id: string;
  key: string;
  label: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationItem {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  status_id: string;
  source_id?: string | null;
  date_applied: string;
  job_url?: string | null;
  location?: string | null;
  salary_range?: string | null;
  notes?: string | null;
  next_follow_up_date?: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  status?: ApplicationStatus;
  source?: ApplicationSource;
}

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  application_count?: number;
}

export const DEFAULT_STATUSES: ApplicationStatus[] = [
  { id: "status-1", key: "applied", label: "Applied", color: "#3b82f6", sort_order: 10, is_terminal: false, is_active: true },
  { id: "status-2", key: "oa", label: "Online Assessment", color: "#f59e0b", sort_order: 20, is_terminal: false, is_active: true },
  { id: "status-3", key: "interview_scheduled", label: "Interview Scheduled", color: "#8b5cf6", sort_order: 30, is_terminal: false, is_active: true },
  { id: "status-4", key: "interview_completed", label: "Interview Completed", color: "#06b6d4", sort_order: 40, is_terminal: false, is_active: true },
  { id: "status-5", key: "offer", label: "Offer", color: "#10b981", sort_order: 50, is_terminal: true, is_active: true },
  { id: "status-6", key: "rejected", label: "Rejected", color: "#ef4444", sort_order: 60, is_terminal: true, is_active: true },
  { id: "status-7", key: "withdrawn", label: "Withdrawn", color: "#64748b", sort_order: 70, is_terminal: true, is_active: true },
  { id: "status-8", key: "ghosted", label: "Ghosted", color: "#94a3b8", sort_order: 80, is_terminal: true, is_active: true },
];

export const DEFAULT_SOURCES: ApplicationSource[] = [
  { id: "source-1", key: "linkedin", label: "LinkedIn", is_active: true },
  { id: "source-2", key: "referral", label: "Referral", is_active: true },
  { id: "source-3", key: "company_website", label: "Company Website", is_active: true },
  { id: "source-4", key: "naukri", label: "Naukri", is_active: true },
  { id: "source-5", key: "internshala", label: "Internshala", is_active: true },
  { id: "source-6", key: "campus", label: "Campus Placement", is_active: true },
  { id: "source-7", key: "wellfound", label: "Wellfound / AngelList", is_active: true },
  { id: "source-8", key: "other", label: "Other", is_active: true },
];
