interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max,
  color,
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm font-mono text-white/40">
          <span>
            {value} / {max} completed
          </span>
          <span className="font-semibold" style={{ color }}>
            {pct}%
          </span>
        </div>
      )}
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: pct > 0 ? `0 0 8px ${color}70` : "none",
          }}
        />
      </div>
    </div>
  );
}
