import { useEffect, useState } from 'react'
import { AlertMessage } from '../../components/common/AlertMessage'
import { getAppSettings, upsertAppSettings } from '../../lib/firestore'
import type { AppSettings } from '../../types'

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Omit<AppSettings, 'updatedAt'>>({
    appName: 'Project Kassena',
    launchMode: 'mvp',
    allowPublicSubmissions: false,
  })
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    getAppSettings().then((result) => {
      if (result) {
        setSettings({
          appName: result.appName,
          launchMode: result.launchMode,
          allowPublicSubmissions: result.allowPublicSubmissions,
        })
      }
    })
  }, [])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await upsertAppSettings(settings)
    setFeedback('Settings saved.')
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">Admin Settings</h1>
      {feedback ? <AlertMessage type="success" message={feedback} /> : null}
      <form className="space-y-4" onSubmit={handleSave}>
        <label className="block space-y-1 text-sm">
          <span>App name</span>
          <input
            value={settings.appName}
            onChange={(event) =>
              setSettings((prev) => ({ ...prev, appName: event.target.value }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Launch mode</span>
          <select
            value={settings.launchMode}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                launchMode: event.target.value as 'mvp' | 'open',
              }))
            }
            className="w-full rounded-lg border border-kassena-cream px-3 py-2"
          >
            <option value="mvp">MVP</option>
            <option value="open">Open</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.allowPublicSubmissions}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                allowPublicSubmissions: event.target.checked,
              }))
            }
          />
          <span>Allow public submissions</span>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-kassena-green px-4 py-2 text-white"
        >
          Save settings
        </button>
      </form>
    </section>
  )
}
