import { useRef } from 'react'
import type { FontProfile } from '../lib/fontParser'
import { loadFontFromBuffer } from '../lib/fontParser'

interface Props {
  profiles: FontProfile[]
  selected: string | null
  onAdd: (profile: FontProfile) => void
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

export function FontManager({ profiles, selected, onAdd, onSelect, onRemove }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const profile = loadFontFromBuffer(reader.result as ArrayBuffer, file.name.replace(/\.[^.]+$/, ''))
        onAdd(profile)
        onSelect(profile.id)
      } catch {
        alert('Could not load font — make sure it is a valid TTF or OTF file.')
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Font Profiles</span>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-colors"
        >
          + Import Font
        </button>
        <input ref={fileRef} type="file" accept=".ttf,.otf" className="hidden" onChange={handleFile} />
      </div>

      {profiles.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-4 border border-dashed border-gray-700 rounded-lg">
          Import a TTF or OTF font file to get started
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {profiles.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
              selected === p.id
                ? 'bg-violet-900/40 border-violet-500 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            <span className="text-sm truncate">{p.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(p.id) }}
              className="text-gray-500 hover:text-red-400 ml-2 text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
