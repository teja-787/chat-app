import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(username, email, password)
      window.location.href = '/chat'
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-sky-400 mb-2">💬 ChatApp</h1>
        <p className="text-center text-slate-400 mb-8">Create your account</p>
        {error && <div className="bg-red-900 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Username</label>
            <input
              type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-400"
              placeholder="cooluser123" required
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-400"
              placeholder="you@example.com" required
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-400"
              placeholder="••••••••" required
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6">
          Have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}