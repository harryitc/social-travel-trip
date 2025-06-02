"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Sunrise, Sunset } from "lucide-react"

export type ThemeType = "day" | "night" | "sunrise" | "sunset"

interface ThemeSelectorProps {
  currentTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const themes = [
    { id: "sunrise", icon: Sunrise, color: "#ffa642", label: "Sunrise" },
    { id: "day", icon: Sun, color: "#64b5f6", label: "Day" },
    { id: "sunset", icon: Sunset, color: "#db8876", label: "Sunset" },
    { id: "night", icon: Moon, color: "#0d0d0d", label: "Night" },
  ]

  const currentThemeObj = themes.find((t) => t.id === currentTheme) || themes[0]

  return (
    <div className="relative z-20">
      <button
        onClick={toggleOpen}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-white/50 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/100 transition-all duration-300"
        aria-label="Selecionar tema"
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          {React.createElement(currentThemeObj.icon, {
            size: 24,
            color: currentThemeObj.color,
            strokeWidth: 2.5,
          })}
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white/50 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/30 w-64"
        >
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id as ThemeType)
                  setIsOpen(false)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                  currentTheme === theme.id ? "bg-white/100 shadow-inner" : "hover:bg-white/100"
                }`}
              >
                {React.createElement(theme.icon, {
                  size: 24,
                  color: theme.color,
                  strokeWidth: 2.5,
                })}
                <span className="mt-1 text-sm font-medium text-gray-800">{theme.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
