const Token = require('../models/tokenModel')
const TokenController = () => {
    /**
     * Adds new or gets new token for user authentication
     * @param req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  const getNew = async (req, res) => {
    let {token} = req.body
    if (token) {
      try {
        let didAdd = await Token.addToken(token)
        if (didAdd) {
          return res.status(201).json({success: "Token created. Don't forget it or you will loose progress."})
        }
      } catch (error) {
        try {
          let trys = 0
          let maxTrys = 50
          let token = Math.random().toString(36).substr(-8)

          let didAdd = await Token.addToken(token)

          while (!didAdd) {
            token = Math.random().toString(36).substr(-8)
            didAdd = await Token.addToken(token)
            if (trys > maxTrys) {
              return res.status(500).json({error: 'Could not generate token. Please try again.'})
            }
            trys++
          }
          return res.status(201).json({success: "Token created. Don't forget it or you will loose progress.", token})
        } catch (error) {
          return res.status(500).json({error: 'Internal Error!'})
        }
      }
    }
  }

  return {getNew}
}

module.exports = TokenController
