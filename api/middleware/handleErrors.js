module.exports = (error, req, res, next) => {
  error.name === 'CastError' && res.status(400).send({ error: 'id used is malformed' })
  error.name === 'ValidationError' && res.status(409).send({ error: error.message })
  error.name === 'JsonWebTokenError' && res.status(401).send({ error: 'token missing or invalid' })
  error.name === 'TokenExpirerError' && res.status(401).send({ error: 'token missing or invalid' })
  res.status(500).end()
}
