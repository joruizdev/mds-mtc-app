const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('pwd', 10)
  const user = new User({
    username: 'joruizti',
    name: 'J. Ruiz G.',
    passwordHash,
    postulants: [],
    records: [],
    status: 0
  })

  await user.save()
})

describe('creating a new user', () => {
  test('works a expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'joruizdev',
      name: 'Jorge Ruiz',
      password: 'tw1ch',
      postulants: [],
      records: [],
      status: 0
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper atatuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'joruizti',
      name: 'Jorge',
      password: 'lamiduapi',
      postulants: [],
      records: [],
      status: 0
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(res.body.errors.username.message).toContain('`username` to be unique')
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('getting users', () => {
  test('get return a json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('length of users always will be one', async () => {
    const users = await getUsers()
    console.log(users.length)
    expect(users).toHaveLength(1)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
