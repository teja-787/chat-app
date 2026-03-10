const router = require('express').Router()
const { getRooms, createRoom, getRoomMessages } = require('../controllers/roomController')
const auth = require('../middleware/auth')

router.get('/', auth, getRooms)
router.post('/', auth, createRoom)
router.get('/:roomId/messages', auth, getRoomMessages)

module.exports = router