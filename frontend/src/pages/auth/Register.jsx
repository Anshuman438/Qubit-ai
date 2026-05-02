import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Lock, User, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ROLES = [
  {
    id:          'teacher',
    icon:        BookOpen,
    title:       'Teacher',
    description: 'Create quizzes, manage students, view analytics',
  },
  {
    id:          'student',
    icon:        GraduationCap,
    title:       'Student',
    description: 'Join quizzes with a code and track your scores',
  },
]

export default function Register() {
  const { register, loading } = useAuth()

  const [role,     setRole]     = useState('teacher')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim())                                 e.name     = 'Full name is required'
    else if (name.trim().length < 2)                  e.name     = 'Name must be at least 2 characters'
    if (!email.trim())                                e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email))            e.email    = 'Enter a valid email address'
    if (!password)                                    e.password = 'Password is required'
    else if (password.length < 8)                     e.password = 'Password must be at least 8 characters'
    if (!confirm)                                     e.confirm  = 'Please confirm your password'
    else if (confirm !== password)                    e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await register({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      role,
    })
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
              Build better assessments in seconds
            </h2>
            <p className="font-body text-base text-white/60 leading-relaxed">
              Join thousands of educators who create AI-powered quizzes from their existing teaching materials.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Quiz creation time',   value: '< 60s',  accent: 'bg-volt' },
              { label: 'Questions per upload', value: 'Up to 50', accent: 'bg-lavender' },
              { label: 'Students per quiz',    value: 'Unlimited', accent: 'bg-mint' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-white/5 rounded-nb border border-white/10">
                <div className={`${accent} border-2.5 border-white rounded-nb px-3 py-1.5`}>
                  <span className="font-display text-sm font-800 text-ink">{value}</span>
                </div>
                <span className="font-body text-sm text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-white/20">
          © {new Date().getFullYear()} Qubit AI
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-7 animate-slide-in-up py-8">
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-8 h-8 bg-volt border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center">
              <Zap size={16} className="text-ink" />
            </div>
            <span className="font-display text-xl font-800 text-ink">Qubit AI</span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-3xl font-800 text-ink">Create your account</h1>
            <p className="font-body text-sm text-ink/60">
              Free forever. No credit card required.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="nb-label">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ id, icon: Icon, title, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`
                    flex flex-col gap-3 p-4 rounded-nb border-2.5 text-left
                    transition-all duration-100
                    ${role === id
                      ? 'bg-volt border-ink shadow-nb translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white border-ink shadow-nb-sm hover:shadow-nb hover:translate-x-[-1px] hover:translate-y-[-1px]'
                    }
                  `}
                >
                  <div className={`w-9 h-9 rounded-nb border-2.5 border-ink flex items-center justify-center ${role === id ? 'bg-ink' : 'bg-cream'}`}>
                    <Icon size={16} className={role === id ? 'text-volt' : 'text-ink'} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display text-sm font-800 text-ink">{title}</span>
                    <span className="font-body text-xs text-ink/60 leading-snug">{description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User size={16} />}
              iconPosition="left"
              required
            />
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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={16} />}
              iconPosition="left"
              hint="Use at least 8 characters with a mix of letters and numbers"
              required
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              icon={<Lock size={16} />}
              iconPosition="left"
              required
            />

            <p className="font-body text-xs text-ink/50 leading-relaxed">
              By creating an account you agree to our{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-ink transition-colors">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-ink transition-colors">
                Privacy Policy
              </span>.
            </p>

            <Button
              type="submit"
              variant="volt"
              fullWidth
              size="lg"
              loading={loading}
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Create account
            </Button>
          </form>

          <div className="nb-divider" />

          <p className="font-body text-sm text-ink/60 text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-600 text-ink underline underline-offset-2 hover:text-ink/70 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}