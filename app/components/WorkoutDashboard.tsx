"use client";

import { getWorkoutDistance, WorkoutPlan } from "@/lib/api";
import { useWorkoutStore } from "@/lib/store";
import ActiveWorkoutDashboard from "./ActiveWorkoutDashboard";
import CurrentWorkoutPoller from "./CurrentWorkoutPoller";
import PlannedWorkoutView from "./PlannedWorkoutView";

const WAITING_POLL_MS = 5000;
const ACTIVE_POLL_MS = 1000;

export default function WorkoutDashboard({
  plan,
  initialDistance,
}: {
  plan: WorkoutPlan;
  initialDistance: number;
}) {
  const currentWorkout = useWorkoutStore((s) => s.currentWorkout);
  const distance = currentWorkout ? getWorkoutDistance(currentWorkout) : initialDistance;
  const isWaitingForStart = distance === 0;
  const pollInterval = isWaitingForStart ? WAITING_POLL_MS : ACTIVE_POLL_MS;

  return (
    <>
      <CurrentWorkoutPoller intervalMs={pollInterval} />
      {isWaitingForStart ? <PlannedWorkoutView plan={plan} /> : <ActiveWorkoutDashboard plan={plan} />}
    </>
  );
}
