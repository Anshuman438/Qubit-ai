import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Menu, X, Bell, Search, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'

export function DashboardNavbar({ user, title, subtitle }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-30 bg-cream border-b-2.5 border-ink">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-col min-w-0">
          {title && (
            <h1 className="font-display text-xl font-800 text-ink leading-tight truncate">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="font-body text-xs text-ink/50 leading-none mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search quizzes..."
                className="nb-input py-1.5 text-sm w-48"
                onBlur={() => setSearchOpen(false)}
              />

              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-nb border-2.5 border-ink hover:bg-ink hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-nb border-2.5 border-transparent hover:border-ink hover:bg-white"
            >
              <Search size={18} />
            </button>
          )}

          <button className="relative p-2 rounded-nb border-2.5 border-transparent hover:border-ink hover:bg-white">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose border border-white rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-nb border-2.5 border-transparent hover:border-ink hover:bg-white"
            >
              <div className="w-7 h-7 bg-lavender border-2.5 border-ink rounded-nb flex items-center justify-center">
                <span className="font-display text-xs font-800 text-ink">
                  {initial}
                </span>
              </div>

              <span className="font-body text-sm font-600 text-ink hidden sm:block max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>

              <ChevronDown
                size={14}
                className={`text-ink/50 transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 nb-card py-1 z-50">
                <div className="px-4 py-2 border-b-2.5 border-ink">
                  <p className="font-body text-sm font-600 text-ink truncate">
                    {user?.name}
                  </p>

                  <p className="font-mono text-xs text-ink/50 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/dashboard')
                  }}
                  className="w-full text-left px-4 py-2 font-body text-sm hover:bg-cream"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/dashboard/settings')
                  }}
                  className="w-full text-left px-4 py-2 font-body text-sm hover:bg-cream"
                >
                  Settings
                </button>

                <div className="border-t-2.5 border-ink mt-1 pt-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      navigate('/login')
                    }}
                    className="w-full text-left px-4 py-2 font-body text-sm text-rose hover:bg-rose/10"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function PublicNavLink({ label, href, onClick }) {
  const isInternal = href.startsWith('/')

  if (isInternal) {
    return (
      <Link
        to={href}
        onClick={onClick}
        className="px-4 py-2 font-body text-sm font-600 text-ink/70 hover:text-ink rounded-nb hover:bg-white border-2.5 border-transparent hover:border-ink"
      >
        {label}
      </Link>
    )
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="px-4 py-2 font-body text-sm font-600 text-ink/70 hover:text-ink rounded-nb hover:bg-white border-2.5 border-transparent hover:border-ink"
    >
      {label}
    </a>
  )
}

function PublicNavLinkMobile({ label, href, onClick }) {
  const isInternal = href.startsWith('/')

  if (isInternal) {
    return (
      <Link
        to={href}
        onClick={onClick}
        className="px-4 py-3 font-body text-sm font-600 text-ink rounded-nb hover:bg-white border-2.5 border-transparent hover:border-ink"
      >
        {label}
      </Link>
    )
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="px-4 py-3 font-body text-sm font-600 text-ink rounded-nb hover:bg-white border-2.5 border-transparent hover:border-ink"
    >
      {label}
    </a>
  )
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Founders', href: '/founders' },
]

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-40 bg-cream border-b-2.5 border-ink">
      <div className="nb-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-volt border-2.5 border-ink rounded-nb flex items-center justify-center">
              <Zap size={16} />
            </div>

            <span className="font-display text-xl font-800 text-ink">
              Qubit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <PublicNavLink
                key={item.label}
                label={item.label}
                href={item.href}
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>

            <Button
              variant="volt"
              size="sm"
              onClick={() => navigate('/register')}
            >
              Get started
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-nb border-2.5 border-ink"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t-2.5 border-ink bg-cream">
          <div className="nb-container py-4 flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <PublicNavLinkMobile
                key={item.label}
                label={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setMobileOpen(false)
                navigate('/login')
              }}
            >
              Log in
            </Button>

            <Button
              variant="volt"
              fullWidth
              onClick={() => {
                setMobileOpen(false)
                navigate('/register')
              }}
            >
              Get started
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}