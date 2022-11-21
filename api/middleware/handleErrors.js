const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({ error: 'id used is malformed' }),

  ValidationError: (res, { message }) => res.status(409).send({ error: message }),

  JsonWebTokenError: res => res.status(401).send({ error: 'token missing or invalid' }),

  TokenExpiredError: res => res.status(401).send({ error: 'token expired' }),

  defaultError: (res, { message }) => res.status(500).end({ error: message })
}

module.exports = (error, req, res, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(res, error)
}
