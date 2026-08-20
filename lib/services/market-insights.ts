export interface SalaryBenchmarkRequest {
  roleTitle: string;
  location?: string;
  experienceLevel?: string;
  companyName?: string;
}

export interface YoYDataPoint {
  year: string;
  avg_salary_lakhs: number;
  growth_pct: number;
}

export interface TopPayingCompany {
  name: string;
  range: string;
  tier: string;
}

export interface SalaryBenchmarkResult {
  role: string;
  location: string;
  company?: string;
  experience_level: string;
  currency: string;
  salary_period: "annual" | "monthly";
  p25: number;
  median: number;
  p75: number;
  p90: number;
  yoy_growth_percent: number;
  yoy_history: YoYDataPoint[];
  top_paying_companies: TopPayingCompany[];
}

export const marketInsightsService = {
  async fetchSalaryBenchmark(params: SalaryBenchmarkRequest): Promise<SalaryBenchmarkResult> {
    const res = await fetch("/api/market-insights/salary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to fetch salary data" }));
      throw new Error(err.error || "Failed to fetch salary benchmark data");
    }

    return res.json();
  },
};
