"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ThemeToggleProps {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

 return (
  <div
    className="flex items-center justify-center w-14 h-14 cursor-pointer"
    onClick={toggleTheme}
    role="button"
    tabIndex={0}
    aria-label={theme === "light" ? "Mudar para modo noturno" : "Mudar para modo diurno"}
    onKeyDown={(e) => e.key === "Enter" && toggleTheme()}
  >
    <motion.div
      className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
      animate={{
        rotate: theme === "light" ? 0 : 180,
      }}
      transition={{ duration: 0.5 }}
    >
      {theme === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </motion.div>
  </div>
)
}
