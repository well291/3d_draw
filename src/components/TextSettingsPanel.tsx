interface TextSettings {
  fontSize: number
  letterSpacing: number
  lineHeight: number
  marginX: number
  marginY: number
}

interface Props {
  settings: TextSettings
  onChange: (s: TextSettings) => void
}

function Field({ label, value, onChange, min, step, unit }: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  step?: number
  unit?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-gray-400 shrink-0 w-28">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          step={step ?? 1}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white text-right focus:border-violet-500 focus:outline-none"
        />
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  )
}

export type { TextSettings }

export function TextSettingsPanel({ settings, onChange }: Props) {
  function set(key: keyof TextSettings, value: number) {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-gray-300">Text Settings</span>
      <div className="flex flex-col gap-2">
        <Field label="Font Size" value={settings.fontSize} onChange={(v) => set('fontSize', v)} unit="mm" min={1} step={0.5} />
        <Field label="Letter Spacing" value={settings.letterSpacing} onChange={(v) => set('letterSpacing', v)} unit="mm" step={0.1} />
        <Field label="Line Height" value={settings.lineHeight} onChange={(v) => set('lineHeight', v)} unit="mm" min={1} step={0.5} />
        <Field label="Margin X" value={settings.marginX} onChange={(v) => set('marginX', v)} unit="mm" min={0} />
        <Field label="Margin Y" value={settings.marginY} onChange={(v) => set('marginY', v)} unit="mm" min={0} />
      </div>
    </div>
  )
}
