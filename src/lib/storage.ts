export interface SavedPlan {
  id: string;
  label: string;
  createdAt: string;
  payload: {
    days: number;
    startDate: string; // ISO
    origin: string;
    destination: string;
    destinationCountry: string;
    /** Rute kota tujuan berurutan (mode multi-kota) */
    route?: { name: string; country: string }[];
  };
}

const KEY = "cutiku.plans.v1";

export function loadPlans(): SavedPlan[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPlan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: Omit<SavedPlan, "id" | "createdAt">): SavedPlan[] {
  const plans = loadPlans();
  const entry: SavedPlan = {
    ...plan,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...plans].slice(0, 12);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage penuh / tidak tersedia — abaikan
  }
  return next;
}

export function deletePlan(id: string): SavedPlan[] {
  const next = loadPlans().filter((p) => p.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // abaikan
  }
  return next;
}
