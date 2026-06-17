const mongoose = require('mongoose')
const { customAlphabet } = require('nanoid')

const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    timeLimit: {
      type: Number,
      default: 20,
      min: [1, 'Time limit must be at least 1 minute'],
      max: [180, 'Time limit cannot exceed 180 minutes'],
    },
    negative: {
      type: Number,
      default: 0,
      min: [0, 'Negative marking cannot be less than 0'],
    },
    shuffle: {
      type: Boolean,
      default: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['draft', 'live', 'done'],
      default: 'draft',
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

quizSchema.pre('save', async function (next) {
  if (this.code) return next()

  let code
  let exists = true
  let attempts = 0

  while (exists && attempts < 10) {
    code = generateCode()
    exists = await mongoose.models.Quiz.exists({ code })
    attempts += 1
  }

  if (exists) {
    return next(new Error('Failed to generate a unique quiz code, please try again'))
  }

  this.code = code
  next()
})

quizSchema.index({ creator: 1, status: 1 })
quizSchema.index({ code: 1 })

module.exports = mongoose.model('Quiz', quizSchema)