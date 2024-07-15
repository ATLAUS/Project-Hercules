const express = require('express')
const { User } = require('../../../models')

const router = express.Router()

// [ADMIN] POST Create a new User.
router.post('/', async (req, res, next) => {
  const { nickname, email, userId } = req.body
  try {
    const user = await User.create({ nickname, email, userId })
    res.status(201).send({ user })
  } catch (error) {
    next(error)
  }
})

// GET User by ID and if no user is found, create user.
router.get('/', async (req, res, next) => {
  const userInfo = JSON.parse(req.headers['x-user-info'])
  // TODO: Parse the sub to get the Auth0 user ID.
  try {
    const user = await User.findById({ userId: userInfo.userId })

    if (!user) {
      const newUser = await User.create({
        nickname: userInfo.nickname,
        email: userInfo.email,
        userId: userInfo.userId
      })
      return res.status(201).send({ user: newUser })
    }

    res.status(200).send({ user })
  } catch (err) {
    next(err)
  }
})

module.exports = router
