const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return (
      res.status(401).json({
        error: 'invalid user or password'
      })
    )
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.send({
    name: user.name,
    lastname: user.lastname,
    username: user.username,
    campus: user.campus,
    typeuser: user.typeuser,
    token
  })
})

module.exports = loginRouter
