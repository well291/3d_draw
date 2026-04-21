import { useState, useMemo } from 'react'
import { FontManager } from './components/FontManager'
import { PrintSettingsPanel } from './components/PrintSettingsPanel'
import { TextSettingsPanel } from './components/TextSettingsPanel'
import type { TextSettings } from './components/TextSettingsPanel'
import { Preview } from './components/Preview'
import type { FontProfile } from './lib/fontParser'
import { textToStrokes } from './lib/fontParser'
import { generateGCode, DEFAULT_SETTINGS } from './lib/gcodeGenerator'
import type { PrintSettings } from './lib/gcodeGenerator'
import './index.css'

const DEFAULT_TEXT_SETTINGS: TextSettings = {
  fontSize: 10,
  letterSpacing: 0.5,
  lineHeight: 15,
  marginX: 10,
  marginY: 20,
}

export default function App() {
  const [text, setText] = useState('')
  const [profiles, setProfiles] = useState<FontProfile[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_SETTINGS)
  const [textSettings, setTextSettings] = useState<TextSettings>(DEFAULT_TEXT_SETTINGS)

  const selectedProfile = profiles.find((p) => p.id === selectedId) ?? null

  const strokes = useMemo(() => {
    if (!selectedProfile || !text.trim()) return []
    try {
      return textToStrokes(text, selectedProfile, {
        ...textSettings,
        maxWidth: printSettings.bedWidth - textSettings.marginX * 2,
      })
    } catch {
      return []
    }
  }, [text, selectedProfile, textSettings, printSettings.bedWidth])

  function handleExport() {
    if (!strokes.length) return
    const gcode = generateGCode(strokes, printSettings)
    const blob = new Blob([gcode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'handwriting.gcode'
    a.click()
    URL.revokeObjectURL(url)
  }

  function removeProfile(id: string) {
    setProfiles((p) => p.filter((x) => x.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white m-0">3D Writer</h1>
          <p className="text-xs text-gray-500 m-0">Prusa pen plotter — GCODE generator</p>
        </div>
        <button
          onClick={handleExport}
          disabled={strokes.length === 0}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors font-medium"
        >
          Export GCODE
        </button>
      </header>

      <div className="flex flex-1" style={{ minHeight: 0 }}>
        {/* Left sidebar */}
        <aside className="w-64 shrink-0 border-r border-gray-800 overflow-y-auto p-4 flex flex-col gap-5">
          <FontManager
            profiles={profiles}
            selected={selectedId}
            onAdd={(p) => setProfiles((prev) => [...prev, p])}
            onSelect={setSelectedId}
            onRemove={removeProfile}
          />
          <hr className="border-gray-800" />
          <TextSettingsPanel settings={textSettings} onChange={setTextSettings} />
          <hr className="border-gray-800" />
          <PrintSettingsPanel settings={printSettings} onChange={setPrintSettings} />
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col p-5 gap-5 overflow-y-auto min-w-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Text to Write</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here…"
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm resize-none focus:border-violet-500 focus:outline-none placeholder-gray-600"
            />
          </div>

          <Preview strokes={strokes} printSettings={printSettings} />
        </main>
      </div>
    </div>
  )
}
