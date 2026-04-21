import * as opentype from 'opentype.js'

export interface GlyphStroke {
  commands: opentype.PathCommand[]
}

export interface FontProfile {
  id: string
  name: string
  font: opentype.Font
}

export function loadFontFromBuffer(buffer: ArrayBuffer, name: string): FontProfile {
  const font = opentype.parse(buffer)
  return {
    id: crypto.randomUUID(),
    name,
    font,
  }
}

export function textToStrokes(
  text: string,
  profile: FontProfile,
  options: {
    fontSize: number
    letterSpacing: number
    lineHeight: number
    maxWidth: number
    marginX: number
    marginY: number
  }
): GlyphStroke[][] {
  const { font } = profile
  const { fontSize, letterSpacing, lineHeight, maxWidth, marginX, marginY } = options
  const scale = (1 / font.unitsPerEm) * fontSize

  const lines = wrapText(text, font, fontSize, letterSpacing, maxWidth)
  const result: GlyphStroke[][] = []

  lines.forEach((line, lineIdx) => {
    const y = marginY + lineIdx * lineHeight
    let x = marginX

    for (const char of line) {
      const glyph = font.charToGlyph(char)
      if (!glyph) {
        x += fontSize * 0.3
        continue
      }

      const path = glyph.getPath(x, y, fontSize)
      if (path.commands.length > 0) {
        result.push([{ commands: path.commands }])
      }

      const advance = (glyph.advanceWidth ?? 0) * scale
      x += advance + letterSpacing
    }
  })

  return result
}

function wrapText(
  text: string,
  font: opentype.Font,
  fontSize: number,
  letterSpacing: number,
  maxWidth: number
): string[] {
  const scale = (1 / font.unitsPerEm) * fontSize
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    const width = measureText(test, font, scale, letterSpacing)
    if (width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function measureText(text: string, font: opentype.Font, scale: number, letterSpacing: number): number {
  let width = 0
  for (const char of text) {
    const glyph = font.charToGlyph(char)
    width += (glyph?.advanceWidth ?? 0) * scale + letterSpacing
  }
  return width
}
