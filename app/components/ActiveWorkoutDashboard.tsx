import { WorkoutPlan } from "@/lib/api";
import CurrentStage from "./CurrentStage";
import StagesButton from "./StagesButton";
import WorkoutPlanChart from "./WorkoutPlanChart";

export default function ActiveWorkoutDashboard({ plan }: { plan: WorkoutPlan }) {
  const stages = plan.stages.filter((stage) => stage.duration > 0);
  const totalTime = stages.reduce((sum, stage) => sum + stage.duration, 0);
  const minutes = Math.floor(totalTime / 60);

  return (
    <>
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
    </>
  );
}
