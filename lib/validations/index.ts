import { z } from "zod";

/**
 * ============================================================================
 * ONETRACK VALIDATION SCHEMAS (Zod Single Source of Truth)
 * ============================================================================
 */

// Helper to get local YYYY-MM-DD
const getLocalTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 1. Application Creation Schema
export const applicationSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(120, "Company name cannot exceed 120 characters"),
  role_title: z
    .string()
    .trim()
    .min(1, "Role title is required")
    .max(120, "Role title cannot exceed 120 characters"),
  status_id: z.string().min(1, "Pipeline stage is required"),
  source_id: z.string().optional().nullable(),
  date_applied: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        // Enforce date cannot be in the future (compared to local today)
        const todayStr = getLocalTodayDate();
        return val <= todayStr;
      },
      { message: "Date applied cannot be in the future" }
    ),
  job_url: z
    .string()
    .trim()
    .url("Please enter a valid URL (http:// or https://)")
    .optional()
    .or(z.literal(""))
    .nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  salary_range: z.string().trim().max(100).optional().nullable(),
  notes: z.string().max(5000, "Notes cannot exceed 5000 characters").optional().nullable(),
  next_follow_up_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Follow-up date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

// 2. Application Patch / Partial Update Schema
export const applicationPatchSchema = applicationSchema.partial().extend({
  id: z.string().optional(),
});

export type ApplicationPatchValues = z.infer<typeof applicationPatchSchema>;

// 3. Applications Query Filter Schema
export const applicationsQuerySchema = z.object({
  q: z.string().optional(),
  statusId: z.union([z.string(), z.array(z.string())]).optional(),
  sourceId: z.union([z.string(), z.array(z.string())]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sortBy: z.enum(["date_applied", "company_name", "updated_at"]).default("date_applied"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  limit: z.coerce.number().min(1).max(200).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export type ApplicationsQueryParams = z.infer<typeof applicationsQuerySchema>;

// 4. Status Configuration Schema
export const statusConfigSchema = z.object({
  id: z.string().optional(),
  key: z
    .string()
    .trim()
    .min(1, "Key is required")
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Key must contain only lowercase letters, numbers, and underscores"),
  label: z.string().trim().min(1, "Display label is required").max(60),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a valid hex color code (e.g. #3b82f6)"),
  sort_order: z.coerce.number().int().default(0),
  is_terminal: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type StatusConfigValues = z.infer<typeof statusConfigSchema>;

// 5. Source Channel Configuration Schema
export const sourceConfigSchema = z.object({
  id: z.string().optional(),
  key: z
    .string()
    .trim()
    .min(1, "Key is required")
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Key must contain only lowercase letters, numbers, and underscores"),
  label: z.string().trim().min(1, "Display label is required").max(60),
  is_active: z.boolean().default(true),
});

export type SourceConfigValues = z.infer<typeof sourceConfigSchema>;
