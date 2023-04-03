import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  try {
    res.json(await Product.findAll(
      {
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'username']
        }, {
          model: Bid,
          as: 'bids',
          attributes: ['id', 'price', 'date']
        }]
      }
    ))
  } catch (error) {
    res.status(400).json({ error })
  }
  res.status(600).send()
})

router.get('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

// You can use the authMiddleware, req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req, res) => {
  try {
    req.body.sellerId = req.user.id;
    res.status(201).json(await Product.create(req.body))
  } catch (error) {
    res.status(400).json({ error: "Invalid or missing fields", details: error })
  }
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
