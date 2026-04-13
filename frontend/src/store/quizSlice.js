import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { quizApi } from '@/api/quizApi'

const initialState = {
  quizzes:       [],
  currentQuiz:   null,
  questions:     [],
  generatedQs:   [],
  loading:       false,
  generating:    false,
  error:         null,
  totalCount:    0,
  filters: {
    status:     'all',
    difficulty: 'all',
    search:     '',
  },
}

export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await quizApi.getAll(params)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load quizzes')
    }
  }
)

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await quizApi.getById(id)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load quiz')
    }
  }
)

export const createQuiz = createAsyncThunk(
  'quiz/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await quizApi.create(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create quiz')
    }
  }
)

export const updateQuiz = createAsyncThunk(
  'quiz/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await quizApi.update(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update quiz')
    }
  }
)

export const deleteQuiz = createAsyncThunk(
  'quiz/delete',
  async (id, { rejectWithValue }) => {
    try {
      await quizApi.remove(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete quiz')
    }
  }
)

export const toggleQuizStatus = createAsyncThunk(
  'quiz/toggle',
  async (id, { rejectWithValue }) => {
    try {
      const res = await quizApi.toggle(id)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to toggle quiz')
    }
  }
)

export const generateQuestions = createAsyncThunk(
  'quiz/generate',
  async (data, { rejectWithValue }) => {
    try {
      const res = await quizApi.generate(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'AI generation failed')
    }
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearCurrentQuiz(state) {
      state.currentQuiz = null
      state.questions   = []
    },
    clearGeneratedQs(state) {
      state.generatedQs = []
    },
    clearError(state) {
      state.error = null
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    addQuestion(state, action) {
      state.questions.push(action.payload)
    },
    removeQuestion(state, action) {
      state.questions = state.questions.filter((_, i) => i !== action.payload)
    },
    reorderQuestions(state, action) {
      state.questions = action.payload
    },
    updateQuestion(state, action) {
      const { index, data } = action.payload
      state.questions[index] = { ...state.questions[index], ...data }
    },
    acceptGeneratedQuestion(state, action) {
      const q = state.generatedQs[action.payload]
      if (q) state.questions.push(q)
    },
    acceptAllGenerated(state) {
      state.questions = [...state.questions, ...state.generatedQs]
      state.generatedQs = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending,   (state) => { state.loading = true;  state.error = null })
      .addCase(fetchQuizzes.fulfilled, (state, { payload }) => {
        state.loading    = false
        state.quizzes    = payload.quizzes
        state.totalCount = payload.total ?? payload.quizzes.length
      })
      .addCase(fetchQuizzes.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(fetchQuizById.pending,   (state) => { state.loading = true })
      .addCase(fetchQuizById.fulfilled, (state, { payload }) => {
        state.loading     = false
        state.currentQuiz = payload.quiz
        state.questions   = payload.questions ?? []
      })
      .addCase(fetchQuizById.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(createQuiz.pending,   (state) => { state.loading = true;  state.error = null })
      .addCase(createQuiz.fulfilled, (state, { payload }) => {
        state.loading = false
        state.quizzes.unshift(payload.quiz)
        state.currentQuiz = payload.quiz
      })
      .addCase(createQuiz.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(updateQuiz.fulfilled, (state, { payload }) => {
        const idx = state.quizzes.findIndex((q) => q._id === payload.quiz._id)
        if (idx !== -1) state.quizzes[idx] = payload.quiz
        state.currentQuiz = payload.quiz
      })

      .addCase(deleteQuiz.fulfilled, (state, { payload: id }) => {
        state.quizzes = state.quizzes.filter((q) => q._id !== id)
        if (state.currentQuiz?._id === id) state.currentQuiz = null
      })

      .addCase(toggleQuizStatus.fulfilled, (state, { payload }) => {
        const idx = state.quizzes.findIndex((q) => q._id === payload.quiz._id)
        if (idx !== -1) state.quizzes[idx] = payload.quiz
        if (state.currentQuiz?._id === payload.quiz._id) {
          state.currentQuiz = payload.quiz
        }
      })

      .addCase(generateQuestions.pending,   (state) => { state.generating = true;  state.error = null })
      .addCase(generateQuestions.fulfilled, (state, { payload }) => {
        state.generating  = false
        state.generatedQs = payload.questions
      })
      .addCase(generateQuestions.rejected,  (state, { payload }) => { state.generating = false; state.error = payload })
  },
})

export const {
  clearCurrentQuiz,
  clearGeneratedQs,
  clearError,
  setFilters,
  addQuestion,
  removeQuestion,
  reorderQuestions,
  updateQuestion,
  acceptGeneratedQuestion,
  acceptAllGenerated,
} = quizSlice.actions

export default quizSlice.reducer