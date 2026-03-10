const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String, required: true },
  type: { type: String, enum: ['text', 'image'], default: 'text' }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)