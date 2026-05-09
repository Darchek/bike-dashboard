import { getCurrentWorkout, getWorkoutDistance, getWorkoutPlan } from "@/lib/api";
import CurrentWorkoutInitializer from "./components/CurrentWorkoutInitializer";
import PlanInitializer from "./components/PlanInitializer";
import WakeLock from "./components/WakeLock";
import WorkoutDashboard from "./components/WorkoutDashboard";

export default async function Home() {
  const [currentWorkout, plan] = await Promise.all([getCurrentWorkout(), getWorkoutPlan()]);
  const initialDistance = getWorkoutDistance(currentWorkout);

  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col px-4 py-3">
      <WakeLock />
      <PlanInitializer plan={plan} />
      <CurrentWorkoutInitializer workout={currentWorkout} />
      <WorkoutDashboard plan={plan} initialDistance={initialDistance} />
    </div>
  );
}
