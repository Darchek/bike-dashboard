"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { selectCurrentResistance, selectNextResistance, useWorkoutStore } from "@/lib/store";

const USER_AGE = 32;
const ESTIMATED_MAX_HEART_RATE = 220 - USER_AGE;

function formatDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec === 0 ? `${m}m` : `${m}m ${sec}s`;
}

function formatDistance(distance: number | null): string {
  if (distance === null) return "--";
  return distance.toFixed(2);
}

function getHeartRateZone(heartRate: number): 1 | 2 | 3 | 4 {
  const ratio = heartRate / ESTIMATED_MAX_HEART_RATE;

  if (ratio < 0.6) return 1;
  if (ratio < 0.7) return 2;
  if (ratio < 0.8) return 3;
  return 4;
}

export default function CurrentStage() {
  const current = useWorkoutStore(selectCurrentResistance);
  const next = useWorkoutStore(selectNextResistance);
  const stages = useWorkoutStore((s) => s.stages);
  const heartRate = useWorkoutStore((s) => s.currentWorkout?.data.heart_rate ?? null);
  const distance = useWorkoutStore((s) => s.currentWorkout?.data.distance ?? s.currentWorkout?.data.distance_km ?? null);
  const [open, setOpen] = useState(false);

  if (current === null) return null;

  const zone = heartRate !== null ? getHeartRateZone(heartRate) : null;

  const modal = open && createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xs max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-800 flex-shrink-0">
          <span className="text-sm font-semibold text-zinc-100">All Stages</span>
          <button
            onClick={() => setOpen(false)}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-base leading-none transition-colors"
          >
            x
          </button>
        </div>

        <ol className="overflow-y-auto">
          {stages.map((stage, i) => {
            const isCurrent = stage.resistance === current;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/50 last:border-0 ${
                  isCurrent ? "bg-blue-950/40" : ""
                }`}
              >
                <span className="text-xs text-zinc-600 tabular-nums w-4 text-right">{i + 1}</span>
                <div className={`w-1 h-5 rounded-full flex-shrink-0 ${isCurrent ? "bg-blue-500" : "bg-zinc-700"}`} />
                <span
                  className={`text-sm font-mono font-semibold tabular-nums flex-1 ${
                    isCurrent ? "text-blue-400" : "text-zinc-300"
                  }`}
                >
                  {stage.resistance}
                </span>
                <span className="text-xs text-zinc-500 tabular-nums">{formatDuration(stage.duration)}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <div className="flex items-baseline gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">KM</span>
          <span className="text-lg font-mono font-semibold tabular-nums text-zinc-100">{formatDistance(distance)}</span>
        </div>
        {heartRate !== null && (
          <div className="flex items-baseline gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">HR</span>
              <span className="text-lg font-mono font-semibold tabular-nums text-zinc-100">{heartRate}</span>
            </div>
            {zone !== null && (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Z</span>
                <span className="text-sm font-mono font-semibold tabular-nums text-emerald-300">{zone}</span>
              </div>
            )}
          </div>
        )}
        <div
          className="flex items-baseline gap-2 cursor-pointer select-none"
          onClick={() => setOpen(true)}
        >
          <span className="text-xs text-zinc-500 uppercase tracking-widest">R</span>
          <span className="text-lg font-mono font-semibold tabular-nums text-zinc-100">{current}</span>
          {next !== null && next !== current && (
            <>
              <span className="text-zinc-700 text-xs">-&gt;</span>
              <span className="text-sm font-mono tabular-nums text-zinc-400">{next}</span>
            </>
          )}
        </div>
      </div>
      {modal}
    </>
  );
}
