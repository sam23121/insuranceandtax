/** Generate "HH:mm" strings from start to end inclusive, stepping by interval minutes. */
export function generateTimeStrings(start: string, end: string, intervalMinutes: number): string[] {
  const parse = (s: string) => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m
  }
  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
  const out: string[] = []
  let cur = parse(start)
  const endM = parse(end)
  while (cur <= endM) {
    out.push(fmt(cur))
    cur += intervalMinutes
  }
  return out
}
