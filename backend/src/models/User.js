const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  avatarStyle: { type: String, default: 'avataaars' },
  bio: { type: String, default: '' },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true })

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
