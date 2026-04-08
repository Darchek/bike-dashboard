import { create } from "zustand";
import { CurrentWorkout, WorkoutPlan, WorkoutStage } from "./api";

export interface DataPoint {
  time: number;
  resistance: number;
}

interface WorkoutStore {
  currentWorkout: CurrentWorkout | null;
  setCurrentWorkout: (workout: CurrentWorkout) => void;

  stages: WorkoutStage[];
  data: DataPoint[];
  totalTime: number;
  minutes: number;
  setPlan: (plan: WorkoutPlan) => void;
}

export const selectCurrentResistance = (s: WorkoutStore): number | null =>
  s.currentWorkout?.data.resistance ?? null;

export const selectNextResistance = (s: WorkoutStore): number | null => {
  if (!s.currentWorkout?.start_date) return null;
  const startEpochMs = new Date(s.currentWorkout?.start_date).getTime();
  const currentTime = Math.floor((Date.now() - startEpochMs) / 1000);
  const currentPoint = s.data.find((d) => d.time > currentTime) ?? null;
  const currentResistance = currentPoint?.resistance ?? null;
  const nextStagePoint = s.data.find((d) => (d.time > currentTime + 1) && d.resistance !== currentResistance) ?? null;
  return nextStagePoint?.resistance ?? currentPoint?.resistance ?? null;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  currentWorkout: null,
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),

  stages: [],
  data: [],
  totalTime: 0,
  minutes: 0,
  setPlan: (plan) => { 
    const stages = plan.stages.filter((s) => s.duration > 0);
    const data: DataPoint[] = [];
    let t = 0;
    for (const stage of stages) {
      for (let s = 0; s < stage.duration; s++) {
        data.push({ time: t, resistance: stage.resistance });
        t++;
      }
    }
    set({ stages, data, totalTime: t, minutes: Math.floor(t / 60) });
  },
}));
