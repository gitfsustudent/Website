import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import './App.css'

type Tool = 'pen' | 'eraser'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [tool, setTool] = useState<Tool>('pen')
 const [penActive, setPenActive] = useState(false)
 const [penSize, setPenSize] = useState(3)
 const [eraserSize, setEraserSize] = useState(20)
 const [isDrawing, setIsDrawing] = useState(false)
 const [toolsMinimized, setToolsMinimized] = useState(false)

  // Make the drawing canvas cover the ENTIRE webpage
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = document.documentElement.scrollHeight

      canvas.width = width
      canvas.height = height

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(document.body)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      observer.disconnect()
    }
  }, [])

  // Get the mouse position relative to the ENTIRE webpage
  const getPosition = (event: PointerEvent<HTMLCanvasElement>) => {
    return {
      x: event.clientX,
      y: event.clientY + window.scrollY,
    }
  }

  // Start drawing
  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!penActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPosition(event)

    ctx.beginPath()
    ctx.moveTo(x, y)

    setIsDrawing(true)
  }

  // Draw
  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!penActive || !isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getPosition(event)

    // Eraser
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = eraserSize
    }

    // Pen
    else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#2b2420'
      ctx.lineWidth = penSize
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'source-over'
  }

  // Erase entire drawing
  const eraseEverything = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Turn drawing mode on/off
  const togglePen = () => {
    setPenActive((current) => !current)

    if (penActive) {
      setTool('pen')
    }
  }

  return (
    <>
      {/* =========================
          DRAWING CANVAS
          ========================= */}
      <canvas
        ref={canvasRef}
        className={`drawing-canvas ${
          penActive ? 'pen-active' : ''
        }`}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
      />

      {/* =========================
          DRAWING TOOLBAR
          ========================= */}
      {penActive && (
        <div
          className={`drawing-toolbar ${
            toolsMinimized ? 'tools-minimized' : ''
          }`}
        >
          {/* Toolbar Header */}
          <div className="toolbar-header">
            <div className="toolbar-title">
              ✎ Drawing Tools
            </div>

            <button
              type="button"
              className="minimize-button"
              onClick={() =>
                setToolsMinimized((current) => !current)
              }
              aria-label={
                toolsMinimized
                  ? 'Expand drawing tools'
                  : 'Minimize drawing tools'
              }
            >
              {toolsMinimized ? '+' : '−'}
            </button>
          </div>

          {/* Drawing Controls */}
          {!toolsMinimized && (
            <>
              {/* Pen / Eraser */}
              <div className="tool-buttons">

                <button
                  type="button"
                  className={tool === 'pen' ? 'tool-selected' : ''}
                  onClick={() => setTool('pen')}
                >
                   Pen
                </button>

                <button
                  type="button"
                  className={tool === 'eraser' ? 'tool-selected' : ''}
                  onClick={() => setTool('eraser')}
                >
                  ◻ Eraser
                </button>

              </div>

              {/* Pen Size */}
              {tool === 'pen' && (
                <>
                  <label>
                    Pen Size: {penSize}px
                  </label>

                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={penSize}
                    onChange={(event) =>
                      setPenSize(Number(event.target.value))
                    }
                  />
                </>
              )}

              {/* Eraser Size */}
              {tool === 'eraser' && (
                <>
                  <label>
                    Eraser Size: {eraserSize}px
                  </label>

                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={eraserSize}
                    onChange={(event) =>
                      setEraserSize(Number(event.target.value))
                    }
                  />
                </>
              )}

              {/* Erase Everything */}
              <button
                type="button"
                className="erase-all"
                onClick={eraseEverything}
              >
                Erase Everything
              </button>

              {/* Turn Tool Off */}
              <button
                type="button"
                className="put-away"
                onClick={togglePen}
              >
                Put Pen Away
              </button>
            </>
          )}
        </div>
      )}

      {/* =========================
          HOME / INTRO
          ========================= */}
      <section id="center">

        <div className="hero">
          <img
            src={`${import.meta.env.BASE_URL}medrawing.jpg`}
            alt="Me Drawing"
            width="170"
          />
        </div>

        <div>
          <h1>About Me</h1>

          <p>
            <em>let your creativity shine through</em>
          </p>
        </div>

        {/* CLICK BUTTON */}
        <button
          type="button"
          className="paper-button"
          onClick={togglePen}
        >
          CLICK
        </button>

      </section>

      <div className="ticks"></div>

      {/* =========================
          ABOUT ME
          ========================= */}
      <section id="about" className="content-section">

        <h2>About Me</h2>

        <p>
          I'm Joshua a computer science gradute student. I enjoy programming, technology,
          troubleshooting, creating new projects as well as personal hobbies such as cooking and reading.
        </p>

      </section>

      {/* =========================
          EDUCATION
          ========================= */}
      <section id="education" className="content-section">

        <h2>Education</h2>

        <h3>Edward Waters University</h3>

        <p>
          Bachelor of Science in Computer Science
        </p>

        <p>
          August 2024 – May 2026
        </p>

        <p>
          GPA: 3.4
        </p>

        <p>
          I studied Computer Science with coursework including
          Information Security, Database Management, Internet
          Programming, Data Structures, Data Mining, Data Analytics,
          Python for Data Analytics, and Network Management Technology.
        </p>

      </section>

      {/* =========================
          WORK EXPERIENCE
          ========================= */}
      <section id="work" className="content-section">

        <h2>Work Experience</h2>

        <h3>Pareto Clinic</h3>

        <p>
          <strong>Healthcare IT Specialist</strong>
        </p>

        <p>
          October 2023 – July 2026
        </p>

        <ul>

          <li>
            Configured and integrated multiple computers into a
            secure network infrastructure.
          </li>

          <li>
            Diagnosed and resolved network, software, server,
            and device-related technical issues.
          </li>

          <li>
            Integrated and configured the Weave phone system
            across the workplace.
          </li>

          <li>
            Set up physical desk phones at workstations and
            configured Weave–VoiceOC integrations.
          </li>

          <li>
            Assisted with the design and implementation of
            new network infrastructure.
          </li>

          <li>
            Configured Aruba Instant On switches and supported
            Ubiquiti UniFi Cloud Gateway network monitoring.
          </li>

          <li>
            Supported network and cable management, cloud
            computing, domain management, and server management.
          </li>

          <li>
            Provided remote desktop troubleshooting and access
            for staff and workstations.
          </li>

          <li>
            Prepared and imaged computers for end-user deployment.
          </li>

          <li>
            Assisted with endpoint management, software deployment,
            remote support, and patch management using Action1.
          </li>

          <li>
            Supported deployment and setup of Ubiquiti UniFi Wi-Fi
            access points.
          </li>

          <li>
            Set up complete workstation environments including
            computers, monitors, peripherals, and network connectivity.
          </li>

        </ul>

      </section>

      {/* =========================
          PROJECTS
          ========================= */}
      <section id="projects" className="content-section">

        <h2>Projects</h2>

        <h3>Personal Website</h3>

        <p>
          This website is one of my personal projects.
        </p>

        <h3>Other Projects</h3>

        <p>
          More projects coming soon.
        </p>

      </section>

      {/* =========================
          SKILLS
          ========================= */}
      <section id="skills" className="content-section">

        <h2>Skills</h2>

        <ul>
          <li>Java</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>SQL</li>
          <li>Python</li>
          <li>C++</li>
          <li>Computer Networking</li>
          <li>Cloud Computing</li>
        </ul>

      </section>

      {/* =========================
          CONTACT
          ========================= */}
      <section id="contact" className="content-section">

        <h2>Contact</h2>

        <p>
          Thanks for visiting my website!
        </p>

      </section>

      <div className="ticks"></div>
    </>
  )
}

export default App