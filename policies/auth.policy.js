const TokenModel = require('../models/TokenModel')
/**
 * Checks for user authorization token
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  let tokenToVerify
  if (req.header('Authorization')) {
    tokenToVerify = req.header('Authorization')
  } else if (req.body.token) {
    tokenToVerify = req.body.token
    delete req.query.token
  } else {
    return res.status(401).json({ error: 'NO_TOKEN_FOUND' })
  }

  return TokenModel.validateToken(tokenToVerify).then(isValid => {
    if (isValid) {
      req.token = tokenToVerify
    } else {
      return res.status(400).json({error: 'INVALID_TOKEN'})
    }
    return next()
  }).catch(() => {
    return res.status(500).json({error: 'INTERNAL_ERROR'})
  })
}
