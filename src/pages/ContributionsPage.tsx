import { Link } from 'react-router-dom'

const ArrowIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

const UploadIcon = () => (
  <svg
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
  </svg>
)

const DictionaryIcon = () => (
  <svg
    className="h-7 w-7"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
    <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20" />
    <path d="M9 6h7" />
    <path d="M9 9h5" />
  </svg>
)

export const ContributionsPage = () => {
  return (
    <section className="mx-auto max-w-[460px] space-y-5 md:max-w-5xl">
      <div className="rounded-[24px] bg-[#173323] p-5 text-white shadow-[0_24px_60px_rgba(20,83,45,0.22)] md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kassena-gold">
          Preserve Kasem
        </p>
        <h1 className="mt-2 text-3xl font-black">Contributions</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-kassena-cream/85">
          Choose how you want to help today. Upload source materials for review
          or add a dictionary contribution for validators to approve.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(20,83,45,0.09)] ring-1 ring-kassena-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-kassena-gold/20 text-[#6d5114] ring-1 ring-kassena-gold/20">
            <UploadIcon />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#173323]">
            Upload materials
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share audio, documents, field notes, or cultural files that can
            strengthen the Kasem language archive.
          </p>
          <Link
            to="/uploads"
            className="mt-5 flex items-center justify-between rounded-2xl bg-kassena-orange px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(201,106,45,0.22)] transition-transform active:scale-[0.98]"
          >
            Upload
            <ArrowIcon />
          </Link>
        </article>

        <article className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(20,83,45,0.09)] ring-1 ring-kassena-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-50 text-kassena-green ring-1 ring-emerald-100">
            <DictionaryIcon />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#173323]">
            Dictionary contributions
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add Kasem words, translations, examples, dialect notes, and cultural
            usage details for community validation.
          </p>
          <Link
            to="/submit"
            className="mt-5 flex items-center justify-between rounded-2xl bg-kassena-green px-4 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(20,83,45,0.22)] transition-transform active:scale-[0.98]"
          >
            Add dictionary entry
            <ArrowIcon />
          </Link>
        </article>
      </div>
    </section>
  )
}
