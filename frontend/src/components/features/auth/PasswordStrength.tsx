"use client"

/**
 * PasswordStrength Component
 *
 * Visual indicator showing password strength with 4-level bars
 * Colors: weak (gray), fair (red), good (yellow), strong (green)
 */

import { calculatePasswordStrength } from "@/schemas/auth"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password)

  // Map strength to number of bars (0-4)
  const strengthLevel = {
    weak: 0,
    fair: 1,
    good: 2,
    strong: 3,
  }[strength]

  // Color classes for each strength level
  const colorClasses = {
    weak: "bg-gray-300",
    fair: "bg-red-500",
    good: "bg-yellow-500",
    strong: "bg-green-500",
  }

  const currentColor = colorClasses[strength]

  // Labels for each strength level
  const labels = {
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  }

  if (!password) {
    return null
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index <= strengthLevel ? currentColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{" "}
        <span
          className={`font-medium ${
            strength === "weak"
              ? "text-gray-600"
              : strength === "fair"
                ? "text-red-600"
                : strength === "good"
                  ? "text-yellow-600"
                  : "text-green-600"
          }`}
        >
          {labels[strength]}
        </span>
      </p>
    </div>
  )
}
