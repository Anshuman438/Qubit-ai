const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoutes    = require('./routes/auth.routes')
const quizRoutes     = require('./routes/quiz.routes')
const fileRoutes     = require('./routes/file.routes')
const attemptRoutes  = require('./routes/attempt.routes')

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Qubit AI backend is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/attempts', attemptRoutes)

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

module.exports = app