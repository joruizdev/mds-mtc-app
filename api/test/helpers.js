const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')

const initialUsers = [
  {
    username: 'joruiz',
    name: 'Jorge Ruiz',
    passwordHash: '123456',
    postulants: [],
    records: [],
    status: 0
  }
]

const initialPostulants = [
  {
    name: 'Marisel',
    lastname: 'Barrueto Fructuoso',
    typedoc: 'DNI',
    nrodoc: '52458965',
    dateofbirth: '1980-10-10T23:16:59.737Z',
    gender: 'Female',
    telephone: '202458965',
    adress: 'Av. Aramburú 680 - San Isidro',
    dateregister: '2022-08-27T23:16:59.737Z',
    user: '6310e360342391192ac2c6e0'
  },
  {
    name: 'Jorge',
    lastname: 'Ruiz Gonzales',
    typedoc: 'DNI',
    nrodoc: '73627216',
    dateofbirth: '1993-11-17T23:16:59.737Z',
    gender: 'Male',
    telephone: '958120129',
    adress: 'Calle 8 Mz. H Lt. 6B, Sector Villa Hermosa - Manchay - Pachacamac',
    dateregister: '2022-08-27T23:16:59.737Z',
    user: '6310e360342391192ac2c6e0'
  }
]

const getAllNameFromPostulants = async () => {
  const response = await api.get('/api/postulants')
  return {
    contents: response.body.map(postulant => postulant.name),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  initialPostulants,
  initialUsers,
  api,
  getAllNameFromPostulants,
  getUsers
}
