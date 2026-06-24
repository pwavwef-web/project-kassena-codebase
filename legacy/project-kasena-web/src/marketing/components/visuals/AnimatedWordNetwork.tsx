import { usePrefersReducedMotion } from '../../lib/motion'

/**
 * Signature hero visual: Kasem language tokens condensing into a digital
 * language network, with baobab-inspired branching, data nodes and a soundwave
 * motif. Pure SVG (no WebGL) so it stays light on low-end mobile devices.
 *
 * The Kasem tokens are illustrative orthography samples that showcase the
 * special characters (ɛ Ŋ ŋ ɔ á) — they are not presented as verified
 * dictionary entries.
 */

interface Node {
  id: string
  x: number
  y: number
  r: number
  kind: 'core' | 'data' | 'word'
  label?: string
}

const nodes: Node[] = [
  { id: 'core', x: 280, y: 300, r: 9, kind: 'core' },
  { id: 'w1', x: 140, y: 150, r: 5, kind: 'word', label: 'Kasɛm' },
  { id: 'w2', x: 430, y: 140, r: 5, kind: 'word', label: 'tᵾ' },
  { id: 'w3', x: 470, y: 330, r: 5, kind: 'word', label: 'naŋa' },
  { id: 'w4', x: 360, y: 470, r: 5, kind: 'word', label: 'wↄ́' },
  { id: 'w5', x: 130, y: 410, r: 5, kind: 'word', label: 'báláŋ' },
  { id: 'd1', x: 220, y: 200, r: 3.5, kind: 'data' },
  { id: 'd2', x: 360, y: 220, r: 3.5, kind: 'data' },
  { id: 'd3', x: 400, y: 380, r: 3.5, kind: 'data' },
  { id: 'd4', x: 220, y: 400, r: 3.5, kind: 'data' },
  { id: 'd5', x: 180, y: 300, r: 3.5, kind: 'data' },
  { id: 'd6', x: 320, y: 360, r: 3.5, kind: 'data' },
  { id: 'd7', x: 300, y: 130, r: 3.5, kind: 'data' },
]

const edges: [string, string][] = [
  ['core', 'd1'],
  ['core', 'd2'],
  ['core', 'd3'],
  ['core', 'd4'],
  ['core', 'd5'],
  ['core', 'd6'],
  ['d1', 'w1'],
  ['d7', 'w1'],
  ['d2', 'w2'],
  ['d2', 'd7'],
  ['d3', 'w3'],
  ['d6', 'w4'],
  ['d4', 'w5'],
  ['d5', 'd4'],
  ['d6', 'd3'],
]

const nodeById = (id: string) => nodes.find((n) => n.id === id)!

export const AnimatedWordNetwork = ({
  className = '',
}: {
  className?: string
}) => {
  const reduced = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 560 600"
      className={className}
      role="img"
      aria-label="Illustration of Kasem language data converging into a digital network"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="pk-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d69b00" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#d69b00" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d69b00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pk-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5784bd" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#d69b00" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#b65a3a" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="pk-trunk" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1e365d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5784bd" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Baobab-inspired branching from the base. */}
      <g fill="none" stroke="url(#pk-trunk)" strokeLinecap="round">
        <path d="M280 600 C 280 520 270 470 280 420" strokeWidth="10" />
        <path d="M280 460 C 230 430 180 420 140 410" strokeWidth="4" />
        <path d="M280 470 C 330 440 380 440 430 430" strokeWidth="4" />
        <path d="M280 430 C 270 360 250 320 220 300" strokeWidth="3" />
        <path d="M280 430 C 300 360 330 330 360 320" strokeWidth="3" />
      </g>

      {/* Network edges. */}
      <g>
        {edges.map(([a, b], i) => {
          const na = nodeById(a)
          const nb = nodeById(b)
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="url(#pk-edge)"
              strokeWidth="1.25"
            >
              {!reduced ? (
                <animate
                  attributeName="stroke-opacity"
                  values="0.35;0.9;0.35"
                  dur={`${3 + (i % 4)}s`}
                  repeatCount="indefinite"
                />
              ) : null}
            </line>
          )
        })}
      </g>

      {/* Travelling signal along a primary edge. */}
      {!reduced ? (
        <circle r="3" fill="#fbf7ee">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M280 300 L 140 150" />
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>
      ) : null}

      {/* Core glow + node. */}
      <circle cx="280" cy="300" r="80" fill="url(#pk-core-glow)">
        {!reduced ? (
          <animate
            attributeName="r"
            values="70;90;70"
            dur="5s"
            repeatCount="indefinite"
          />
        ) : null}
      </circle>

      {/* Nodes. */}
      <g>
        {nodes.map((n) => {
          if (n.kind === 'word') {
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 12}
                  fill="#ffffff"
                  fillOpacity="0.06"
                  stroke="#d69b00"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  className="font-kasem"
                  fontSize="13"
                  fontWeight="700"
                  fill="#fbf7ee"
                >
                  {n.label}
                </text>
              </g>
            )
          }
          return (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.kind === 'core' ? '#d69b00' : '#7bbb91'}
              stroke="#fbf7ee"
              strokeOpacity="0.5"
              strokeWidth="0.75"
            >
              {!reduced && n.kind === 'data' ? (
                <animate
                  attributeName="fill-opacity"
                  values="0.6;1;0.6"
                  dur="2.6s"
                  begin={`${(Number(n.id.replace(/\D/g, '')) || 0) * 0.3}s`}
                  repeatCount="indefinite"
                />
              ) : null}
            </circle>
          )
        })}
      </g>

      {/* Soundwave motif at the base. */}
      <g transform="translate(280, 548)">
        {Array.from({ length: 17 }).map((_, i) => {
          const offset = i - 8
          const baseH = 6 + Math.abs(8 - Math.abs(offset)) * 2.4
          return (
            <rect
              key={i}
              x={offset * 11 - 2}
              y={-baseH / 2}
              width="3.5"
              height={baseH}
              rx="1.75"
              fill="#d87a55"
              fillOpacity={0.5 + (8 - Math.abs(offset)) * 0.05}
            >
              {!reduced ? (
                <animate
                  attributeName="height"
                  values={`${baseH};${baseH * 1.8};${baseH * 0.5};${baseH}`}
                  dur={`${1.2 + (Math.abs(offset) % 3) * 0.4}s`}
                  repeatCount="indefinite"
                />
              ) : null}
            </rect>
          )
        })}
      </g>
    </svg>
  )
}
