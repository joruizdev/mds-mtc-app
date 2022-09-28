const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  name: String,
  lastname: String,
  typedoc: String,
  nrodoc: String,
  gender: String,
  telephone: String,
  adress: String,
  dateregister: Date,
  campus: String,
  typeuser: String,
  username: {
    type: String,
    unique: true
  },
  passwordHash: String,
  postulants: [{
    type: Schema.Types.ObjectId,
    ref: 'Postulant'
  }],
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }],
  active: Boolean
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)
module.exports = User
