const appointmentRouter = require('express').Router()
const Appointment = require('../models/Appointment')
const Postulant = require('../models/Postulant')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

appointmentRouter.get('/', async (req, res) => {
  const records = await Appointment.find({}).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  })
  res.json(records)
})

appointmentRouter.get('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  Appointment.findById(id).then(postulant => {
    return (postulant) ? res.json(postulant) : res.status(404).end()
  })
    .catch(err => next(err))
})

appointmentRouter.post('/bydate', userExtractor, async (req, res, next) => {
  const { dateStart, dateEnd, confirmed, attended, campus } = req.body
  const newDateEnd = new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)

  let queryFilter = {}

  confirmed === undefined && attended === undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }] })
  confirmed !== undefined && attended === undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed })
  confirmed !== undefined && attended !== undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], confirmed, attended })
  confirmed === undefined && attended !== undefined && String(campus).toLowerCase() === 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], attended })
  confirmed === undefined && attended === undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus })
  confirmed !== undefined && attended === undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus, confirmed })
  confirmed !== undefined && attended !== undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus, confirmed, attended })
  confirmed === undefined && attended !== undefined && String(campus).toLowerCase() !== 'todos' && (queryFilter = { $and: [{ date: { $gte: new Date(dateStart) } }, { date: { $lt: new Date(newDateEnd) } }], campus, attended })

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
    attended
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
    attended
  }

  Appointment.findByIdAndUpdate(id, newAppointmentInfo, { new: true })
    .then(res => {
      response.json(res)
    }).catch(err => next(err))
})

module.exports = appointmentRouter
