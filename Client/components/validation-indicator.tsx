import { CheckCircle, XCircle } from "lucide-react"

interface ValidationIndicatorProps {
  isValid: boolean
  showIndicator: boolean
}

export default function ValidationIndicator({ isValid, showIndicator }: ValidationIndicatorProps) {
  if (!showIndicator) return null

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
      {isValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
    </div>
  )
}
