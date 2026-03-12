const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const exists = await User.findOne({ $or: [{ email }, { username }] })
    if (exists) return res.status(400).json({ message: 'User already exists' })
    const user = await User.create({ username, email, password })
    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatarStyle: user.avatarStyle, bio: user.bio }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })
    await User.findByIdAndUpdate(user._id, { isOnline: true })
    const token = generateToken(user._id)
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatarStyle: user.avatarStyle, bio: user.bio }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    avatarStyle: req.user.avatarStyle,
    bio: req.user.bio
  })
}
