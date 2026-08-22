import type { TimelineState } from './timeline'

interface Props {
  state: TimelineState
}

const nodes = [
  ['WhatsApp', 15, 26],
  ['Website', 15, 50],
  ['Phone', 15, 74],
  ['MEMORY', 50, 50],
  ['AI', 76, 34],
  ['ACTION', 76, 66],
]

export function WireframeLayer({ state }: Props) {
  const opacity = Math.max(0, Math.min(1, (state.digitalOpacity - 0.15) * 1.5))

  return (
    <svg className="wireframe-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ opacity }}>
      <defs>
        <linearGradient id="wirePulse" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(210,150,255,0.95)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g className="wire-grid">
        {Array.from({ length: 11 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />)}
        {Array.from({ length: 11 }).map((_, i) => <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />)}
      </g>
      <g className="wire-links">
        <path d="M15 26 C28 26 34 43 50 50" />
        <path d="M15 50 C29 50 36 50 50 50" />
        <path d="M15 74 C29 74 34 57 50 50" />
        <path d="M50 50 C61 50 65 37 76 34" />
        <path d="M50 50 C62 50 66 63 76 66" />
        <path className="wire-flow" d="M15 50 C29 50 36 50 50 50 C61 50 65 37 76 34" />
      </g>
      <g className="wire-nodes">
        {nodes.map(([label, x, y]) => (
          <g key={label} transform={`translate(${x} ${y})`}>
            <circle r={label === 'MEMORY' ? 6 : 3.5} />
            <text y="10" textAnchor="middle">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}
