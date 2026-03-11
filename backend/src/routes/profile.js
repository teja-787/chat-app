const router = require('express').Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

router.get('/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/update', auth, async (req, res) => {
  try {
    const { avatarStyle, bio } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarStyle, bio },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
