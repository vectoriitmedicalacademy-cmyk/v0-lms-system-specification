"use client"

import { motion } from "framer-motion"

// ---- Atom with orbiting electrons ----
export function AtomIcon({ size = 40, color = "hsl(var(--primary))", className = "" }: { size?: number; color?: string; className?: string }) {
  const r = size * 0.35
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Nucleus */}
      <circle cx={size / 2} cy={size / 2} r={size * 0.08} fill={color} opacity={0.7} />
      {/* Orbits */}
      {[0, 60, 120].map((angle) => (
        <ellipse
          key={angle}
          cx={size / 2}
          cy={size / 2}
          rx={r}
          ry={r * 0.4}
          fill="none"
          stroke={color}
          strokeWidth={1}
          opacity={0.3}
          transform={`rotate(${angle} ${size / 2} ${size / 2})`}
        />
      ))}
      {/* Electron dots */}
      {[0, 120, 240].map((startAngle, i) => (
        <motion.circle
          key={startAngle}
          r={size * 0.04}
          fill={color}
          opacity={0.6}
          animate={{
            cx: [
              size / 2 + r * Math.cos((startAngle * Math.PI) / 180),
              size / 2 - r * Math.cos((startAngle * Math.PI) / 180),
              size / 2 + r * Math.cos((startAngle * Math.PI) / 180),
            ],
            cy: [
              size / 2 + r * 0.4 * Math.sin((startAngle * Math.PI) / 180),
              size / 2 - r * 0.4 * Math.sin((startAngle * Math.PI) / 180),
              size / 2 + r * 0.4 * Math.sin((startAngle * Math.PI) / 180),
            ],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </motion.svg>
  )
}

// ---- DNA Helix ----
export function DNAHelix({ height = 120, color = "hsl(var(--primary))", className = "" }: { height?: number; color?: string; className?: string }) {
  const w = 30
  const steps = 8
  return (
    <motion.svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: steps }).map((_, i) => {
        const y = (height / steps) * i + height / (steps * 2)
        const phase = (i * Math.PI) / 2
        const x1 = w / 2 + Math.sin(phase) * 10
        const x2 = w / 2 - Math.sin(phase) * 10
        return (
          <g key={i}>
            <circle cx={x1} cy={y} r={2.5} fill={color} opacity={0.5} />
            <circle cx={x2} cy={y} r={2.5} fill={color} opacity={0.3} />
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1} opacity={0.15} strokeDasharray="2 2" />
          </g>
        )
      })}
    </motion.svg>
  )
}

// ---- Floating molecule ----
export function MoleculeIcon({ size = 36, color = "hsl(var(--primary))", className = "" }: { size?: number; color?: string; className?: string }) {
  const cx = size / 2
  const cy = size / 2
  const bondLen = size * 0.28
  const atoms = [
    { x: cx, y: cy },
    { x: cx + bondLen, y: cy - bondLen * 0.6 },
    { x: cx - bondLen, y: cy - bondLen * 0.4 },
    { x: cx, y: cy + bondLen },
  ]
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Bonds */}
      {atoms.slice(1).map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke={color} strokeWidth={1.5} opacity={0.25} />
      ))}
      {/* Atoms */}
      {atoms.map((a, i) => (
        <circle key={i} cx={a.x} cy={a.y} r={i === 0 ? size * 0.09 : size * 0.06} fill={color} opacity={i === 0 ? 0.6 : 0.4} />
      ))}
    </motion.svg>
  )
}

