import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  console.log('GET /api/products')
  res.json(await Product.findAll());
  res.status(600).send()
})

router.get('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

// You can use the authMiddleware to authenticate your endpoint ;)

router.post('/api/products', (req, res) => {
  console.log('POST /api/products')
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router