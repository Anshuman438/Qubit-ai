import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  loginUser,
  registerUser,
  sendOTP,
  verifyOTP,
  fetchMe,
  logout,
  clearError,
} from '@/store/authSlice'
import { notify } from '@/components/ui/Toast'

export default function useAuth() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, token, loading, error, otpSent, otpVerifying } =
    useSelector((state) => state.auth)

  const isAuthenticated = Boolean(token && user)
  const isTeacher       = user?.role === 'teacher'
  const isStudent       = user?.role === 'student'
  const isAdmin         = user?.role === 'admin'

  const register = async (data) => {
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      notify.success(`Welcome to Qubit, ${result.payload.user.name}!`)
      navigate('/dashboard')
      return true
    }
    notify.error(result.payload ?? 'Registration failed')
    return false
  }

  const login = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      notify.success(`Welcome back, ${result.payload.user.name}!`)
      navigate('/dashboard')
      return true
    }
    notify.error(result.payload ?? 'Login failed')
    return false
  }

  const requestOTP = async (email) => {
    const result = await dispatch(sendOTP(email))
    if (sendOTP.fulfilled.match(result)) {
      notify.success('OTP sent! Check your email.')
      return true
    }
    notify.error(result.payload ?? 'Failed to send OTP')
    return false
  }

  const confirmOTP = async (data) => {
    const result = await dispatch(verifyOTP(data))
    if (verifyOTP.fulfilled.match(result)) {
      notify.success(`Welcome, ${result.payload.user.name}!`)
      navigate('/dashboard')
      return true
    }
    notify.error(result.payload ?? 'Invalid OTP')
    return false
  }

  const refreshUser = async () => {
    const result = await dispatch(fetchMe())
    if (fetchMe.rejected.match(result)) {
      navigate('/login')
      return false
    }
    return true
  }

  const signOut = () => {
    dispatch(logout())
    notify.success('Logged out successfully')
    navigate('/login')
  }

  const dismissError = () => dispatch(clearError())

  return {
    user,
    token,
    loading,
    error,
    otpSent,
    otpVerifying,
    isAuthenticated,
    isTeacher,
    isStudent,
    isAdmin,
    register,
    login,
    requestOTP,
    confirmOTP,
    refreshUser,
    signOut,
    dismissError,
  }
}