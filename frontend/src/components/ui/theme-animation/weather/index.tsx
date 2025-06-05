"use client"

import { useState } from "react"
import DaySky from "./day-sky"
import NightSky from "./night-sky"
import SunsetSky from "./sunset-sky"
import SunriseSky from "./sunrise-sky"
import ThemeSelector, { ThemeType } from "./theme-selector"

export default function WeatherThemeComponent() {
  const [theme, setTheme] = useState<ThemeType>("day")
  const [transitioning, setTransitioning] = useState(false)

  const changeTheme = (newTheme: ThemeType) => {
    if (theme === newTheme) return

    setTransitioning(true)
    setTimeout(() => {
      setTheme(newTheme)
      setTimeout(() => {
        setTransitioning(false)
      }, 500)
    }, 300)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sky Backgrounds */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
          theme === "day" ? "opacity-100" : "opacity-0"
        } ${transitioning ? "pointer-events-none" : ""}`}
      >
        <DaySky />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
          theme === "night" ? "opacity-100" : "opacity-0"
        } ${transitioning ? "pointer-events-none" : ""}`}
      >
        <NightSky />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
          theme === "sunrise" ? "opacity-100" : "opacity-0"
        } ${transitioning ? "pointer-events-none" : ""}`}
      >
        <SunriseSky />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
          theme === "sunset" ? "opacity-100" : "opacity-0"
        } ${transitioning ? "pointer-events-none" : ""}`}
      >
        <SunsetSky />
      </div>

      {/* Theme Selector */}
      <div className="relative z-10 flex justify-center pt-8">
        <ThemeSelector currentTheme={theme} onThemeChange={changeTheme} />
      </div>
    </div>
  )
}
