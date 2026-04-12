import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusSquare,
  BookOpen,
  BarChart3,
  Users,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Overview',     path: '/dashboard',         icon: LayoutDashboard },
  { label: 'Create Quiz',  path: '/dashboard/create',  icon: PlusSquare },
  { label: 'My Quizzes',   path: '/dashboard/quizzes', icon: BookOpen },
  { label: 'Results',      path: '/dashboard/results', icon: BarChart3 },
  { label: 'Students',     path: '/dashboard/students',icon: Users },
]

export default function Sidebar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout?.()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-3 px-5 py-6 border-b-2.5 border-white/10 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-9 h-9 bg-volt border-2.5 border-white rounded-nb shadow-nb-sm flex items-center justify-center shrink-0">
          <Zap size={18} className="text-ink" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-800 text-white leading-none">
            Qubit
          </span>
          <span className="font-mono text-xs text-white/40 leading-none mt-0.5">
            AI Quiz Platform
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              isActive
                ? 'nb-sidebar-item nb-sidebar-item-active'
                : 'nb-sidebar-item nb-sidebar-item-inactive'
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t-2.5 border-white/10 flex flex-col gap-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-lavender border-2.5 border-white rounded-nb flex items-center justify-center shrink-0">
              <span className="font-display text-xs font-800 text-ink">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body text-sm font-600 text-white truncate">
                {user.name}
              </span>
              <span className="font-mono text-xs text-white/40 truncate">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="nb-sidebar-item nb-sidebar-item-inactive w-full text-left"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-ink h-screen sticky top-0 shrink-0 border-r-2.5 border-ink">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-ink text-white border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={(e) => e.target === e.currentTarget && setMobileOpen(false)}
          style={{ backgroundColor: 'rgba(13,13,13,0.6)' }}
        >
          <aside className="w-64 bg-ink h-full border-r-2.5 border-white/10 animate-slide-in-left">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}