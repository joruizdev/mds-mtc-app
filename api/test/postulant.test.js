const mongoose = require('mongoose')

const { server } = require('../index')
const Postulants = require('../models/Postulant')
const Users = require('../models/User')

const { initialPostulants, api, initialUsers, getAllNameFromPostulants } = require('./helpers')

beforeEach(async () => {
  await Users.deleteMany({})
  await Postulants.deleteMany({})

  const userObject = new Users(initialUsers[0])
  await userObject.save()

  const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
  const id = response.body[0].id

  for (const postulant of initialPostulants) {
    const newPostulant = {
      ...postulant,
      user: id
    }

    const postulantObject = new Postulants(newPostulant)
    await postulantObject.save()
  }
})

describe('GET all Postulants', () => {
  test('postulants are return as json', async () => {
    await api
      .get('/api/postulants')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two postulants', async () => {
    const response = await api.get('/api/postulants')
    expect(response.body).toHaveLength(initialPostulants.length)
  })

  test('first postulants Marisel', async () => {
    const { contents } = await getAllNameFromPostulants()

    expect(contents).toContain('Marisel')
  })
})

describe('POST all Postulants', () => {
  test('a valid postulant can be added', async () => {
    const res = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    const id = res.body[0].id

    const newPostulant = {
      name: 'Génesis',
      lastname: 'Urquiola Pérez',
      typedoc: 'CE',
      nrodoc: '1025415254587456',
      dateofbirth: '1998-10-10T23:16:59.737Z',
      gender: 'Female',
      telephone: '985652514',
      adress: 'Calle Albert Einstein Mz. H Lt. 22 Urb. La Calera de La Merced - Surquillo',
      dateregister: '1980-10-10T23:16:59.737Z',
      userId: id
    }

    await api
      .post('/api/postulants')
      .send(newPostulant)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllNameFromPostulants()
    expect(response.body).toHaveLength(initialPostulants.length + 1)
    expect(contents).toContain(newPostulant.name)
  })

  test('postulant without name, nrodoc, or typelic is not added', async () => {
    const newPostulant = {
      date: '',
      timestart: '',
      timeend: '',
      timeclose: '',
      initiated: 0,
      closed: 0,
      order: 0
    }

    await api
      .post('/api/postulants')
      .send(newPostulant)
      .expect(400)

    const response = await api.get('/api/postulants')
    expect(response.body).toHaveLength(initialPostulants.length)
  })
})

describe('DELETE all Postulants', () => {
  test('a postulant can be deleted', async () => {
    const { response: firstResponse } = await getAllNameFromPostulants()
    const { body: postulants } = firstResponse
    const postulantToDelete = postulants[0]

    await api
      .delete(`/api/postulants/${postulantToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllNameFromPostulants()
    expect(secondResponse.body).toHaveLength(initialPostulants.length - 1)
    expect(contents).not.toContain(postulantToDelete.name)
  })

  /* test('a postulant that do not exist can not be deleted', async () => {
    await api
      .delete('/api/postulants/1234')
      .expect(400)

    const { response } = await getAllNameFromPostulants()
    expect(response.body).toHaveLength(initialPostulants.length)
  }) */
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
