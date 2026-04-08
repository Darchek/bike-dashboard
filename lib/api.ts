const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface WorkoutStage {
  duration: number;
  resistance: number;
}

export interface WorkoutPlan {
  id: number;
  day_num: number;
  stages: WorkoutStage[];
}

export async function getWorkoutPlan(): Promise<WorkoutPlan> {
  const res = await fetch(`${BASE_URL}/workout/plan`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch workout plan: ${res.status}`);
  return res.json();
}

export interface CurrentWorkoutData {
  speed_kmh: number;
  cadence_rpm: number;
  resistance: number;
  inclination: number;
  heart_rate: number;
  calories_kcal: number;
  distance_km: number;
  watts: number;
  button: string;
  elapsed_s: number;
  packets: number;
  active_stages: boolean;
}

export interface CurrentWorkout {
  start_date: string;
  data: CurrentWorkoutData;
}

export async function getCurrentWorkout(): Promise<CurrentWorkout> {
  const res = await fetch(`${BASE_URL}/workout/current`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch current workout: ${res.status}`);
  return res.json();
}
