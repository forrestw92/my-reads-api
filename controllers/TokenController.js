const TokenModel = require('../models/TokenModel')
class TokenController {
  /**
     * Adds new or gets new token for user authentication
     * @param req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  async getNew (req, res) {
    let {token} = req.body
    try {
      // Tries to add user token or fails and server generated token is provided
      let didAdd = await TokenModel.addToken(token)
      if (didAdd) {
        return res.status(201).json({success: "Token created. Don't forget it or you will loose progress."})
      }
    } catch (error) {
      try {
        // If user did not provide a token or user token is taken server generated token will be provided
        let tries = 0
        let maxTrys = 50
        let token = Math.random().toString(36).substr(-8)
        let didAdd = await TokenModel.addToken(token)

        while (!didAdd) {
          token = Math.random().toString(36).substr(-8)
          didAdd = await TokenModel.addToken(token)
          if (tries > maxTrys) {
            return res.status(500).json({error: 'Could not generate token. Please try again.'})
          }
          tries++
        }
        return res.status(201).json({success: "Token created. Don't forget it or you will loose progress.", token})
      } catch (error) {
        return res.status(500).json({error: 'Internal Error!'})
      }
    }
  }
}

module.exports = TokenController
