import { useAuth } from '../context/AuthContext'
import RoomList from './RoomList'

export default function Sidebar({ rooms, currentRoom, onJoinRoom, onCreateRoom }) {
  const { user, logout } = useAuth()

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-sky-400">💬 ChatApp</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="p-3 text-xs text-slate-500 uppercase font-semibold">Rooms</div>
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          onJoinRoom={onJoinRoom}
          onCreateRoom={onCreateRoom}
        />
      </div>
      <div className="p-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-slate-300 text-sm font-semibold">{user?.username}</span>
        </div>
        <button
          onClick={logout}
          className="text-slate-400 hover:text-red-400 text-xs transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}// Avatar export for use in other components
export { default as Avatar } from './Avatar'
