'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

export default function SupportPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('email')
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  // Feedback state
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // FAQ search & pagination
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('key, value')
      if (error) {
        console.error('Error fetching settings:', error)
        setLoading(false)
        return
      }
      const obj: Record<string, any> = {}
      data?.forEach((row) => {
        obj[row.key] = parseValue(row.value)
      })
      setSettings(obj)
      setLoading(false)
    }
    fetchSettings()
  }, [supabase])

  const email = settings.email_support?.email ?? 'support@example.com'
  const feedbackPlaceholder =
    settings.feedback?.placeholder ?? 'Write your feedback here...'
  const faqList: Array<{ q: string; a: string }> = Array.isArray(settings.faq)
    ? settings.faq
    : []

  // Filter by search
  const filteredFaq = faqList.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredFaq.length / pageSize)
  const paginatedFaq = filteredFaq.slice((page - 1) * pageSize, page * pageSize)

  // === Handle Feedback Submit ===
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return

    setSubmitting(true)
    setSubmitted(false)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login to submit feedback')
      setSubmitting(false)
      return
    }

    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      message: feedback.trim(),
    })

    if (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback')
    } else {
      setFeedback('')
      setSubmitted(true)
    }

    setSubmitting(false)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold dark:text-white/90">Support</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === tab.id
                ? 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/80 border-transparent'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="border rounded-b-xl p-4 dark:border-gray-700 dark:bg-gray-900">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading settings...</div>
        ) : (
          <>
            {/* Email Support */}
            {activeTab === 'email' && (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  Need help? Contact us via email:
                </p>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {email}
                </a>
              </div>
            )}

            {/* Feedback */}
            {activeTab === 'feedback' && (
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  We’d love to hear your thoughts:
                </p>
                <textarea
                  className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  rows={4}
                  placeholder={feedbackPlaceholder}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                {submitted && (
                  <p className="text-green-600 text-sm">Feedback submitted successfully!</p>
                )}
              </div>
            )}

            {/* FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <p className="text-gray-700 font-medium dark:text-gray-300">
                  Frequently Asked Questions
                </p>

                {/* Search */}
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />

                {filteredFaq.length ? (
                  <>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedFaq.map((item, idx) => {
                        const globalIdx = (page - 1) * pageSize + idx
                        const isOpen = openIdx === globalIdx
                        return (
                          <div key={globalIdx}>
                            <button
                              onClick={() =>
                                setOpenIdx(isOpen ? null : globalIdx)
                              }
                              className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white/80"
                            >
                              <span>{item.q}</span>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="pb-3 text-sm text-gray-600 dark:text-gray-400">
                                {item.a}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center pt-4">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border rounded 
               bg-white text-gray-700 hover:bg-gray-100 
               disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 
               dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Prev
                      </button>

                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page} of {totalPages}
                      </span>

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded 
               bg-white text-gray-700 hover:bg-gray-100 
               disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 
               dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Next
                      </button>
                    </div>

                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No FAQ found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

}
