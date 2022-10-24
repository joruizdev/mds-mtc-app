const recordRouter = require('express').Router()
const Record = require('../models/Record')
const Postulant = require('../models/Postulant')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

recordRouter.get('/', async (req, res) => {
  const records = await Record.find({}).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  })
  res.json(records)
})

recordRouter.get('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  Record.findById(id).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

recordRouter.post('/voucher', userExtractor, async (req, res, next) => {
  const { campus, canceled, invoiced } = req.body

  let queryFilter = {}

  String(campus).toLowerCase() === 'todos' && (queryFilter = { canceled, invoiced })
  String(campus).toLowerCase() !== 'todos' && (queryFilter = { canceled, invoiced, campus })

  Record.find(queryFilter).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

// Search by date, campus and canceled
recordRouter.post('/bydate', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, canceled, campus } = req.body
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  let queryFilter = {}

  canceled === undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }] })
  canceled === undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus })
  canceled !== undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], canceled })
  canceled !== undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], canceled, campus })

  Record.find(queryFilter).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

recordRouter.post('/', userExtractor, async (req, res) => {
  const { body } = req
  const {
    typelic,
    typeproc,
    campus,
    date = new Date().toISOString(),
    timestart = '',
    timeend = '',
    timeclose = '',
    initiated = false,
    closed = false,
    canceled = false,
    order = 0,
    observations,
    reason,
    price,
    postulantId
  } = body

  const { userId } = req

  const postulant = await Postulant.findById(postulantId)
  const user = await User.findById(userId)

  const record = new Record({
    typelic,
    typeproc,
    campus,
    date,
    timestart,
    timeend,
    timeclose,
    initiated,
    closed,
    canceled,
    order,
    observations,
    reason,
    price,
    invoiced: false,
    paid: false,
    postulant: postulantId,
    user: userId
  })

  try {
    const savedRecord = await record.save()

    user.records = user.records.concat(savedRecord._id)
    postulant.records = postulant.records.concat(savedRecord._id)

    await user.save()
    await postulant.save()

    res.status(201).json(savedRecord)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

recordRouter.put('/:id', userExtractor, (req, response, next) => {
  const { id } = req.params
  const record = req.body

  const newRecordInfo = {
    typelic: record.typelic,
    typeproc: record.typeproc,
    campus: record.campus,
    date: record.date,
    timestart: record.timestart,
    timeend: record.timeend,
    timeclose: record.timeclose,
    initiated: record.initiated,
    closed: record.closed,
    canceled: record.canceled,
    observations: record.observations,
    reason: record.reason,
    price: record.price,
    invoiced: record.invoiced,
    paid: record.paid
  }

  Record.findByIdAndUpdate(id, newRecordInfo, { new: true })
    .then(res => {
      response.json(res)
    }).catch(err => next(err))
})

// cannot be permanently deleted, it will be changed from canceled state to 1
recordRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  const newRecordInfo = {
    canceled: 1
  }

  Record.findByIdAndUpdate(id, newRecordInfo, { new: true })
    .then(res => {
      res.json(res)
    }).catch(err => next(err))
})

module.exports = recordRouter
