const { Schema, model } = require('mongoose')

const attentionDetailSchema = new Schema({
  date: {
    type: Date,
    required: false
  },
  postulant: {
    type: Schema.Types.ObjectId,
    ref: 'Postulant'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  record: {
    type: Schema.Types.ObjectId,
    ref: 'Record',
    required: false
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  price: Number,
  paid: Boolean,
  paymentstatus: String,
  paymentdetail: []

})

attentionDetailSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const AttentionDetail = model('AttentionDetail', attentionDetailSchema)

module.exports = AttentionDetail
