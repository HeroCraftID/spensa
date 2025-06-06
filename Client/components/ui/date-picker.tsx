"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ date, setDate, label, className, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-black/50 border-gray-700 h-10",
            !date && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{label || "Pilih tanggal"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="bg-gray-900"
          classNames={{
            day_selected: "bg-purple-600 text-white hover:bg-purple-500",
            day_today: "bg-gray-800 text-white",
            day: "text-gray-300 hover:bg-gray-800",
            head_cell: "text-gray-400",
            caption: "text-gray-300",
            nav_button: "border-gray-700 text-gray-300 hover:bg-gray-800",
            table: "border-gray-800",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
