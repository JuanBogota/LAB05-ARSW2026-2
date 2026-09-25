import { useEffect, useRef } from 'react'

export default function BlueprintCanvas({ points = [], width = 520, height = 360 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(148,163,184,0.15)'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    const padding = 30
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const minX = points.length ? Math.min(...xs) : 0
    const maxX = points.length ? Math.max(...xs) : 0
    const minY = points.length ? Math.min(...ys) : 0
    const maxY = points.length ? Math.max(...ys) : 0
    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1
    const scale = Math.min(
          (canvas.width - padding * 2) / rangeX,
          (canvas.height - padding * 2) / rangeY,
        )
        const toScreen = (p) => ({
          x: padding + (p.x - minX) * scale,
          y: padding + (p.y - minY) * scale,
        })

        if (points.length > 1) {
          ctx.strokeStyle = '#93c5fd'
          ctx.lineWidth = 2
          ctx.beginPath()
          const first = toScreen(points[0])
          ctx.moveTo(first.x, first.y)
          for (let i = 1; i < points.length; i++) {
            const sp = toScreen(points[i])
            ctx.lineTo(sp.x, sp.y)
          }
          ctx.stroke()
        }
        ctx.fillStyle = '#fbbf24'
    for (const p of points) {
        const sp = toScreen(p)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2)
        ctx.fill()
    }
  }, [points])

  return (
    <canvas
      id="blueprint-canvas"
      ref={ref}
      width={width}
      height={height}
      style={{
        background: '#0b1220',
        border: '1px solid #334155',
        borderRadius: 12,
        width: '100%',
        maxWidth: width,
      }}
    />
  )
}