// ---- Beaker icon ----
export function BeakerIcon({ size = 32, color = "hsl(var(--primary))", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 4h8v0M12 4v10l-5 12h18L20 14V4" fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d="M8 22c2-1 4 1 6 0s4 1 6 0L20 14H12L8 22z"
        fill={color}
        opacity={0.12}
        animate={{ opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Bubbles */}
      <motion.circle cx={14} cy={20} r={1} fill={color} opacity={0.3} animate={{ cy: [20, 16, 20], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
      <motion.circle cx={17} cy={19} r={0.8} fill={color} opacity={0.25} animate={{ cy: [19, 15, 19], opacity: [0.25, 0, 0.25] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
    </motion.svg>
  )
}

// ---- Math symbol scattering ----
const mathSymbols = ["\u222B", "\u03A3", "\u0394", "\u03C0", "\u221E", "\u2207", "\u03B1", "\u03B2", "\u03B8", "\u03BB"]

export function FloatingMathSymbol({ symbol, delay = 0, x = 0, y = 0, className = "" }: { symbol?: string; delay?: number; x?: number; y?: number; className?: string }) {
  const sym = symbol || mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
  return (
    <motion.span
      className={`pointer-events-none select-none font-serif text-primary/15 ${className}`}
      style={{ position: "absolute", left: x, top: y, fontSize: "1.25rem" }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: [0, 0.3, 0], y: [6, -8, 6] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {sym}
    </motion.span>
  )
}

// ---- Orbital rings (decorative, around a child element) ----
export function OrbitalRing({ size = 80, color = "hsl(var(--primary))", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <ellipse
          cx={size / 2} cy={size / 2}
          rx={size / 2 - 2} ry={size * 0.22}
          fill="none" stroke={color} strokeWidth={1} opacity={0.18}
          strokeDasharray="4 4"
        />
      </svg>
    </motion.div>
  )
}

// ---- Circuit trace lines ----
export function CircuitTrace({ width = 120, color = "hsl(var(--primary))", className = "" }: { width?: number; color?: string; className?: string }) {
  return (
    <svg width={width} height={20} viewBox={`0 0 ${width} 20`} className={className}>
      <motion.line
        x1={0} y1={10} x2={width * 0.3} y2={10}
        stroke={color} strokeWidth={1.5} opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      <motion.line
        x1={width * 0.3} y1={10} x2={width * 0.35} y2={3}
        stroke={color} strokeWidth={1.5} opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
      <motion.line
        x1={width * 0.35} y1={3} x2={width * 0.65} y2={17}
        stroke={color} strokeWidth={1.5} opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      <motion.line
        x1={width * 0.65} y1={17} x2={width * 0.7} y2={10}
        stroke={color} strokeWidth={1.5} opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.line
        x1={width * 0.7} y1={10} x2={width} y2={10}
        stroke={color} strokeWidth={1.5} opacity={0.15}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
      <motion.circle
        cx={width * 0.5}
        cy={10}
        r={3}
        fill={color}
        opacity={0}
        animate={{ opacity: [0, 0.4, 0], cx: [0, width] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
    </svg>
  )
}

// ---- Floating background particles (combined set for a page background) ----
export function ScienceBackgroundParticles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Floating math symbols */}
      <FloatingMathSymbol symbol={"\u222B"} x={40} y={60} delay={0} />
      <FloatingMathSymbol symbol={"\u03A3"} x={180} y={30} delay={1.2} />
      <FloatingMathSymbol symbol={"\u0394"} x={320} y={90} delay={0.5} />
      <FloatingMathSymbol symbol={"\u03C0"} x={80} y={200} delay={2} />
      <FloatingMathSymbol symbol={"\u221E"} x={260} y={170} delay={0.8} />
      <FloatingMathSymbol symbol={"\u03B8"} x={420} y={50} delay={1.5} />
      <FloatingMathSymbol symbol={"\u2207"} x={150} y={130} delay={3} />
      <FloatingMathSymbol symbol={"E=mc\u00B2"} x={350} y={140} delay={2.5} className="text-xs" />

      {/* Atom in top-right area */}
      <div className="absolute right-8 top-12">
        <AtomIcon size={48} />
      </div>

      {/* Molecule in bottom-left */}
      <div className="absolute bottom-16 left-12">
        <MoleculeIcon size={40} />
      </div>

      {/* Beaker top-left */}
      <div className="absolute left-6 top-20">
        <BeakerIcon size={28} />
      </div>
    </div>
  )
}
