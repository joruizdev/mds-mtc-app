const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('postulants',
    {
      name: 1,
      lastname: 1,
      typelic: 1,
      nrodoc: 1
    })
  res.json(users)
})

usersRouter.get('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  User.findById(id).then(user => {
    return (user) ? res.json(user) : res.status(404).end()
  })
    .catch(err => next(err))
})

usersRouter.post('/bynrodoc', userExtractor, (req, res, next) => {
  const { nrodoc } = req.body
  User.find({ nrodoc }).then(user => {
    return (user) ? res.json(user) : res.status(404).end()
  })
    .catch(err => next(err))
})

usersRouter.post('/', userExtractor, async (req, res) => {
  try {
    const { body } = req

    const {
      name,
      lastname,
      typedoc,
      nrodoc,
      gender,
      telephone,
      adress,
      campus,
      typeuser,
      username,
      password,
      postulants,
      records,
      active
    } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      name,
      lastname,
      typedoc,
      nrodoc,
      gender,
      telephone,
      adress,
      dateregister: new Date().toISOString(),
      campus,
      typeuser,
      username,
      passwordHash,
      postulants,
      records,
      active
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json(error)
  }
})

usersRouter.put('/:id', userExtractor, async (req, response, next) => {
  const { id } = req.params
  const user = req.body
  const {
    name,
    lastname,
    typedoc,
    nrodoc,
    gender,
    telephone,
    adress,
    campus,
    typeuser,
    username,
    postulants,
    records,
    active
  } = user

  const newUserInfo = {
    name,
    lastname,
    typedoc,
    nrodoc,
    gender,
    telephone,
    adress,
    campus,
    typeuser,
    username,
    postulants,
    records,
    active
  }

  User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then(res => {
      response.json(res)
    }).catch(err => {
      console.log(err)
      next(err)
    })
})

usersRouter.put('/changepassword/:id', userExtractor, async (req, response, next) => {
  const { id } = req.params
  const user = req.body
  const { password } = user

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUserInfo = { passwordHash }

  User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then(res => {
      response.json(res)
    }).catch(err => {
      console.log(err)
      next(err)
    })
})

usersRouter.delete('/id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const user = req.body

  const newUserInfo = {
    ...user,
    status: 1
  }

  User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then(res => {
      res.json(res)
    }).catch(err => next(err))
})

module.exports = usersRouter
