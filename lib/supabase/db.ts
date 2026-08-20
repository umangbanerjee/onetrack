import { supabaseAdmin } from "./admin";
import {
  ApplicationItem,
  ApplicationStatus,
  ApplicationSource,
  UserProfile,
  DEFAULT_STATUSES,
  DEFAULT_SOURCES,
} from "../constants/defaults";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  subDays,
  format,
} from "date-fns";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Persistent File & Global Store configuration
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "onetrack_store.json");

interface GlobalStore {
  profiles: Record<string, UserProfile>;
  statuses: ApplicationStatus[];
  sources: ApplicationSource[];
  applications: ApplicationItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __ONETRACK_STORE__: GlobalStore | undefined;
}

function initGlobalStore(): GlobalStore {
  if (!globalThis.__ONETRACK_STORE__) {
    let diskData: Partial<GlobalStore> = {};
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        diskData = JSON.parse(raw);
      }
    } catch {
      // Ignore disk read errors
    }

    globalThis.__ONETRACK_STORE__ = {
      profiles: diskData.profiles || {},
      statuses: (diskData.statuses && diskData.statuses.length > 0) ? diskData.statuses : [...DEFAULT_STATUSES],
      sources: (diskData.sources && diskData.sources.length > 0) ? diskData.sources : [...DEFAULT_SOURCES],
      applications: diskData.applications || [],
    };
  }
  return globalThis.__ONETRACK_STORE__;
}

function persistStore() {
  try {
    const store = initGlobalStore();
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to persist onetrack store to disk:", err);
  }
}

