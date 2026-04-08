import { getWorkoutPlan } from "@/lib/api";
import WorkoutPlanChart from "./components/WorkoutPlanChart";
import StagesButton from "./components/StagesButton";
import CurrentStage from "./components/CurrentStage";
import PlanInitializer from "./components/PlanInitializer";
import WakeLock from "./components/WakeLock";

export default async function Home() {
  const plan = await getWorkoutPlan();
  const stages = plan.stages.filter((s) => s.duration > 0);
  const totalTime = stages.reduce((acc, s) => acc + s.duration, 0);
  const minutes = Math.floor(totalTime / 60);

  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col px-4 py-3">
      <WakeLock />
      <PlanInitializer plan={plan} />
      <div className="relative flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium uppercase tracking-widest">Day {plan.day_num}</span>
          <span className="text-zinc-700">&middot;</span>
          <span>{stages.length} stages</span>
          <span className="text-zinc-700">&middot;</span>
          <span>{minutes} min</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <CurrentStage />
        </div>
        <StagesButton />
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 flex-1 min-h-0 flex flex-col">
        <WorkoutPlanChart />
      </div>
    </div>
  );
}
