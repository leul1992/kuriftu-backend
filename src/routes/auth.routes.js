import express from 'express'
import { loginUser, signUpUser } from '../services/supabase/auth.service.js'

const router = express.Router()

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' })
  }

  const result = await signUpUser(email, password)

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' })
  }

  const result = await loginUser(email, password)

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(401).json(result)
  }
})

export default router
