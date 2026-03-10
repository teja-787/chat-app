import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      const newSocket = io('https://chat-app-production-a8e9.up.railway.app', {
  auth: { token }
      })
      setSocket(newSocket)
      return () => newSocket.close()
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)