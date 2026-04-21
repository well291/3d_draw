import { useMemo } from 'react'
import type { GlyphStroke } from '../lib/fontParser'
import type { PrintSettings } from '../lib/gcodeGenerator'

interface Props {
  strokes: GlyphStroke[][]
  printSettings: PrintSettings
}

export function Preview({ strokes, printSettings }: Props) {
  const { bedWidth, bedHeight } = printSettings

  const svgPaths = useMemo(() => {
    return strokes.flatMap((glyphStrokes) =>
      glyphStrokes.map((stroke, si) => {
        const d = stroke.commands.map((cmd) => {
          switch (cmd.type) {
            case 'M': return `M ${cmd.x} ${cmd.y}`
            case 'L': return `L ${cmd.x} ${cmd.y}`
            case 'C': return `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y}`
            case 'Q': return `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y}`
            case 'Z': return 'Z'
            default: return ''
          }
        }).join(' ')
        return <path key={si} d={d} stroke="#a78bfa" strokeWidth="0.3" fill="none" />
      })
    )
  }, [strokes])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Preview</span>
        <span className="text-xs text-gray-500">{bedWidth} × {bedHeight} mm</span>
      </div>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-700">
        <svg
          viewBox={`0 0 ${bedWidth} ${bedHeight}`}
          width="100%"
          style={{ display: 'block', background: '#fffef8' }}
        >
          {/* Bed border */}
          <rect x="0" y="0" width={bedWidth} height={bedHeight} fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
          {svgPaths}
        </svg>
      </div>
      {strokes.length === 0 && (
        <p className="text-xs text-gray-600 text-center -mt-1">Enter text and select a font to preview</p>
      )}
    </div>
  )
}
