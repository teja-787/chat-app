export default function RoomList({ rooms, currentRoom, onJoinRoom, onCreateRoom }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={onCreateRoom}
          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
        >
          + New Room
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rooms.map(room => (
          <button
            key={room._id}
            onClick={() => onJoinRoom(room)}
            className={`w-full text-left p-3 rounded-lg mb-1 transition ${
              currentRoom?._id === room._id
                ? 'bg-sky-500 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="font-semibold text-sm"># {room.name}</div>
            {room.description && (
              <div className="text-xs opacity-70 truncate">{room.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}