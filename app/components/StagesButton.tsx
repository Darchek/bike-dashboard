"use client";
import { useWorkoutStore } from "@/lib/store";

const STAGE_ACTIVATE_URL = "http://localhost:8000/workout/stages/activate";
const STAGE_DEACTIVATE_URL = "http://localhost:8000/workout/stages/deactivate";

export default function StagesButton() {
  const data = useWorkoutStore((s) => s.currentWorkout?.data);
  const active = data?.active_stages;

  const sendToggle = async () => {
    try {
      const url = active ? STAGE_DEACTIVATE_URL : STAGE_ACTIVATE_URL;
      await fetch(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      onClick={sendToggle}
      className={`text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${
        active
          ? "bg-green-600 hover:bg-green-500 active:bg-green-700"
          : "bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800"
      }`}
    >
      {active ? "Stages ON" : "Stages OFF"}
    </button>
  );
}
