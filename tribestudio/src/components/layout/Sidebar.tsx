// Placeholder sidebar. Navigation, role-aware sections and active states are
// added in the full build. Reference: legacy/project-kasena-web admin app.
const SECTIONS = [
  { label: 'Overview', items: ['Dashboard'] },
  { label: 'Contribute', items: ['Submissions', 'Uploads', 'Translation'] },
  { label: 'Validate', items: ['Review queue', 'Dictionary'] },
  { label: 'Manage', items: ['Members', 'Settings'] },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-panel md:flex">
      <div className="px-5 py-5">
        <span className="font-display text-lg font-semibold">
          Tribe<span className="text-terracotta">Studio</span>
        </span>
      </div>
      <nav aria-label="Workspace" className="flex-1 space-y-6 px-3 py-2">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
              {section.label}
            </p>
            <ul className="mt-1 space-y-0.5">
              {section.items.map((item) => (
                <li key={item}>
                  <span className="block rounded-md px-2 py-1.5 text-sm text-ink/70 hover:bg-surface">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
