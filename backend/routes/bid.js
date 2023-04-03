import authMiddleware from '../middlewares/auth.js'
import { Bid, Product, User } from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {

  try {

    let { bidId } = req.params;

    let data = await Bid.findOne(
      {
        where: { id: bidId },
        include: [{
          model: User,
          as: 'bidder',
          attributes: ['id', 'username', 'admin']
        }]
      }
    )

    if (!data) {
      res.status(404).send()
    } else if (data.bidderId !== req.user.id && !req.user.admin) {
      res.status(403).send()
    } else {
      res.status(204).json(await Bid.destroy(
        { where: { id: bidId } }
      ))
    }

  } catch (err) {
    res.status(400).json({ error: "Invalid or missing fields", details: err })
  }

  res.status(600).send()
})

router.post('/api/products/:productId/bids', async (req, res) => {
  res.status(600).send()
})

export default router
