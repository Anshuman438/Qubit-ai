import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@/api/authApi'

const TOKEN_KEY = 'qubit_token'
const USER_KEY  = 'qubit_user'

const loadFromStorage = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const user  = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

const { token: storedToken, user: storedUser } = loadFromStorage()

const initialState = {
  user:          storedUser,
  token:         storedToken,
  loading:       false,
  error:         null,
  otpSent:       false,
  otpVerifying:  false,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed')
    }
  }
)

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (email, { rejectWithValue }) => {
    try {
      await authApi.sendOTP({ email })
      return email
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to send OTP')
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyOTP(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Invalid OTP')
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.me()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Session expired')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      state.error = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
    clearError(state) {
      state.error = null
    },
    setCredentials(state, action) {
      const { user, token } = action.payload
      state.user  = user
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,  (state) => { state.loading = true;  state.error = null })
      .addCase(registerUser.fulfilled,(state, { payload }) => {
        state.loading = false
        state.user    = payload.user
        state.token   = payload.token
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY,  JSON.stringify(payload.user))
      })
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(loginUser.pending,  (state) => { state.loading = true;  state.error = null })
      .addCase(loginUser.fulfilled,(state, { payload }) => {
        state.loading = false
        state.user    = payload.user
        state.token   = payload.token
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY,  JSON.stringify(payload.user))
      })
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(sendOTP.pending,   (state) => { state.loading = true;  state.error = null })
      .addCase(sendOTP.fulfilled, (state) => { state.loading = false; state.otpSent = true })
      .addCase(sendOTP.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(verifyOTP.pending,   (state) => { state.otpVerifying = true;  state.error = null })
      .addCase(verifyOTP.fulfilled, (state, { payload }) => {
        state.otpVerifying = false
        state.user         = payload.user
        state.token        = payload.token
        state.otpSent      = false
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY,  JSON.stringify(payload.user))
      })
      .addCase(verifyOTP.rejected, (state, { payload }) => { state.otpVerifying = false; state.error = payload })

      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload.user
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user  = null
        state.token = null
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      })
  },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer