"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [seconds, setSeconds] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const contentSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 60)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatTime = () => {
    return `05:31:${seconds.toString().padStart(2, "0")}`
  }

  const getTimeScale = () => {
    if (scrollY < 100) return 1
    const scale = Math.max(0.3, 1 - (scrollY - 100) / 200)
    return scale
  }

  const getTimeOpacity = () => {
    if (scrollY < 100) return 1
    return Math.max(0, 1 - (scrollY - 100) / 100)
  }

  const getLogoOpacity = () => {
    if (scrollY < 150) return 0
    return Math.min(1, (scrollY - 150) / 50)
  }

  const scrollToNextSection = () => {
    if (contentSectionRef.current) {
      const targetPosition = contentSectionRef.current.offsetTop
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 2000 // 2 seconds for slower scroll
      let start: number | null = null

      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const progressPercentage = Math.min(progress / duration, 1)
        
        // Easing function for smoother animation
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        
        const easedProgress = easeInOutCubic(progressPercentage)
        window.scrollTo(0, startPosition + distance * easedProgress)
        
        if (progress < duration) {
          window.requestAnimationFrame(step)
        }
      }
      
      window.requestAnimationFrame(step)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black/90 backdrop-blur-sm border-b border-white/10" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-center items-center">
            <div
              className="text-2xl font-bold glow-text transition-opacity duration-300"
              style={{ opacity: getLogoOpacity() }}
            >
              531
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Time Display */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black"></div>
        <div
          className="text-center z-10 transition-all duration-700 ease-out"
          style={{
            transform: `scale(${getTimeScale()}) translateY(${isScrolled ? "-40vh" : "0"})`,
            opacity: getTimeOpacity(),
          }}
        >
          <div className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wider">{formatTime()}</div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group"
          onClick={scrollToNextSection}
        >
          <div className="w-1 h-3 bg-white/50 group-hover:bg-white/80 mt-2 animate-pulse transition-colors duration-900"></div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentSectionRef} className="min-h-screen py-20 px-6">
        <div className="container mx-auto max-w-6xl lg:my-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Built After Hours.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Made to Last.
                </span>
              </h1>

              <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
                <p>
                  531 Dev is an independent development studio founded on creating software experiments, 
                  passion projects, and creative tools that solve real problems.
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end w-full">
              <ASCIIDonut />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section className="py-20 px-6 bg-gradient-to-t from-gray-900/20 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Build the Future?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's discuss how we can transform your vision into cutting-edge technology solutions.
            </p>
            <div className="pt-8">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                Get In Contact
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center">
          {/* <div className="text-2xl font-bold mb-4 glow-text">531</div> */}
          <p className="text-gray-400">© 2025 531 Dev.</p>
        </div>
      </footer>
    </div>
  )
}

function ASCIIDonut() {
  const canvasRef = useRef<HTMLPreElement>(null)
  const [A, setA] = useState(0)
  const [B, setB] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setA((prev) => prev + 0.07)
      setB((prev) => prev + 0.03)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const width = 80
    const height = 22
    const output = new Array(width * height).fill(" ")
    const zbuffer = new Array(width * height).fill(0)

    const chars = ".,-~:;=!*531"
    const colors = [
      "#ffffff",
    ]

    for (let j = 0; j < 6.28; j += 0.07) {
      for (let i = 0; i < 6.28; i += 0.02) {
        const c = Math.sin(i)
        const d = Math.cos(j)
        const e = Math.sin(A)
        const f = Math.sin(j)
        const g = Math.cos(A)
        const h = d + 2
        const D = 1 / (c * h * e + f * g + 5)
        const l = Math.cos(i)
        const m = Math.cos(B)
        const n = Math.sin(B)
        const t = c * h * g - f * e
        const x = Math.floor(40 + 30 * D * (l * h * m - t * n))
        const y = Math.floor(12 + 15 * D * (l * h * n + t * m))
        const o = Math.floor(x + width * y)
        const N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n))

        if (y < height && y >= 0 && x >= 0 && x < width && D > zbuffer[o]) {
          zbuffer[o] = D
          const charIndex = Math.max(0, N)
          output[o] = chars[charIndex % chars.length]
        }
      }
    }

    if (canvasRef.current) {
      const lines = []
      for (let k = 0; k < height; k++) {
        const line = output.slice(k * width, (k + 1) * width).join("")
        lines.push(line)
      }

      canvasRef.current.innerHTML = lines
        .map((line) => {
          return line
            .split("")
            .map((char) => {
              if (char === " ") return char
              const color = colors[Math.floor(Math.random() * colors.length)]
              return `<span style="color: ${color}">${char}</span>`
            })
            .join("")
        })
        .join("\n")
    }
  }, [A, B])

  return (
    <pre
      ref={canvasRef}
      className="font-mono text-xs leading-tight w-full max-w-sm lg:max-w-md xl:max-w-lg text-center"
      style={{
        height: "350px",
        aspectRatio: "1.3/1",
      }}
    />
  )
}
