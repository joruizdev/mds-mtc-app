const { Schema, model } = require('mongoose')

const recordSchema = new Schema({
  typelic: String,
  typeproc: String,
  campus: String,
  date: {
    type: Date,
    required: false
  },
  timestart: {
    type: Date,
    required: false
  },
  timeend: {
    type: Date,
    required: false
  },
  timeclose: {
    type: Date,
    required: false
  },
  initiated: Boolean,
  closed: Boolean,
  canceled: Boolean,
  order: Number,
  observations: String,
  reason: String,
  postulant: {
    type: Schema.Types.ObjectId,
    ref: 'Postulant'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

})

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Record = model('Record', recordSchema)

module.exports = Record
