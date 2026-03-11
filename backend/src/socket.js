const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Message = require('./models/Message')

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      socket.user = user
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', async (socket) => {
    console.log(`${socket.user.username} connected`)
    await User.findByIdAndUpdate(socket.user._id, { isOnline: true })

    socket.on('join_room', (roomId) => {
      socket.join(roomId)
    })

    socket.on('send_message', async (data) => {
      try {
        const message = await Message.create({
          content: data.content,
          sender: socket.user._id,
          room: data.roomId
        })
        const populated = await message.populate('sender', 'username avatarStyle')
        io.to(data.roomId).emit('receive_message', populated)
      } catch (err) {
        console.error(err)
      }
    })

    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('user_typing', {
        username: socket.user.username,
        avatar: socket.user.avatarStyle
      })
    })

    socket.on('stop_typing', (roomId) => {
      socket.to(roomId).emit('user_stop_typing', socket.user.username)
    })

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date()
      })
      console.log(`${socket.user.username} disconnected`)
    })
  })
}
