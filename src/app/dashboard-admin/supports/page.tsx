'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const tabs = [
  { id: 'email', label: 'Email Support' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'faq', label: 'FAQ' },
]

function parseValue(value: any) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}

export default function AdminSupportPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('email')
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [faqList, setFaqList] = useState<Array<{ q: string; a: string }>>([])

  // === Ambil data settings & feedback ===
  useEffect(() => {
    const fetchAll = async () => {
      // Settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('key, value')

      const obj: Record<string, any> = {}
      settingsData?.forEach((row) => {
        obj[row.key] = parseValue(row.value)
      })

      setSettings(obj)
      setEmailInput(obj.email_support?.email ?? '')
      setFaqList(Array.isArray(obj.faq) ? obj.faq : [])

      // Feedback
      const { data: feedbackData, error } = await supabase
        .from('feedback')
        .select(`
        id,
        message,
        created_at,
        feedback_user_id_fkey1 (
          full_name,
          email
        )
      `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching feedback:', error)
      } else {
        console.log(feedbackData)
      }


      setFeedbacks(feedbackData ?? [])
      setLoading(false)
    }

    fetchAll()
  }, [supabase])

  // === Update email support ===
  const saveEmail = async () => {
    await supabase
      .from('settings')
      .upsert({ key: 'email_support', value: { email: emailInput } })
    alert('Email updated!')
  }

  // === Simpan FAQ ke settings ===
  const saveFaq = async () => {
    await supabase
      .from('settings')
      .upsert({ key: 'faq', value: faqList })
    alert('FAQ updated!')
  }

  // === Tambah FAQ row ===
  const addFaqRow = () => {
    setFaqList([...faqList, { q: '', a: '' }])
  }

  // === Hapus FAQ row ===
  const removeFaqRow = (idx: number) => {
    setFaqList(faqList.filter((_, i) => i !== idx))
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        Admin Support Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 border-x border-t border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border rounded-b-xl p-4 space-y-4 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        {/* Email Support */}
        {activeTab === 'email' && (
          <div className="space-y-3">
            <label className="block text-gray-700 dark:text-gray-300">
              Support Email:
            </label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button
              onClick={saveEmail}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Save Email
            </button>
          </div>
        )}

        {/* Feedback */}
        {activeTab === 'feedback' && (
          <div className="space-y-3">
            <h2 className="font-medium text-gray-800 dark:text-white">
              User Feedback
            </h2>
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {feedbacks.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                        {new Date(f.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                        {f.feedback_user_id_fkey1.full_name} -{" "}
                        {f.feedback_user_id_fkey1.email}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                        {f.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <h2 className="font-medium text-gray-800 dark:text-white">
              Manage FAQ
            </h2>
            <div className="space-y-2">
              {faqList.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 border p-3 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                >
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    placeholder="Question"
                    value={item.q}
                    onChange={(e) => {
                      const newFaq = [...faqList];
                      newFaq[idx].q = e.target.value;
                      setFaqList(newFaq);
                    }}
                  />
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    placeholder="Answer"
                    value={item.a}
                    onChange={(e) => {
                      const newFaq = [...faqList];
                      newFaq[idx].a = e.target.value;
                      setFaqList(newFaq);
                    }}
                  />
                  <button
                    onClick={() => removeFaqRow(idx)}
                    className="text-red-500 text-sm hover:underline sm:col-span-2 text-left"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addFaqRow}
                className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                + Add Row
              </button>
              <button
                onClick={saveFaq}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save FAQ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}
