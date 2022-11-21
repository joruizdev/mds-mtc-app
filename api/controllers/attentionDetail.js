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
    typeproc: 1,
    appointmentdate: 1,
    appointmenttime: 1,
    reschedule: 1
  })
  res.json(attentionDetail)
})

/* attentionDetailRouter.put('/', userExtractor, async (req, res) => {
  const { body } = req
  const {
    price,
    paymentstatus,
    paymentdetail
  } = body

  const attentionDetail = new AttentionDetail({
    price,
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
}) */

attentionDetailRouter.put('/addpaymentdetail/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const { body } = req
  const {
    paymentstatus,
    paymenttype,
    amount,
    paymentdate,
    waytopay,
    operationnumber,
    paymentobservations,
    attached
  } = body

  const newPaymentDetail =
    [{
      paymenttype,
      amount,
      paymentdate,
      waytopay,
      operationnumber,
      paymentobservations,
      attached
    }]

  const result = await AttentionDetail.findById(id)
  result.paymentdetail = result.paymentdetail.concat(newPaymentDetail)

  await result.save()

  try {
    const updateAttentionDetail = await AttentionDetail.findByIdAndUpdate(id, { paymentstatus }, { new: true })
    res.status(201).json(updateAttentionDetail)
  } catch (error) {
    next(error)
  }
})

module.exports = attentionDetailRouter
