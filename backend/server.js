const express = require('express')
const router = require('express').Router()
const app = express()
const port = 3000;


router.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend' })
})

router.use('/', require('./api/users'))

app.use(router)
app.listen(port, () => {
  console.log(`Backend up and listening on port ${port}`)
})

