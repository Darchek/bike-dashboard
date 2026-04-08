"use client";

import { useEffect } from "react";
import { WorkoutPlan } from "@/lib/api";
import { useWorkoutStore } from "@/lib/store";

export default function PlanInitializer({ plan }: { plan: WorkoutPlan }) {
  const setPlan = useWorkoutStore((s) => s.setPlan);

  useEffect(() => {
    setPlan(plan);
  }, [plan, setPlan]);

  return null;
}
