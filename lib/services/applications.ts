import { ApplicationItem, ApplicationStatus, ApplicationSource } from "@/lib/constants/defaults";
import { ApplicationFormValues } from "@/lib/validations/application";

export interface ApplicationsFilterParams {
  q?: string;
  from?: string;
  to?: string;
  statusId?: string | string[];
  sourceId?: string | string[];
  sortBy?: "date_applied" | "company_name" | "updated_at";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ApplicationsListResponse {
  items: ApplicationItem[];
  total: number;
}

export const applicationService = {
  async list(filters: ApplicationsFilterParams = {}): Promise<ApplicationsListResponse> {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.offset) params.set("offset", filters.offset.toString());

    if (filters.statusId) {
      if (Array.isArray(filters.statusId)) {
        filters.statusId.forEach((id) => params.append("statusId", id));
      } else {
        params.set("statusId", filters.statusId);
      }
    }

    if (filters.sourceId) {
      if (Array.isArray(filters.sourceId)) {
        filters.sourceId.forEach((id) => params.append("sourceId", id));
      } else {
        params.set("sourceId", filters.sourceId);
      }
    }

    const res = await fetch(`/api/applications?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to fetch applications" }));
      throw new Error(err.error || "Failed to fetch applications");
    }
    return res.json();
  },

  async getById(id: string): Promise<ApplicationItem> {
    const res = await fetch(`/api/applications/${id}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to fetch application" }));
      throw new Error(err.error || "Failed to fetch application");
    }
    return res.json();
  },

  async create(data: ApplicationFormValues): Promise<ApplicationItem> {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to create application" }));
      throw new Error(err.error || "Failed to create application");
    }
    return res.json();
  },

  async update(id: string, data: Partial<ApplicationFormValues>): Promise<ApplicationItem> {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to update application" }));
      throw new Error(err.error || "Failed to update application");
    }
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to delete application" }));
      throw new Error(err.error || "Failed to delete application");
    }
    const data = await res.json();
    return !!data.success;
  },
};