// Helper to check if user qualifies for Admin bootstrap via ENV
function checkIsAdminEnv(clerkUserId: string, email?: string | string[] | null): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const adminIds = (process.env.ADMIN_CLERK_USER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (email) {
    const list = Array.isArray(email) ? email : [email];
    for (const e of list) {
      if (e && adminEmails.includes(e.trim().toLowerCase())) {
        return true;
      }
    }
  }
  if (clerkUserId && adminIds.includes(clerkUserId.trim())) {
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// 1. PROFILES
// -------------------------------------------------------------
export async function getOrCreateUserProfile(
  clerkUserId: string,
  email?: string | string[] | null,
  displayName?: string | null
): Promise<UserProfile> {
  const primaryEmail = Array.isArray(email) ? email[0] : email;
  const isAdminBootstrap = checkIsAdminEnv(clerkUserId, email);
  const store = initGlobalStore();

  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (existing && !fetchErr) {
      if (isAdminBootstrap && existing.role !== "admin") {
        await supabaseAdmin.from("profiles").update({ role: "admin" }).eq("id", existing.id);
        existing.role = "admin";
      }
      store.profiles[clerkUserId] = existing;
      persistStore();
      return existing;
    }

    if (!fetchErr) {
      const initialRole = isAdminBootstrap ? "admin" : "user";
      const { data: newProfile, error: insertErr } = await supabaseAdmin
        .from("profiles")
        .insert({
          clerk_user_id: clerkUserId,
          email: email || null,
          display_name: displayName || null,
          role: initialRole,
          is_active: true,
        })
        .select()
        .single();

      if (newProfile && !insertErr) {
        store.profiles[clerkUserId] = newProfile;
        persistStore();
        return newProfile;
      }
    }
  } catch {
    // Supabase fallback
  }

  // Persistent fallback
  let profile = store.profiles[clerkUserId];
  if (!profile) {
    profile = {
      id: `profile-${clerkUserId}`,
      clerk_user_id: clerkUserId,
      email: primaryEmail || "user@example.com",
      display_name: displayName || "Applicant",
      role: isAdminBootstrap ? "admin" : "user",
      is_active: true,
      created_at: new Date().toISOString(),
    };
    store.profiles[clerkUserId] = profile;
    persistStore();
  } else {
    if (primaryEmail && profile.email !== primaryEmail) profile.email = primaryEmail;
    if (displayName && profile.display_name !== displayName) profile.display_name = displayName;
    if (isAdminBootstrap && profile.role !== "admin") {
      profile.role = "admin";
    }
    store.profiles[clerkUserId] = profile;
    persistStore();
  }
  return profile;
}

// -------------------------------------------------------------
// 2. APPLICATION STATUSES (Config-Driven)
// -------------------------------------------------------------
export async function getApplicationStatuses(): Promise<ApplicationStatus[]> {
  const store = initGlobalStore();
  try {
    const { data, error } = await supabaseAdmin
      .from("application_statuses")
      .select("*")
      .order("sort_order", { ascending: true });

    if (data && data.length > 0 && !error) {
      store.statuses = data;
      persistStore();
      return data;
    }
  } catch {
    // Fallback to store
  }
  return store.statuses.sort((a, b) => a.sort_order - b.sort_order);
}

export async function upsertApplicationStatus(statusData: Partial<ApplicationStatus>): Promise<ApplicationStatus> {
  const store = initGlobalStore();
  try {
    const { data, error } = await supabaseAdmin
      .from("application_statuses")
      .upsert({
        ...statusData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (data && !error) {
      return data;
    }
  } catch {
    // Fallback
  }

  const index = store.statuses.findIndex((s) => s.id === statusData.id || s.key === statusData.key);
  if (index >= 0) {
    store.statuses[index] = { ...store.statuses[index], ...statusData } as ApplicationStatus;
    persistStore();
    return store.statuses[index];
  } else {
    const newStatus: ApplicationStatus = {
      id: statusData.id || `status-${Date.now()}`,
      key: statusData.key || `status_${Date.now()}`,
      label: statusData.label || "New Status",
      color: statusData.color || "#64748b",
      sort_order: statusData.sort_order ?? 90,
      is_terminal: !!statusData.is_terminal,
      is_active: statusData.is_active ?? true,
    };
    store.statuses.push(newStatus);
    persistStore();
    return newStatus;
  }
}

export async function deleteApplicationStatus(id: string): Promise<boolean> {
  const store = initGlobalStore();
  try {
    const { error } = await supabaseAdmin.from("application_statuses").delete().eq("id", id);
    if (!error) return true;
  } catch {
    // Fallback
  }

  store.statuses = store.statuses.filter((s) => s.id !== id);
  persistStore();
  return true;
}

// -------------------------------------------------------------
// 3. APPLICATION SOURCES (Config-Driven)
// -------------------------------------------------------------
export async function getApplicationSources(): Promise<ApplicationSource[]> {
  const store = initGlobalStore();
  try {
    const { data, error } = await supabaseAdmin
      .from("application_sources")
      .select("*")
      .order("created_at", { ascending: true });

    if (data && data.length > 0 && !error) {
      store.sources = data;
      persistStore();
      return data;
    }
  } catch {
    // Fallback
  }
  return store.sources;
}

export async function upsertApplicationSource(sourceData: Partial<ApplicationSource>): Promise<ApplicationSource> {
  const store = initGlobalStore();
  try {
    const { data, error } = await supabaseAdmin
      .from("application_sources")
      .upsert({
        ...sourceData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (data && !error) {
      return data;
    }
  } catch {
    // Fallback
  }

  const index = store.sources.findIndex((s) => s.id === sourceData.id || s.key === sourceData.key);
  if (index >= 0) {
    store.sources[index] = { ...store.sources[index], ...sourceData } as ApplicationSource;
    persistStore();
    return store.sources[index];
  } else {
    const newSource: ApplicationSource = {
      id: sourceData.id || `source-${Date.now()}`,
      key: sourceData.key || `source_${Date.now()}`,
      label: sourceData.label || "New Source",
      is_active: sourceData.is_active ?? true,
    };
    store.sources.push(newSource);
    persistStore();
    return newSource;
  }
}

export async function deleteApplicationSource(id: string): Promise<boolean> {
  const store = initGlobalStore();
  try {
    const { error } = await supabaseAdmin.from("application_sources").delete().eq("id", id);
    if (!error) return true;
  } catch {
    // Fallback
  }

  store.sources = store.sources.filter((s) => s.id !== id);
  persistStore();
  return true;
}

// -------------------------------------------------------------
// 4. APPLICATIONS (User-Scoped with Joins & Filtering)
// -------------------------------------------------------------
export interface GetApplicationsFilter {
  from?: string;
  to?: string;
  statusId?: string | string[];
  sourceId?: string | string[];
  q?: string;
  sortBy?: "date_applied" | "company_name" | "updated_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getApplications(
  userId: string,
  filters: GetApplicationsFilter = {}
): Promise<{ items: ApplicationItem[]; total: number }> {
  const statuses = await getApplicationStatuses();
  const sources = await getApplicationSources();
  const statusMap = new Map(statuses.map((s) => [s.id, s]));
  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  const store = initGlobalStore();

  try {
    let query = supabaseAdmin
      .from("applications")
      .select("*, status:application_statuses(*), source:application_sources(*)", { count: "exact" })
      .eq("user_id", userId);

    if (filters.from) {
      query = query.gte("date_applied", filters.from);
    }
    if (filters.to) {
      query = query.lte("date_applied", filters.to);
    }
    if (filters.statusId) {
      if (Array.isArray(filters.statusId)) {
        query = query.in("status_id", filters.statusId);
      } else {
        query = query.eq("status_id", filters.statusId);
      }
    }
    if (filters.sourceId) {
      if (Array.isArray(filters.sourceId)) {
        query = query.in("source_id", filters.sourceId);
      } else {
        query = query.eq("source_id", filters.sourceId);
      }
    }
    if (filters.q) {
      query = query.or(`company_name.ilike.%${filters.q}%,role_title.ilike.%${filters.q}%,notes.ilike.%${filters.q}%`);
    }

    const sortColumn = filters.sortBy || "date_applied";
    const sortAsc = filters.sortOrder === "asc";
    query = query.order(sortColumn, { ascending: sortAsc });

    const { data, count, error } = await query;
    if (data && !error && data.length > 0) {
      return { items: data as ApplicationItem[], total: count ?? data.length };
    }
  } catch {
    // Supabase fallback
  }

  // Resilient Store Filtering (matches userId and clerk userId prefixes)
  const userPrefix = userId.replace(/^profile-/, "");
  let items = store.applications.filter(
    (a) => a.user_id === userId || a.user_id === userPrefix || a.user_id === `profile-${userPrefix}`
  );

  if (filters.from) {
    items = items.filter((a) => a.date_applied >= filters.from!);
  }
  if (filters.to) {
    items = items.filter((a) => a.date_applied <= filters.to!);
  }
  if (filters.statusId) {
    const ids = Array.isArray(filters.statusId) ? filters.statusId : [filters.statusId];
    items = items.filter((a) => ids.includes(a.status_id));
  }
  if (filters.sourceId) {
    const ids = Array.isArray(filters.sourceId) ? filters.sourceId : [filters.sourceId];
    items = items.filter((a) => a.source_id && ids.includes(a.source_id));
  }
  if (filters.q) {
    const qLower = filters.q.toLowerCase();
    items = items.filter(
      (a) =>
        a.company_name.toLowerCase().includes(qLower) ||
        a.role_title.toLowerCase().includes(qLower) ||
        (a.notes && a.notes.toLowerCase().includes(qLower))
    );
  }

  const sortColumn = filters.sortBy || "date_applied";
  const isAsc = filters.sortOrder === "asc";
  items.sort((a, b) => {
    const valA = (a as any)[sortColumn] || "";
    const valB = (b as any)[sortColumn] || "";
    return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const hydrated = items.map((a) => ({
    ...a,
    status: statusMap.get(a.status_id) || DEFAULT_STATUSES.find((s) => s.id === a.status_id) || DEFAULT_STATUSES[0],
    source: a.source_id ? sourceMap.get(a.source_id) || DEFAULT_SOURCES.find((s) => s.id === a.source_id) : undefined,
  }));

  return { items: hydrated, total: hydrated.length };
}

export async function getApplicationById(id: string, userId: string): Promise<ApplicationItem | null> {
  const statuses = await getApplicationStatuses();
  const sources = await getApplicationSources();
  const statusMap = new Map(statuses.map((s) => [s.id, s]));
  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  const store = initGlobalStore();

  try {
    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("*, status:application_statuses(*), source:application_sources(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (data && !error) {
      return data as ApplicationItem;
    }
  } catch {
    // Fallback
  }

  const userPrefix = userId.replace(/^profile-/, "");
  const found = store.applications.find(
    (a) => a.id === id && (a.user_id === userId || a.user_id === userPrefix || a.user_id === `profile-${userPrefix}`)
  );
  if (!found) return null;
  return {
    ...found,
    status: statusMap.get(found.status_id) || DEFAULT_STATUSES[0],
    source: found.source_id ? sourceMap.get(found.source_id) : undefined,
  };
}

export async function createApplication(
  userId: string,
  data: Omit<ApplicationItem, "id" | "user_id" | "created_at" | "updated_at">
): Promise<ApplicationItem> {
  const store = initGlobalStore();
  const newId = crypto.randomUUID();

  const newAppPayload = {
    id: newId,
    user_id: userId,
    company_name: data.company_name,
    role_title: data.role_title,
    status_id: data.status_id,
    source_id: data.source_id || null,
    date_applied: data.date_applied || format(new Date(), "yyyy-MM-dd"),
    job_url: data.job_url || null,
    location: data.location || null,
    salary_range: data.salary_range || null,
    notes: data.notes || null,
    next_follow_up_date: data.next_follow_up_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data: created, error } = await supabaseAdmin
      .from("applications")
      .insert(newAppPayload)
      .select("*, status:application_statuses(*), source:application_sources(*)")
      .single();

    if (created && !error) {
      // Also sync to store
      store.applications.unshift(created as ApplicationItem);
      persistStore();
      return created as ApplicationItem;
    }
  } catch {
    // Fallback
  }

  const newItem: ApplicationItem = {
    ...newAppPayload,
  };
  store.applications.unshift(newItem);
  persistStore();
  return newItem;
}

export async function updateApplication(
  id: string,
  userId: string,
  data: Partial<ApplicationItem>
): Promise<ApplicationItem | null> {
  const store = initGlobalStore();
  try {
    const { data: updated, error } = await supabaseAdmin
      .from("applications")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*, status:application_statuses(*), source:application_sources(*)")
      .single();

    if (updated && !error) {
      const idx = store.applications.findIndex((a) => a.id === id);
      if (idx >= 0) store.applications[idx] = updated as ApplicationItem;
      persistStore();
      return updated as ApplicationItem;
    }
  } catch {
    // Fallback
  }

  const userPrefix = userId.replace(/^profile-/, "");
  const index = store.applications.findIndex(
    (a) => a.id === id && (a.user_id === userId || a.user_id === userPrefix || a.user_id === `profile-${userPrefix}`)
  );
  if (index >= 0) {
    store.applications[index] = {
      ...store.applications[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    persistStore();
    return store.applications[index];
  }
  return null;
}

export async function deleteApplication(id: string, userId: string): Promise<boolean> {
  const store = initGlobalStore();
  try {
    const { error } = await supabaseAdmin.from("applications").delete().eq("id", id).eq("user_id", userId);
    if (!error) {
      store.applications = store.applications.filter((a) => a.id !== id);
      persistStore();
      return true;
    }
  } catch {
    // Fallback
  }

  const userPrefix = userId.replace(/^profile-/, "");
  store.applications = store.applications.filter(
    (a) => !(a.id === id && (a.user_id === userId || a.user_id === userPrefix || a.user_id === `profile-${userPrefix}`))
  );
  persistStore();
  return true;
}

// -------------------------------------------------------------
// 5. DASHBOARD AGGREGATES & METRICS
// -------------------------------------------------------------
export interface DashboardSummary {
  totalApplications: number;
  appliedThisWeek: number;
  appliedThisMonth: number;
  activePipelineCount: number;
  responseRatePercent: number;
  weeklyGoal: number;
  currentStreakDays: number;
  trendData: { date: string; count: number; label: string }[];
  statusDistribution: { id: string; label: string; count: number; color: string; percentage: number }[];
  sourceDistribution: { id: string; label: string; count: number; percentage: number }[];
  recentApplications: ApplicationItem[];
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const { items } = await getApplications(userId);
  const statuses = await getApplicationStatuses();
  const sources = await getApplicationSources();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const appliedThisWeek = items.filter((a) => {
    try {
      const d = parseISO(a.date_applied);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    } catch {
      return false;
    }
  }).length;

  const appliedThisMonth = items.filter((a) => {
    try {
      const d = parseISO(a.date_applied);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    } catch {
      return false;
    }
  }).length;

  const terminalStatusIds = new Set(statuses.filter((s) => s.is_terminal).map((s) => s.id));
  const activePipelineCount = items.filter((a) => !terminalStatusIds.has(a.status_id)).length;

  // Positive response rate
  const nonAppliedOrResponseStatuses = new Set(
    statuses
      .filter((s) => s.key !== "applied" && s.key !== "ghosted" && s.key !== "withdrawn")
      .map((s) => s.id)
  );
  const positiveResponses = items.filter((a) => nonAppliedOrResponseStatuses.has(a.status_id)).length;
  const responseRatePercent = items.length > 0 ? Math.round((positiveResponses / items.length) * 100) : 0;

  // Streak Calculation
  const uniqueDates = Array.from(new Set(items.map((a) => a.date_applied))).sort().reverse();
  let streak = 0;
  if (uniqueDates.length > 0) {
    const todayStr = format(now, "yyyy-MM-dd");
    const yesterdayStr = format(subDays(now, 1), "yyyy-MM-dd");
    let checkDate = uniqueDates[0] === todayStr ? now : uniqueDates[0] === yesterdayStr ? subDays(now, 1) : null;

    if (checkDate) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const expectedDateStr = format(subDays(checkDate, 1), "yyyy-MM-dd");
        if (uniqueDates[i] === expectedDateStr) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }
  }

  // 14-day velocity trend
  const trendData = [];
  for (let i = 13; i >= 0; i--) {
    const d = subDays(now, i);
    const dStr = format(d, "yyyy-MM-dd");
    const count = items.filter((a) => a.date_applied === dStr).length;
    trendData.push({
      date: dStr,
      count,
      label: format(d, "MMM d"),
    });
  }

  // Status breakdown
  const statusCounts = new Map<string, number>();
  items.forEach((a) => {
    statusCounts.set(a.status_id, (statusCounts.get(a.status_id) || 0) + 1);
  });
  const statusDistribution = statuses
    .map((st) => {
      const count = statusCounts.get(st.id) || 0;
      return {
        id: st.id,
        label: st.label,
        color: st.color,
        count,
        percentage: items.length > 0 ? Math.round((count / items.length) * 100) : 0,
      };
    })
    .filter((s) => s.count > 0 || statuses.length <= 5);

  // Source breakdown
  const sourceCounts = new Map<string, number>();
  items.forEach((a) => {
    const srcId = a.source_id || "unspecified";
    sourceCounts.set(srcId, (sourceCounts.get(srcId) || 0) + 1);
  });
  const sourceDistribution = sources.map((src) => {
    const count = sourceCounts.get(src.id) || 0;
    return {
      id: src.id,
      label: src.label,
      count,
      percentage: items.length > 0 ? Math.round((count / items.length) * 100) : 0,
    };
  });

  return {
    totalApplications: items.length,
    appliedThisWeek,
    appliedThisMonth,
    activePipelineCount,
    responseRatePercent,
    weeklyGoal: 5,
    currentStreakDays: streak,
    trendData,
    statusDistribution,
    sourceDistribution,
    recentApplications: items.slice(0, 5),
  };
}

// -------------------------------------------------------------
// 6. ADMIN MANAGEMENT & PLATFORM STATS
// -------------------------------------------------------------
export async function getAllUsers(): Promise<UserProfile[]> {
  const store = initGlobalStore();
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("*, applications(count)")
      .order("created_at", { ascending: false });

    if (profiles && !error && profiles.length > 0) {
      return profiles.map((p: any) => ({
        id: p.id,
        clerk_user_id: p.clerk_user_id,
        email: p.email,
        display_name: p.display_name,
        role: p.role,
        is_active: p.is_active,
        created_at: p.created_at,
        application_count: p.applications?.[0]?.count || 0,
      }));
    }
  } catch {
    // Fallback
  }

  return Object.values(store.profiles).map((p) => {
    const appCount = store.applications.filter(
      (a) => a.user_id === p.id || a.user_id === p.clerk_user_id
    ).length;
    return {
      ...p,
      application_count: appCount,
    };
  });
}

export async function updateUserRoleOrStatus(
  targetUserId: string,
  updates: { role?: "admin" | "user"; is_active?: boolean }
): Promise<boolean> {
  const store = initGlobalStore();
  try {
    const { error } = await supabaseAdmin.from("profiles").update(updates).eq("id", targetUserId);
    if (!error) return true;
  } catch {
    // Fallback
  }

  for (const prof of Object.values(store.profiles)) {
    if (prof.id === targetUserId || prof.clerk_user_id === targetUserId) {
      Object.assign(prof, updates);
      persistStore();
      return true;
    }
  }
  return true;
}

export interface AdminPlatformStats {
  total_applications: number;
  active_applicants: number;
  active_users_7d: number;
  active_users_30d: number;
  total_registered_users: number;
  applications_today: number;
  applications_this_week: number;
  avg_applications_per_user: number;
  active_pipeline_count: number;
  total_offers_count: number;
  interview_stage_count: number;
  recent_activity: ApplicationItem[];
}

export async function getAdminPlatformStats(): Promise<AdminPlatformStats> {
  const store = initGlobalStore();
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  let allProfiles: UserProfile[] = [];
  let allApps: ApplicationItem[] = [];

  try {
    const { data: profilesData } = await supabaseAdmin.from("profiles").select("*");
    const { data: appsData } = await supabaseAdmin
      .from("applications")
      .select("*, status:application_statuses(*), source:application_sources(*)")
      .order("created_at", { ascending: false });

    if (profilesData && profilesData.length > 0) {
      allProfiles = profilesData as UserProfile[];
    } else {
      allProfiles = Object.values(store.profiles);
    }

    if (appsData && appsData.length > 0) {
      allApps = appsData as ApplicationItem[];
    } else {
      allApps = store.applications;
    }
  } catch {
    allProfiles = Object.values(store.profiles);
    allApps = store.applications;
  }

  // Active users in past 7 / 30 days
  const activeUserIds7d = new Set<string>();
  const activeUserIds30d = new Set<string>();

  allApps.forEach((a) => {
    try {
      const d = parseISO(a.created_at || a.date_applied);
      if (d >= sevenDaysAgo) activeUserIds7d.add(a.user_id);
      if (d >= thirtyDaysAgo) activeUserIds30d.add(a.user_id);
    } catch {
      activeUserIds7d.add(a.user_id);
      activeUserIds30d.add(a.user_id);
    }
  });

  allProfiles.forEach((p) => {
    try {
      const d = parseISO(p.created_at);
      if (d >= sevenDaysAgo) activeUserIds7d.add(p.id);
      if (d >= thirtyDaysAgo) activeUserIds30d.add(p.id);
    } catch {
      // Ignore parse error
    }
  });

  const applications_today = allApps.filter((a) => a.date_applied === todayStr).length;
  const applications_this_week = allApps.filter((a) => {
    try {
      const d = parseISO(a.date_applied);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    } catch {
      return false;
    }
  }).length;

  const totalUsers = Math.max(allProfiles.length, 1);
  const avgApps = allApps.length > 0 ? +(allApps.length / totalUsers).toFixed(1) : 0;

  const statuses = await getApplicationStatuses();
  const terminalStatusIds = new Set(statuses.filter((s) => s.is_terminal).map((s) => s.id));
  const activePipelineCount = allApps.filter((a) => !terminalStatusIds.has(a.status_id)).length;
  const offerStatusIds = new Set(statuses.filter((s) => s.key === "offer").map((s) => s.id));
  const interviewStatusIds = new Set(statuses.filter((s) => s.key === "interview" || s.key === "oa").map((s) => s.id));

  return {
    total_applications: allApps.length,
    active_applicants: activeUserIds30d.size || 1,
    active_users_7d: activeUserIds7d.size || 1,
    active_users_30d: activeUserIds30d.size || 1,
    total_registered_users: allProfiles.length,
    applications_today,
    applications_this_week,
    avg_applications_per_user: avgApps,
    active_pipeline_count: activePipelineCount,
    total_offers_count: allApps.filter((a) => offerStatusIds.has(a.status_id)).length,
    interview_stage_count: allApps.filter((a) => interviewStatusIds.has(a.status_id)).length,
    recent_activity: allApps.slice(0, 6),
  };
}

