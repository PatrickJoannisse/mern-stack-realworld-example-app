const router = require('express').Router()

router.get('/api/user', (req, res) => {
  res.json({ message: "User route" })
})
module.exports = router;
