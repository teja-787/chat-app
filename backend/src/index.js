require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
})

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/rooms', require('./routes/rooms'))

app.get('/health', (req, res) => res.json({ status: 'healthy' }))

require('./socket')(io)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})