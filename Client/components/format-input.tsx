"use client"

import type { ChangeEvent } from "react"
import { Input } from "@/components/ui/input"

interface FormatInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  className?: string
}

export default function FormatInput({ value, onChange, maxLength = 7, className = "" }: FormatInputProps) {
  // Handle input changes with formatting
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.toUpperCase()

    // If we're at exactly 1 character and it's a letter, duplicate it
    if (newValue.length === 1 && /[A-Z]/.test(newValue)) {
      newValue = newValue + newValue
    }

    // If we're at exactly 2 characters and the user hasn't added a dot yet
    if (newValue.length === 2 && !newValue.includes(".")) {
      // Ensure both letters are the same
      if (newValue[0] !== newValue[1]) {
        newValue = newValue[0] + newValue[0]
      }
      newValue += "."
    }

    // Ensure only valid characters are entered
    // First 2 chars: only uppercase letters and they must be the same
    // 3rd char: only dot
    // Last 4 chars: only numbers
    let formattedValue = ""

    for (let i = 0; i < newValue.length && i < maxLength; i++) {
      const char = newValue[i]

      if (i === 0 && /[A-Z]/.test(char)) {
        formattedValue += char
      } else if (i === 1 && /[A-Z]/.test(char)) {
        // Ensure second letter is the same as the first
        formattedValue += formattedValue[0]
      } else if (i === 2 && char === ".") {
        formattedValue += char
      } else if (i > 2 && /\d/.test(char)) {
        formattedValue += char
      } else if (i < 2 && /[a-z]/.test(char)) {
        // Auto-convert lowercase to uppercase
        const upperChar = char.toUpperCase()
        formattedValue += upperChar
        // If this is the first letter, duplicate it for the second position
        if (i === 0 && formattedValue.length === 1) {
          formattedValue += upperChar
        }
      } else if (i === 2) {
        // Auto-insert dot at position 3 if missing
        formattedValue += "."
        if (/\d/.test(char)) {
          formattedValue += char
        }
      }
    }

    onChange(formattedValue)
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      placeholder="AA.0000"
      className={`bg-black/50 border-gray-700 text-center text-xl tracking-widest h-14 ${className}`}
    />
  )
}
