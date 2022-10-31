const appointmentRouter = require('express').Router()
const Appointment = require('../models/Appointment')
const Postulant = require('../models/Postulant')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

appointmentRouter.get('/', async (req, res) => {
  const appointments = await Appointment.find({}).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  })
  res.json(appointments)
})

appointmentRouter.get('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  Appointment.findById(id).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

appointmentRouter.post('/filtercampus', userExtractor, async (req, res, next) => {
  const { campus } = req.body

  const queryFilter = String(campus).toLowerCase() === 'todos' ? {} : { campus }

  Appointment.find(queryFilter).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).then(response => {
    return (response) ? res.json(response) : res.status(404).end()
  })
    .catch(err => next(err))
})

appointmentRouter.post('/verifyduplicatedtime', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, canceled, campus, appointmenttime } = req.body
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  let queryFilter = {}

  queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], canceled, campus, appointmenttime }

  Appointment.find(queryFilter).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).then(response => {
    return (response) ? res.json(response) : res.status(404).end()
  })
    .catch(err => next(err))
})

appointmentRouter.post('/verifyduplicated', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, canceled, postulantId, campus } = req.body
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  let queryFilter = {}

  queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], canceled, campus }

  Appointment.find(queryFilter).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).then(response => {
    const postulant = response.filter(item => item.postulant.id === postulantId)
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

appointmentRouter.post('/filter', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, campus, canceled, confirmed } = req.body
  console.log(req.body)
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  let queryFilter = {}
  String(campus).toLocaleLowerCase() === 'todos' && canceled === undefined && confirmed === undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }] })
  String(campus).toLocaleLowerCase() !== 'todos' && canceled === undefined && confirmed === undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus })
  String(campus).toLocaleLowerCase() === 'todos' && canceled !== undefined && confirmed === undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], canceled })
  String(campus).toLocaleLowerCase() !== 'todos' && canceled !== undefined && confirmed === undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus, canceled })
  String(campus).toLocaleLowerCase() === 'todos' && canceled === undefined && confirmed !== undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed })
  String(campus).toLocaleLowerCase() === 'todos' && canceled !== undefined && confirmed !== undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed, canceled })
  String(campus).toLocaleLowerCase() !== 'todos' && canceled === undefined && confirmed !== undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed, campus })
  String(campus).toLocaleLowerCase() !== 'todos' && canceled !== undefined && confirmed !== undefined && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed, campus, canceled })

  Appointment.find(queryFilter).populate('postulant', {
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
appointmentRouter.post('/bydate', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, campus, confirmed, attended, canceled } = req.body
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  const queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus, confirmed, attended, canceled }

  Appointment.find(queryFilter).populate('postulant', {
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

appointmentRouter.post('/', userExtractor, async (req, res) => {
  const { body } = req
  const {
    typelic,
    typeproc,
    campus,
    appointmentdate,
    appointmenttime,
    school = false,
    nameschool = '',
    reschedule = false,
    rescheduledate = '',
    observations,
    price,
    postulantId
  } = body

  const { userId } = req

  const postulant = await Postulant.findById(postulantId)
  const user = await User.findById(userId)

  const appointment = new Appointment({
    typelic,
    typeproc,
    campus,
    date: new Date().toISOString(),
    appointmentdate: new Date(appointmentdate),
    appointmenttime,
    school,
    nameschool,
    reschedule,
    rescheduledate,
    confirmed: false,
    canceled: false,
    reason: '',
    observations,
    price,
    attended: false,
    postulant: postulantId,
    user: userId
  })

  try {
    const savedAppointment = await appointment.save()

    user.appointment = user.appointment.concat(savedAppointment._id)
    postulant.appointment = postulant.appointment.concat(savedAppointment._id)

    await user.save()
    await postulant.save()

    res.status(201).json(savedAppointment)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

appointmentRouter.put('/:id', userExtractor, (req, response, next) => {
  const { id } = req.params

  const {
    typelic,
    typeproc,
    campus,
    appointmentdate,
    appointmenttime,
    school,
    nameschool,
    reschedule,
    rescheduledate,
    observations,
    confirmed,
    canceled,
    reason,
    attended,
    price
  } = req.body

  const newAppointmentInfo = {
    typelic,
    typeproc,
    campus,
    appointmentdate,
    appointmenttime,
    school,
    nameschool,
    reschedule,
    rescheduledate,
    observations,
    confirmed,
    canceled,
    reason,
    attended,
    price
  }

  Appointment.findByIdAndUpdate(id, newAppointmentInfo, { new: true })
    .then(res => {
      response.json(res)
    }).catch(err => next(err))
})

module.exports = appointmentRouter
