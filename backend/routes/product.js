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
  try {
    const instance = await Product.findByPk(req.params.productId)
    if (!instance) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.json(await instance.update(req.body))
  } catch (e) {
    res.status(400).json({ e: e.toString() })
  }
})

// You can use the authMiddleware, req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req, res) => {
  try {
    req.body.sellerId = req.user.id;
    res.json(await Product.create(req.body))
  } catch (error) {
    res.status(400).json({ error })
  }
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
  const found = Product.some(todo => todo.id === req.params.id)
  if (!found) {
    res.status(400).json({ msg: `No meber whit id of ${req.params.id}` })
  } else {
    Product.filter(todo => todo.id !== req.params.id)
    res.json(Product)
  }
})

export default router
