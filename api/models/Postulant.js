const { Schema, model } = require('mongoose')

const postulantSchema = new Schema({
  name: String,
  lastname: String,
  typedoc: String,
  nrodoc: String,
  dateofbirth: Date,
  gender: String,
  telephone: String,
  adress: String,
  dateregister: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }],
  appointment: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }]

})

postulantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Postulant = model('Postulant', postulantSchema)

module.exports = Postulant
