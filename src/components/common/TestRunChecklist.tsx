const checklistItems = [
  'Google Sign-In works',
  'User document created',
  'Contribution submitted',
  'File upload works',
  'Admin can approve contribution',
  'Approved entry appears in dictionary',
  'Admin can reject contribution',
  'Upload review works',
  'Firestore rules deployed',
  'Storage rules deployed',
  'Firebase hosting deploy successful',
]

export const TestRunChecklist = () => {
  return (
    <section className="rounded-2xl border border-kassena-gold/40 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-kassena-green">
        Test Run Checklist
      </h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {checklistItems.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <input type="checkbox" aria-label={item} className="mt-1" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
