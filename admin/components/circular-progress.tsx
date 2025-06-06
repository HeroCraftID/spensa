import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
  color?: string
  textColor?: string
  showPercentage?: boolean
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label,
  className,
  color = "#38b6ff",
  textColor,
  showPercentage = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = value / max
  const strokeDashoffset = circumference - progress * circumference

  const percentage = Math.round(progress * 100)

  return (
    <div className={cn("circular-progress", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="stroke-current transition-all duration-500 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="circular-progress-inner" style={{ boxShadow: `0 0 10px ${color}20` }}>
        <div className="circular-progress-value" style={{ color: textColor }}>
          {showPercentage ? `${percentage}%` : value}
        </div>
        {label && <div className="circular-progress-label">{label}</div>}
      </div>
    </div>
  )
}
