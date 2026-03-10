import { useAuth } from '../context/AuthContext'

export default function Message({ message }) {
  const { user } = useAuth()
  const isOwn = message.sender._id === user?.id

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs text-slate-400 mb-1 ml-1">
            {message.sender.username}
          </span>
        )}
        <div className={`px-4 py-2 rounded-2xl ${isOwn
          ? 'bg-sky-500 text-white rounded-tr-sm'
          : 'bg-slate-700 text-slate-100 rounded-tl-sm'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-slate-500 mt-1 mx-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  )
}