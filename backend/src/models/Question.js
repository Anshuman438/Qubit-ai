const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'truefalse', 'short'],
      default: 'mcq',
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [5, 'Question text must be at least 5 characters'],
    },
    options: {
      type: [String],
      validate: {
        validator: function (value) {
          if (this.type !== 'mcq') return true
          return Array.isArray(value) && value.length === 4
        },
        message: 'MCQ questions must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: [500, 'Explanation cannot exceed 500 characters'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    topic: {
      type: String,
      trim: true,
      maxlength: [80, 'Topic cannot exceed 80 characters'],
    },
    points: {
      type: Number,
      default: 1,
      min: [0, 'Points cannot be negative'],
    },
  },
  { timestamps: true }
)

questionSchema.pre('validate', function (next) {
  if (this.type === 'truefalse') {
    const normalized = String(this.correctAnswer).trim().toLowerCase()
    if (normalized !== 'true' && normalized !== 'false') {
      return next(new Error('True/False questions must have an answer of "True" or "False"'))
    }
    this.correctAnswer = normalized === 'true' ? 'True' : 'False'
  }
  next()
})

questionSchema.index({ quiz: 1 })

module.exports = mongoose.model('Question', questionSchema)