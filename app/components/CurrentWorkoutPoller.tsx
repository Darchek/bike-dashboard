"use client";

import { useEffect } from "react";
import { getCurrentWorkout } from "@/lib/api";
import { useWorkoutStore } from "@/lib/store";

interface CurrentWorkoutPollerProps {
  intervalMs: number;
}

export default function CurrentWorkoutPoller({ intervalMs }: CurrentWorkoutPollerProps) {
  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const workout = await getCurrentWorkout();
        if (!active) return;

        useWorkoutStore.getState().setCurrentWorkout(workout);
      } catch {
        // Ignore transient polling failures and try again on the next interval.
      }
    };

    poll();
    const id = window.setInterval(poll, intervalMs);

    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return null;
}
