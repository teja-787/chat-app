const Room = require('../models/Room')
const Message = require('../models/Message')

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('createdBy', 'username')
    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createRoom = async (req, res) => {
  try {
    const { name, description } = req.body
    const exists = await Room.findOne({ name })
    if (exists) return res.status(400).json({ message: 'Room already exists' })
    const room = await Room.create({
      name, description, createdBy: req.user._id
    })
    res.status(201).json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(50)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}