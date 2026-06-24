// Placeholder top navigation bar (search / account live here in the full build).
export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-ink/10 bg-panel px-5">
      <p className="text-sm font-medium text-ink/70">Workspace</p>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-surface px-3 py-1 text-xs text-ink/60">
          Starter shell
        </span>
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-full bg-indigo text-xs font-semibold text-white"
        >
          IW
        </span>
      </div>
    </header>
  )
}
