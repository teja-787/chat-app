const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Message = require('./models/Message')

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) return next(new Error('No token'))
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', async (socket) => {
    console.log(`${socket.user.username} connected`)

    await User.findByIdAndUpdate(socket.user._id, { isOnline: true })
    io.emit('userOnline', { userId: socket.user._id, username: socket.user.username })

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId)
      console.log(`${socket.user.username} joined room ${roomId}`)
    })

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId)
    })

    socket.on('sendMessage', async ({ content, roomId }) => {
      try {
        const message = await Message.create({
          content, room: roomId, sender: socket.user._id
        })
        const populated = await message.populate('sender', 'username avatar')
        io.to(roomId).emit('newMessage', populated)
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('userTyping', { username: socket.user.username })
    })

    socket.on('stopTyping', ({ roomId }) => {
      socket.to(roomId).emit('userStopTyping', { username: socket.user.username })
    })

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false, lastSeen: Date.now()
      })
      io.emit('userOffline', { userId: socket.user._id })
      console.log(`${socket.user.username} disconnected`)
    })
  })
}