import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '@/components/layout/Sidebar'
import { DashboardNavbar } from '@/components/layout/Navbar'
import useAuth from '@/hooks/useAuth'

const PAGE_TITLES = {
  '/dashboard':          { title: 'Overview',     subtitle: 'Welcome back' },
  '/dashboard/create':   { title: 'Create Quiz',  subtitle: 'Upload a file and generate questions with AI' },
  '/dashboard/quizzes':  { title: 'My Quizzes',   subtitle: 'Manage and publish your quizzes' },
  '/dashboard/results':  { title: 'Results',      subtitle: 'View scores and leaderboards' },
  '/dashboard/students': { title: 'Students',     subtitle: 'Track student performance' },
  '/dashboard/analytics':{ title: 'Analytics',    subtitle: 'Deep dive into quiz data' },
}

function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}

function TeacherRoute() {
  const { user } = useSelector((state) => state.auth)
  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}

function PublicOnlyRoute() {
  const { token } = useSelector((state) => state.auth)
  if (token) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

function DashboardLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const meta = PAGE_TITLES[location.pathname] ?? { title: 'Dashboard', subtitle: '' }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar user={user} onLogout={signOut} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar
          user={user}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <main className="flex-1 p-6 animate-slide-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

import Landing    from '@/pages/Landing'
import Founders   from '@/pages/Founders'
import Login      from '@/pages/auth/Login'
import Register   from '@/pages/auth/Register'
import Overview   from '@/pages/dashboard/Overview'
import CreateQuiz from '@/pages/dashboard/CreateQuiz'
import MyQuizzes  from '@/pages/dashboard/MyQuizzes'
import Results    from '@/pages/dashboard/Results'
import Students   from '@/pages/dashboard/Students'
import Join       from '@/pages/student/Join'
import Quiz       from '@/pages/student/Quiz'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/founders" element={<Founders />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/join"       element={<Join />} />
        <Route path="/quiz/:code" element={<Quiz />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Overview />} />

            <Route element={<TeacherRoute />}>
              <Route path="/dashboard/create"   element={<CreateQuiz />} />
              <Route path="/dashboard/quizzes"  element={<MyQuizzes />} />
              <Route path="/dashboard/results"  element={<Results />} />
              <Route path="/dashboard/students" element={<Students />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 p-8">
      <div className="nb-card p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-volt border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center">
          <span className="font-display text-4xl font-800">404</span>
        </div>
        <h1 className="font-display text-2xl font-800 text-ink">
          Page not found
        </h1>
        <p className="font-body text-sm text-ink/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
          href="/"
          className="nb-btn-volt w-full text-center"
        >
          Go home
        </a>
      </div>
    </div>
  )
}