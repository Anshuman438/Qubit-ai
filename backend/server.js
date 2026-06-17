require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')
const http = require('http')
const { Server } = require('socket.io')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)

  socket.on('join-quiz-room', (quizId) => {
    socket.join(`quiz-${quizId}`)
  })

  socket.on('leave-quiz-room', (quizId) => {
    socket.leave(`quiz-${quizId}`)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

app.set('io', io)

const startServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`Qubit AI backend running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message)
  server.close(() => process.exit(1))
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.')
  server.close(() => process.exit(0))
})

startServer()