import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return navigate('/login')
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
  }, [user])

  const handleJoinRoom = (room) => setCurrentRoom(room)

  const handleCreateRoom = async () => {
    const name = prompt('Room name:')
    if (!name) return
    const description = prompt('Description (optional):') || ''
    try {
      const res = await axios.post('http://localhost:5000/api/rooms', { name, description })
      setRooms(prev => [...prev, res.data])
      setCurrentRoom(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create room')
    }
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
      <ChatWindow room={currentRoom} />
    </div>
  )
}