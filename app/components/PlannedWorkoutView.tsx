import { WorkoutPlan } from "@/lib/api";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

export default function PlannedWorkoutView({ plan }: { plan: WorkoutPlan }) {
  const stages = plan.stages.filter((stage) => stage.duration > 0);
  const totalTime = stages.reduce((sum, stage) => sum + stage.duration, 0);
  const totalMinutes = Math.floor(totalTime / 60);
  const warmupStage = stages[0] ?? null;

  return (
    <div className="relative overflow-hidden bg-zinc-900 rounded-2xl p-5 flex-1 min-h-0 flex flex-col border border-zinc-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.12),_transparent_30%)] pointer-events-none" />

      <div className="relative mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-blue-300/80">Workout Ready</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Everything is set for today&apos;s ride</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Your training plan is loaded and the live dashboard will appear automatically as soon as you start pedaling.
        </p>
      </div>

      <div className="relative grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Day</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{plan.day_num}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Stages</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{stages.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Time</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{totalMinutes} min</p>
        </div>
      </div>

      <div className="relative rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-3 mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">First Up</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-mono font-semibold text-zinc-50">
              {warmupStage ? `Resistance ${warmupStage.resistance}` : "Plan loading"}
            </p>
            <p className="text-sm text-zinc-400">
              {warmupStage ? `${formatDuration(warmupStage.duration)} opening stage` : "Preparing your first interval"}
            </p>
          </div>
          <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.7)]" />
        </div>
      </div>

      <div className="relative flex items-center justify-between mb-3 text-xs text-zinc-500">
        <span className="uppercase tracking-[0.2em]">Planned Stages</span>
        <span>Start riding when you&apos;re ready</span>
      </div>

      <div className="relative overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/40">
        <ol>
          {stages.map((stage, index) => (
            <li
              key={`${stage.resistance}-${stage.duration}-${index}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/70 last:border-b-0"
            >
              <span className="w-5 text-right text-xs tabular-nums text-zinc-600">{index + 1}</span>
              <div className="w-1.5 h-6 rounded-full bg-blue-500/80 flex-shrink-0" />
              <span className="flex-1 text-sm font-mono font-semibold tabular-nums text-zinc-100">
                R{stage.resistance}
              </span>
              <span className="text-xs tabular-nums text-zinc-500">{formatDuration(stage.duration)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
