import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input, { OTPInput } from '@/components/ui/Input'
import { notify } from '@/components/ui/Toast'

const TABS = [
  { id: 'password', label: 'Password' },
  { id: 'otp',      label: 'Email OTP' },
]

export default function Login() {
  const { login, requestOTP, confirmOTP, loading, otpSent, otpVerifying, dismissError } = useAuth()

  const [tab,      setTab]      = useState('password')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [otp,      setOtp]      = useState('')
  const [errors,   setErrors]   = useState({})

  useEffect(() => {
    setErrors({})
    setOtp('')
    dismissError()
  }, [tab])

  const validate = () => {
    const e = {}
    if (!email.trim())                        e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email))    e.email    = 'Enter a valid email'
    if (tab === 'password' && !password)      e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePasswordLogin = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await login({ email: email.trim().toLowerCase(), password })
  }

  const handleSendOTP = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await requestOTP(email.trim().toLowerCase())
  }

  const handleVerifyOTP = async (ev) => {
    ev.preventDefault()
    if (otp.length !== 6) {
      notify.error('Enter the complete 6-digit OTP')
      return
    }
    await confirmOTP({ email: email.trim().toLowerCase(), otp })
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-volt border-2.5 border-white rounded-nb shadow-nb-sm flex items-center justify-center">
            <Zap size={18} className="text-ink" />
          </div>
          <span className="font-display text-xl font-800 text-white">Qubit AI</span>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-4xl font-800 text-white leading-tight">
              The smartest way to run quizzes
            </h2>
            <p className="font-body text-base text-white/60 leading-relaxed">
              Upload a file, generate questions with AI, share a code. Your students are ready in under 60 seconds.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              'AI generates questions from your content',
              'Students join with a 6-char code — no login',
              'Real-time leaderboard and anti-cheat built in',
              'Export results as CSV or PDF in one click',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-volt border-2.5 border-white rounded-nb flex items-center justify-center shrink-0">
                  <span className="text-ink text-xs font-800">✓</span>
                </div>
                <span className="font-body text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-white/20">
          © {new Date().getFullYear()} Qubit AI
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col gap-8 animate-slide-in-up">
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-8 h-8 bg-volt border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center">
              <Zap size={16} className="text-ink" />
            </div>
            <span className="font-display text-xl font-800 text-ink">Qubit AI</span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-3xl font-800 text-ink">Welcome back</h1>
            <p className="font-body text-sm text-ink/60">
              Sign in to your account to continue
            </p>
          </div>

          <div className="flex border-2.5 border-ink rounded-nb overflow-hidden shadow-nb-sm">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`
                  flex-1 py-2.5 font-body text-sm font-600 transition-all duration-100
                  ${i > 0 ? 'border-l-2.5 border-ink' : ''}
                  ${tab === t.id ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail size={16} />}
                iconPosition="left"
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={16} />}
                iconPosition="left"
                required
              />
              <Button
                type="submit"
                variant="volt"
                fullWidth
                loading={loading}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                Sign in
              </Button>
            </form>
          )}

          {tab === 'otp' && (
            <form
              onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
              className="flex flex-col gap-5"
            >
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail size={16} />}
                iconPosition="left"
                disabled={otpSent}
                required
              />

              {otpSent && (
                <div className="flex flex-col gap-3 animate-slide-in-up">
                  <div className="flex flex-col gap-1">
                    <label className="nb-label">Enter OTP</label>
                    <p className="font-body text-xs text-ink/50">
                      We sent a 6-digit code to{' '}
                      <span className="font-600 text-ink">{email}</span>
                    </p>
                  </div>
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                  />
                  <button
                    type="button"
                    onClick={() => requestOTP(email)}
                    className="font-body text-xs text-ink/50 hover:text-ink underline underline-offset-2 text-left transition-colors"
                  >
                    Didn't receive it? Resend OTP
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="volt"
                fullWidth
                loading={loading || otpVerifying}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => { setOtp(''); dismissError() }}
                  className="font-body text-xs text-ink/50 hover:text-ink underline underline-offset-2 transition-colors text-center"
                >
                  Use a different email
                </button>
              )}
            </form>
          )}

          <div className="nb-divider" />

          <p className="font-body text-sm text-ink/60 text-center">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-600 text-ink underline underline-offset-2 hover:text-ink/70 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}