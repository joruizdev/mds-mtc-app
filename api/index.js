require('dotenv').config()
require('./mongo')
const express = require('express')
const app = express()
const port = process.env.PORT
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const usersRouter = require('./controllers/users')
const postulantsRouter = require('./controllers/postulants')
const recordRouter = require('./controllers/records')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(express.static('../app/build'))
app.use('/postulants', postulantsRouter)
app.use('/users', usersRouter)
app.use('/records', recordRouter)
app.use('/login', loginRouter)

app.use(notFound)
app.use(handleErrors)

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = { app, server }
