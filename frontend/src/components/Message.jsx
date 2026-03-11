import { getAvatarUrl } from './Avatar'
import { useAuth } from '../context/AuthContext'

export default function Message({ message }) {
  const { user } = useAuth()
  const isOwn = message.sender?.username === user?.username
  const avatarStyle = message.sender?.avatarStyle || 'avataaars'
  const username = message.sender?.username || 'Unknown'

  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <img
        src={getAvatarUrl(username, avatarStyle)}
        alt={username}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />

      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Username */}
        {!isOwn && (
          <span className="text-xs text-slate-400 mb-1 ml-1">{username}</span>
        )}

        {/* Bubble */}
        <div className={`px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? 'bg-sky-500 text-white rounded-br-sm'
            : 'bg-slate-700 text-white rounded-bl-sm'
        }`}>
          {message.content}
        </div>

        {/* Time */}
        <span className="text-xs text-slate-500 mt-1 mx-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
