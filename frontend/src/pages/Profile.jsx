import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Avatar, { getAvatarUrl, AVATAR_STYLES } from '../components/Avatar'
import axios from 'axios'

const API = 'https://chat-app-production-a8e9.up.railway.app/api'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [selectedStyle, setSelectedStyle] = useState(user?.avatarStyle || 'avataaars')
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await axios.put(`${API}/profile/update`, { avatarStyle: selectedStyle, bio })
      setUser(prev => ({ ...prev, avatarStyle: selectedStyle, bio }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-sky-400">Your Profile</h1>

        {/* Current Avatar */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <img
            src={getAvatarUrl(user?.username, selectedStyle)}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-sky-400"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Write a short bio..."
              className="mt-2 w-full bg-slate-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-sky-400 border border-slate-600"
              rows={2}
            />
          </div>
        </div>

        {/* Avatar Style Picker */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Choose Avatar Style</h3>
          <div className="grid grid-cols-3 gap-4">
            {AVATAR_STYLES.map(style => (
              <div
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`cursor-pointer rounded-xl p-3 flex flex-col items-center gap-2 border-2 transition-all ${
                  selectedStyle === style 
                    ? 'border-sky-400 bg-slate-700' 
                    : 'border-slate-600 hover:border-slate-400'
                }`}
              >
                <img
                  src={getAvatarUrl(user?.username, style)}
                  alt={style}
                  className="w-16 h-16 rounded-full"
                />
                <span className="text-xs text-slate-400 capitalize">{style.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all"
        >
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Profile'}
        </button>

        <button
          onClick={() => window.location.href = '/chat'}
          className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
        >
          ← Back to Chat
        </button>
      </div>
    </div>
  )
}
