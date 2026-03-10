import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Message from './Message'

export default function ChatWindow({ room }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState('')
  const { socket } = useSocket()
  const { user } = useAuth()
  const bottomRef = useRef()

  useEffect(() => {
    if (!room) return
    axios.get(`http://localhost:5000/api/rooms/${room._id}/messages`)
      .then(res => setMessages(res.data))
    socket?.emit('joinRoom', room._id)
    return () => socket?.emit('leaveRoom', room._id)
  }, [room, socket])

  useEffect(() => {
    socket?.on('newMessage', (message) => {
      setMessages(prev => [...prev, message])
    })
    socket?.on('userTyping', ({ username }) => {
      setTyping(`${username} is typing...`)
      setTimeout(() => setTyping(''), 2000)
    })
    return () => {
      socket?.off('newMessage')
      socket?.off('userTyping')
    }
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !room) return
    socket?.emit('sendMessage', { content: input, roomId: room._id })
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    socket?.emit('typing', { roomId: room._id })
  }

  if (!room) return (
    <div className="flex-1 flex items-center justify-center text-slate-500">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-xl">Select a room to start chatting</p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="font-bold text-white"># {room.name}</h2>
        {room.description && <p className="text-slate-400 text-sm">{room.description}</p>}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => <Message key={msg._id} message={msg} />)}
        {typing && <p className="text-slate-400 text-xs italic px-2">{typing}</p>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleTyping}
            placeholder={`Message #${room.name}`}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}