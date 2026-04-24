// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCSV<T extends Record<string, any>>(
  rows: T[],
  columns: { key: keyof T & string; header: string }[],
  filename: string,
) {
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`

  const csv = [
    columns.map((c) => c.header).join(","),
    ...rows.map((r) => columns.map((c) => escape(r[c.key])).join(",")),
  ].join("\n")

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
