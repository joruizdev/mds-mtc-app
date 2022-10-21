const { Schema, model } = require('mongoose')

const appointmentSchema = new Schema({
  typelic: String,
  typeproc: String,
  campus: String,
  date: {
    type: Date,
    required: false
  },
  appointmentdate: Date,
  appointmenttime: String,
  school: Boolean,
  nameschool: String,
  reschedule: Boolean,
  rescheduledate: Date,
  postulant: {
    type: Schema.Types.ObjectId,
    ref: 'Postulant'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmed: Boolean,
  canceled: Boolean,
  reason: String,
  observations: String

})

appointmentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Appointment = model('Appointment', appointmentSchema)

module.exports = Appointment
