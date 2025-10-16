'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_settings')
        .select('key, value')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching settings:', error)
        setLoading(false)
        return
      }

      const obj: Record<string, any> = {}
      data?.forEach((row) => {
        obj[row.key] = row.value
      })
      setSettings(obj)
      setLoading(false)
    }

    fetchSettings()
  }, [supabase])

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // list setting keys yang pasti disimpan
    const keys = ['language', 'timezone', 'notify_email', 'notify_push']

    const updates = keys.map((key) => ({
      user_id: user.id,
      key,
      value: String(settings[key] ?? ''), // selalu string, default empty kalau belum ada
    }))

    const { error } = await supabase.from('user_settings').upsert(updates, {
      onConflict: 'user_id,key',
    })

    setSaving(false)

    if (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } else {
      alert('Settings saved successfully!')
    }
  }


  if (loading) {
    return <div className="p-6 text-gray-500">Loading settings...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Settings</h1>
  
      {/* Language */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Language</h2>
        <select
          className="border rounded-lg px-3 py-2 w-full max-w-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          value={settings.language ?? 'English'}  // default English
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <option>English</option>
          <option>Bahasa Indonesia</option>
          <option>日本語</option>
        </select>
      </div>
  
      {/* Timezone */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Timezone</h2>
        <select
          className="border rounded-lg px-3 py-2 w-full max-w-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          value={settings.timezone ?? 'GMT+7 (Jakarta)'} // default Jakarta
          onChange={(e) => handleChange('timezone', e.target.value)}
        >
          <option>GMT+7 (Jakarta)</option>
          <option>GMT+9 (Tokyo)</option>
          <option>GMT+1 (Berlin)</option>
        </select>
      </div>
  
      {/* Notification */}
      <div className="border rounded-xl p-4 space-y-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Notification Preferences</h2>
        <div className="flex flex-col gap-2 text-gray-800 dark:text-white">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notify_email === 'true'}
              onChange={(e) => handleChange('notify_email', e.target.checked ? 'true' : 'false')}
              className="accent-blue-500"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notify_push === 'true'}
              onChange={(e) => handleChange('notify_push', e.target.checked ? 'true' : 'false')}
              className="accent-blue-500"
            />
            Push Notifications
          </label>
        </div>
      </div>
  
      {/* Save button */}
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
  
  
}
