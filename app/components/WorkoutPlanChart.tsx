"use client";

import { getCurrentWorkout } from "@/lib/api";
import { DataPoint, useWorkoutStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const WINDOW = 600;
const POLL_MS = 1000;

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function WorkoutPlanChart() {
  const data = useWorkoutStore((s) => s.data);
  const totalTime = useWorkoutStore((s) => s.totalTime);
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let startEpochMs: number | null = null;
    const tick = async () => {
      try {
        const workout = await getCurrentWorkout();
        useWorkoutStore.getState().setCurrentWorkout(workout);
        if (workout.start_date) startEpochMs = new Date(workout.start_date).getTime();
      } catch {}
      if (startEpochMs !== null) setCurrentTime(Math.floor((Date.now() - startEpochMs) / 1000));
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const windowStart = currentTime;
  const windowEnd = Math.min(currentTime + WINDOW, totalTime);
  const maxR = data.length > 0 ? Math.max(...data.map((d) => d.resistance)) : 1;

  const lastBefore = [...data].reverse().find((p) => p.time < windowStart);
  const windowData: DataPoint[] = [];
  if (lastBefore) windowData.push({ time: windowStart, resistance: lastBefore.resistance });
  data.forEach((p) => {
    if (p.time > windowStart && p.time <= windowEnd) windowData.push(p);
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">

      {/* Timer row */}
      <div className="flex items-baseline justify-between mb-2 shrink-0">
        <div>
          <span className="text-2xl font-mono font-semibold tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-zinc-500 text-xs ml-2">elapsed</span>
        </div>
        <div className="text-right">
          <span className="text-base font-mono tabular-nums text-zinc-400">{formatTime(Math.max(0, totalTime - currentTime))}</span>
          <span className="text-zinc-500 text-xs ml-2">remaining</span>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="grow min-h-0">
        {dims && (
          <AreaChart width={dims.w} height={dims.h} data={windowData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={[windowStart, windowEnd]}
              tickCount={7}
              tickFormatter={formatTime}
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, maxR + 1]}
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#e4e4e7" }}
              formatter={(v) => [v, "Resistance"]}
              labelFormatter={(l) => formatTime(Number(l))}
            />
            <ReferenceLine x={currentTime} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" />
            <Area
              type="stepAfter"
              dataKey="resistance"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#rg)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 shrink-0 text-xs text-zinc-600">
        <span className="inline-block w-4 border-t-2 border-dashed border-red-500" />
        <span>now</span>
        <span className="ml-4 text-zinc-700">showing next 10 min</span>
      </div>

    </div>
  );
}
