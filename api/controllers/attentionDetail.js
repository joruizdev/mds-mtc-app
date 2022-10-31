const attentionDetailRouter = require('express').Router()
const AttentionDetail = require('../models/AttentionDetail')
const userExtractor = require('../middleware/userExtractor')

attentionDetailRouter.get('/', async (req, res) => {
  const attentionDetail = await AttentionDetail.find({}).populate('postulant', {
    _id: 1,
    name: 1,
    lastname: 1,
    typedoc: 1,
    nrodoc: 1
  }).populate('record', {
    _id: 1,
    date: 1,
    paid: 1,
    typelic: 1,
    typeproc: 1
  }).populate('appointment', {
    _id: 1,
    date: 1,
    paid: 1,
    typelic: 1,
    typeproc: 1
  })
  res.json(attentionDetail)
})

attentionDetailRouter.post('/', userExtractor, async (req, res) => {
  const { body } = req
  const {
    postulantId,
    userId,
    recordId,
    appointmentId,
    price,
    paid,
    paymentstatus,
    paymentdetail
  } = body

  const attentionDetail = new AttentionDetail({
    date: new Date().toISOString(),
    postulant: postulantId,
    user: userId,
    record: recordId,
    appointment: appointmentId,
    price,
    paid,
    paymentstatus,
    paymentdetail
  })

  try {
    const savedAttentionDetail = await attentionDetail.save()

    res.status(201).json(savedAttentionDetail)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

module.exports = attentionDetailRouter
