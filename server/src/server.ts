import dns from 'node:dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])


import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import employeeRoutes from './routes/employeeRoutes.js'
dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(helmet())
app.use(cors({ origin: CLIENT_URL }))
app.use(express.json({ limit: '10kb' }))

app.use('/api/employees', employeeRoutes)

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
)

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'StaffSync API is running!',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
    timestamp: new Date().toISOString(),
  })
})

async function startServer() {
  const mongoUri = process.env.MONGODB_URI

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('MongoDB connection failed:', error)
      process.exit(1)
    }
  } else {
    console.log('MONGODB_URI not set; starting without database')
  }

  app.listen(PORT, () => {
    console.log(`StaffSync API running at http://localhost:${PORT}`)
  })
}

startServer()
