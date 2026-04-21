import type { PrintSettings } from '../lib/gcodeGenerator'

interface Props {
  settings: PrintSettings
  onChange: (s: PrintSettings) => void
}

function Field({ label, value, onChange, min, max, step, unit }: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-gray-400 shrink-0 w-32">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white text-right focus:border-violet-500 focus:outline-none"
        />
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  )
}

export function PrintSettingsPanel({ settings, onChange }: Props) {
  function set(key: keyof PrintSettings, value: number) {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-gray-300">Print Settings</span>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Bed</p>
        <Field label="Bed Width" value={settings.bedWidth} onChange={(v) => set('bedWidth', v)} unit="mm" min={1} />
        <Field label="Bed Height" value={settings.bedHeight} onChange={(v) => set('bedHeight', v)} unit="mm" min={1} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Pen Z</p>
        <Field label="Pen Down Z" value={settings.penDownZ} onChange={(v) => set('penDownZ', v)} unit="mm" step={0.1} />
        <Field label="Pen Up Z" value={settings.penUpZ} onChange={(v) => set('penUpZ', v)} unit="mm" min={0.1} step={0.1} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Speed</p>
        <Field label="Write Speed" value={settings.writeSpeed} onChange={(v) => set('writeSpeed', v)} unit="mm/min" min={100} />
        <Field label="Travel Speed" value={settings.travelSpeed} onChange={(v) => set('travelSpeed', v)} unit="mm/min" min={100} />
      </div>
    </div>
  )
}
