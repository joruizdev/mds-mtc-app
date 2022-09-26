const postulantsRouter = require('express').Router()
const Postulant = require('../models/Postulant')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

postulantsRouter.get('/', async (req, res) => {
  const postulants = await Postulant.find({})
  res.json(postulants)
})

postulantsRouter.get('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  Postulant.findById(id).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

postulantsRouter.post('/bynrodoc', userExtractor, (req, res, next) => {
  const { nrodoc } = req.body
  Postulant.find({ nrodoc }).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

postulantsRouter.put('/:id', userExtractor, async (req, response, next) => {
  const { id } = req.params
  const postulant = req.body

  const newPostulantInfo = {
    name: postulant.name,
    lastname: postulant.lastname,
    typedoc: postulant.typedoc,
    nrodoc: postulant.nrodoc,
    dateofbirth: postulant.dateofbirth,
    gender: postulant.gender,
    telephone: postulant.telephone,
    adress: postulant.adress,
    dateregister: new Date().toISOString()
  }

  try {
    const updatePostulant = await Postulant.findByIdAndUpdate(id, newPostulantInfo, { new: true })
    response.json(updatePostulant)
  } catch (error) {
    next(error)
  }
})

postulantsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  await Postulant.findByIdAndDelete(id)
  res.status(204).end()
})

postulantsRouter.post('/', userExtractor, async (req, res, next) => {
  const {
    name,
    lastname,
    typedoc,
    nrodoc,
    dateofbirth,
    gender,
    telephone,
    adress,
    recordId
  } = req.body

  const { userId } = req

  const user = await User.findById(userId)

  if (!name) {
    return res.status(400).json({
      error: 'postulant.name, postulant.nrdoc and postulant.typelic is missing'
    })
  }

  const newPostulant = new Postulant({
    name,
    lastname,
    typedoc,
    nrodoc,
    dateofbirth,
    gender,
    telephone,
    adress,
    dateregister: new Date().toISOString(),
    user: user._id,
    records: recordId
  })

  try {
    const savePostulant = await newPostulant.save()

    user.postulants = user.postulants.concat(savePostulant._id)
    await user.save()

    res.json(savePostulant)
  } catch (error) {
    next(error)
  }
})

module.exports = postulantsRouter
