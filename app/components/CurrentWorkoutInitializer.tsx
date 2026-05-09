"use client";

import { useEffect } from "react";
import { CurrentWorkout } from "@/lib/api";
import { useWorkoutStore } from "@/lib/store";

export default function CurrentWorkoutInitializer({ workout }: { workout: CurrentWorkout }) {
  const setCurrentWorkout = useWorkoutStore((s) => s.setCurrentWorkout);

  useEffect(() => {
    setCurrentWorkout(workout);
  }, [setCurrentWorkout, workout]);

  return null;
}
