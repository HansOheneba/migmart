"use client";

import { useRef, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type Chart,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

const SEGMENTS = [
  { label: "25 pts",  points: 25,  color: "#f97316" }, // orange
  { label: "40 pts",  points: 40,  color: "#8b5cf6" }, // violet
  { label: "75 pts",  points: 75,  color: "#06b6d4" }, // cyan
  { label: "120 pts", points: 120, color: "#ec4899" }, // pink
  { label: "160 pts", points: 160, color: "#eab308" }, // yellow
  { label: "50 pts",  points: 50,  color: "#22c55e" }, // green
  { label: "30 pts",  points: 30,  color: "#ef4444" }, // red
  { label: "100 pts", points: 100, color: "#3b82f6" }, // blue
];

const SEGMENT_DEG = 360 / SEGMENTS.length;
const SPIN_DURATION = 4000;

// Custom plugin: draws reward labels on each slice
const labelPlugin = {
  id: "wheelLabels",
  afterDraw(chart: Chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((arc, i) => {
      const { startAngle, endAngle, outerRadius, innerRadius, x, y } =
        arc as unknown as {
          startAngle: number;
          endAngle: number;
          outerRadius: number;
          innerRadius: number;
          x: number;
          y: number;
        };
      const midAngle = (startAngle + endAngle) / 2;
      const midRadius = (outerRadius + innerRadius) / 2;
      const lx = x + midRadius * Math.cos(midAngle);
      const ly = y + midRadius * Math.sin(midAngle);

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(midAngle + Math.PI / 2);
      // Use dark text on light (yellow) segment, white on all others
      ctx.fillStyle = SEGMENTS[i].color === "#eab308" ? "#1a1a1a" : "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 3;
      ctx.fillText(SEGMENTS[i].label, 0, 0);
      ctx.restore();
    });
  },
};

const chartData = {
  labels: SEGMENTS.map((s) => s.label),
  datasets: [
    {
      data: SEGMENTS.map(() => 1),
      backgroundColor: SEGMENTS.map((s) => s.color),
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

const chartOptions = {
  rotation: -90,
  animation: { duration: 0 } as const,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  cutout: "38%",
};

type SpinWheelProps = {
  pointsAward: number | null;
  canSpin: boolean;
  spinsAvailable: number;
  onSpin: (reward: number) => void;
};

export function SpinWheel({
  pointsAward,
  canSpin,
  spinsAvailable,
  onSpin,
}: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);

  function handleSpinClick() {
    if (!canSpin || spinning) return;

    // Pick a random segment
    const targetIdx = Math.floor(Math.random() * SEGMENTS.length);
    const reward = SEGMENTS[targetIdx].points;

    // Desired final CSS rotation (mod 360) that lands segment center under pointer.
    // Segment i center is (i * SEGMENT_DEG + SEGMENT_DEG/2) degrees clockwise from top.
    // We need that angle to equal 0 (top) after rotation, so:
    //   targetAngle = (360 - segCenter) % 360
    const segCenter = targetIdx * SEGMENT_DEG + SEGMENT_DEG / 2;
    const targetAngle = (360 - segCenter) % 360;

    // How much MORE to rotate from the current wheel position
    const currentAngle = rotationRef.current % 360;
    let delta = (targetAngle - currentAngle + 360) % 360;
    if (delta === 0) delta = 360; // always spin forward

    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const totalRotation = rotationRef.current + extraSpins + delta;

    rotationRef.current = totalRotation;
    setRotation(totalRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      onSpin(reward);
    }, SPIN_DURATION);
  }

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-(--lime-300)/30 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-2xl text-(--ink-900)">Spin To Win</h3>
          <p className="mt-1 text-sm text-(--ink-600)">
            Daily spin rewards. Limited by available spins.
          </p>
        </div>
        <Gift className="h-5 w-5 text-(--green-800)" />
      </div>

      <div className="mt-4 flex flex-col items-center gap-0">
        {/* Fixed pointer arrow */}
        <svg width="20" height="24" viewBox="0 0 20 24" className="z-10 drop-shadow-md">
          <polygon points="10,22 0,2 20,2" fill="#1e293b" />
        </svg>

        {/* Spinning wheel */}
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17,0.67,0.12,0.99)`
              : "none",
          }}
          className="relative h-48 w-48"
        >
          <Doughnut
            data={chartData}
            options={chartOptions}
            plugins={[labelPlugin]}
          />
          {/* Center hub */}
          <div className="pointer-events-none absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner ring-2 ring-white/60">
            <Gift className="h-5 w-5 text-(--green-800)" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-(--ink-600)">Spins available: {spinsAvailable}</p>
        <Button onClick={handleSpinClick} disabled={!canSpin || spinning}>
          {spinning ? "Spinning…" : "Spin Now"}
        </Button>
      </div>

      {pointsAward ? (
        <p className="mt-3 rounded-xl bg-(--lime-300)/30 px-3 py-2 text-sm font-semibold text-(--green-900)">
          🎉 You won {pointsAward} points!
        </p>
      ) : null}
    </Card>
  );
}
