"use client"

import { useEffect, useRef } from "react"

export default function SunriseSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width: number
    let height: number

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height

      // Reinitialize clouds when resizing
      initializeClouds()
    }

    // Cloud class
    class Cloud {
      x: number
      y: number
      width: number
      height: number
      speed: number

      constructor() {
        this.width = Math.random() * 200 + 80
        this.height = this.width * 0.6
        this.x = width + this.width
        this.y = Math.random() * (height * 0.7)
        this.speed = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x -= this.speed
        if (this.x < -this.width) {
          this.x = width + this.width
          this.y = Math.random() * (height * 0.7)
        }
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)

        // Cloud path - creating a stylized cloud shape
        const w = this.width
        const h = this.height

        // Sunrise clouds have a golden/orange tint
        ctx.fillStyle = "rgba(255, 245, 235, 0.95)"
        ctx.beginPath()

        // Start from the bottom left
        ctx.moveTo(w * 0.2, h * 0.8)

        // Bottom edge (flat-ish)
        ctx.lineTo(w * 0.8, h * 0.8)

        // Right edge (curved)
        ctx.bezierCurveTo(
          w * 0.95,
          h * 0.8, // Control point 1
          w * 0.95,
          h * 0.6, // Control point 2
          w * 0.8,
          h * 0.55, // End point
        )

        // Top-right bump
        ctx.bezierCurveTo(
          w * 0.85,
          h * 0.4, // Control point 1
          w * 0.75,
          h * 0.3, // Control point 2
          w * 0.6,
          h * 0.35, // End point
        )

        // Top-middle bump
        ctx.bezierCurveTo(
          w * 0.55,
          h * 0.2, // Control point 1
          w * 0.45,
          h * 0.2, // Control point 2
          w * 0.4,
          h * 0.35, // End point
        )

        // Top-left bump
        ctx.bezierCurveTo(
          w * 0.35,
          h * 0.25, // Control point 1
          w * 0.15,
          h * 0.35, // Control point 2
          w * 0.2,
          h * 0.55, // End point
        )

        // Left edge (curved)
        ctx.bezierCurveTo(
          w * 0.05,
          h * 0.6, // Control point 1
          w * 0.05,
          h * 0.8, // Control point 2
          w * 0.2,
          h * 0.8, // End point (back to start)
        )

        ctx.closePath()
        ctx.fill()

        // Add subtle golden gradient to give depth
        const gradient = ctx.createLinearGradient(0, 0, 0, h)
        gradient.addColorStop(0, "rgba(255, 245, 235, 0.95)")
        gradient.addColorStop(1, "rgba(255, 225, 195, 0.95)")

        ctx.fillStyle = gradient
        ctx.fill()

        ctx.restore()
      }
    }

    // Sun class for sunrise (modified to remove rays)
    class Sun {
      x: number
      y: number
      radius: number

      constructor() {
        this.x = width * 0.5
        this.y = height * 0.75
        this.radius = Math.min(width, height) * 0.08
      }

      draw() {
        if (!ctx) return

        // Draw sun glow
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius * 2)
        gradient.addColorStop(0, "rgba(255, 166, 66, 0.8)")
        gradient.addColorStop(0.5, "rgba(255, 166, 66, 0.3)")
        gradient.addColorStop(1, "rgba(255, 166, 66, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Draw sun
        ctx.fillStyle = "#ffa642"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let clouds: Cloud[] = []
    let sun: Sun

    // Initialize clouds and sun
    function initializeClouds() {
      clouds = []
      const cloudCount = Math.floor(width / 300) + 5

      for (let i = 0; i < cloudCount; i++) {
        const cloud = new Cloud()

        // Distribute clouds of different sizes
        if (i % 3 === 0) {
          // Smaller clouds
          cloud.width = Math.random() * 100 + 60
          cloud.height = cloud.width * 0.6
        } else if (i % 3 === 1) {
          // Medium clouds
          cloud.width = Math.random() * 150 + 100
          cloud.height = cloud.width * 0.6
        }

        // Distribute clouds across the screen initially
        cloud.x = Math.random() * width
        cloud.y = Math.random() * (height * 0.7)

        // Varied speeds based on size (smaller clouds move faster)
        cloud.speed = (Math.random() * 0.2 + 0.1) * (200 / cloud.width)

        clouds.push(cloud)
      }

      // Initialize sun
      sun = new Sun()
    }

    // Animation loop
    function animate() {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw sunrise gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0)
      gradient.addColorStop(0.0, "#ffa642")
      gradient.addColorStop(0.22, "#f2d580")
      gradient.addColorStop(0.34, "#decab2")
      gradient.addColorStop(0.62, "#8e9fa4")
      gradient.addColorStop(1.0, "#325571")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw sun
      sun.draw()

      // Update and draw clouds
      for (const cloud of clouds) {
        cloud.update()
        cloud.draw()
      }

      requestAnimationFrame(animate)
    }

    // Initialize
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
