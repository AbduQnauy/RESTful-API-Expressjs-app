const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    const error = new Error('Not Authenticated')
    error.statusCode = 401
    next(error)
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, 'secretkey')
  } catch (error) {
    error.statusCode = 500
    next(error)
  }
  if (!decodedToken) {
    const error = new Error('Not Authenticated.')
    error.statusCode = 401
    next(error)
  }
  req.userId = decodedToken.userId
  next()
}
