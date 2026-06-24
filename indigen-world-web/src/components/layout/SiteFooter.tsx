// Placeholder footer for the Indigen World public site.
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm">
        <p className="font-display text-base font-semibold">Indigen World</p>
        <p className="text-cream/60">
          A cultural technology ecosystem. Project Kasena is its flagship Kasem
          language programme.
        </p>
        <p className="mt-2 text-cream/40">© {year} Indigen World. Starter shell.</p>
      </div>
    </footer>
  )
}
