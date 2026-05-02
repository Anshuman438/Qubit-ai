import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Users,
  TrendingUp,
  Zap,
  Plus,
  ArrowRight,
  Clock,
  BarChart3,
} from 'lucide-react'
import { fetchQuizzes } from '@/store/quizSlice'
import Card, { StatCard, CardHeader, CardDivider } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatusBadge, DifficultyBadge, ScoreBadge } from '@/components/ui/Badge'
import { formatDate, timeAgo, formatDuration, calcPercentage } from '@/utils/helpers'

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma',   score: 95, time: 842 },
  { rank: 2, name: 'Arjun Mehta',    score: 88, time: 901 },
  { rank: 3, name: 'Sara Khan',      score: 85, time: 780 },
  { rank: 4, name: 'Rohan Gupta',    score: 82, time: 956 },
  { rank: 5, name: 'Anika Patel',    score: 79, time: 1020 },
]

const MOCK_ACTIVITY = [
  { text: 'Arjun Mehta completed "React Basics"',       time: '2 min ago' },
  { text: 'New quiz "OS Concepts" published',           time: '18 min ago' },
  { text: 'Sara Khan joined "Data Structures"',         time: '34 min ago' },
  { text: '"JavaScript Fundamentals" went live',        time: '1 hr ago' },
  { text: '12 students completed "Networks Quiz"',      time: '2 hrs ago' },
]

function RankBadge({ rank }) {
  const styles = {
    1: 'bg-volt border-ink text-ink',
    2: 'bg-lavender border-ink text-ink',
    3: 'bg-peach border-ink text-ink',
  }
  return (
    <span className={`w-7 h-7 rounded-nb border-2.5 flex items-center justify-center font-mono text-xs font-700 shrink-0 ${styles[rank] ?? 'bg-white border-ink text-ink'}`}>
      {rank}
    </span>
  )
}

export default function Overview() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { quizzes, loading } = useSelector((state) => state.quiz)
  const { user }             = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  const totalQuizzes  = quizzes.length
  const liveQuizzes   = quizzes.filter((q) => q.status === 'live').length
  const totalAttempts = quizzes.reduce((sum, q) => sum + (q.attemptCount ?? 0), 0)
  const recentQuizzes = [...quizzes].slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-2xl font-800 text-ink">
            Good {getGreeting()},{' '}
            <span className="text-ink/70">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="font-body text-sm text-ink/50">
            Here's what's happening with your quizzes today.
          </p>
        </div>
        <Button
          variant="volt"
          icon={<Plus size={16} />}
          onClick={() => navigate('/dashboard/create')}
          className="hidden sm:inline-flex"
        >
          New Quiz
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Quizzes"
          value={totalQuizzes}
          delta={12}
          deltaLabel="vs last month"
          icon={<BookOpen size={16} />}
          accent="volt"
        />
        <StatCard
          label="Total Attempts"
          value={totalAttempts.toLocaleString()}
          delta={8}
          deltaLabel="vs last month"
          icon={<Users size={16} />}
          accent="sky"
        />
        <StatCard
          label="Avg Score"
          value="74%"
          delta={-3}
          deltaLabel="vs last month"
          icon={<TrendingUp size={16} />}
          accent="lavender"
        />
        <StatCard
          label="Live Now"
          value={liveQuizzes}
          icon={<Zap size={16} />}
          accent="mint"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card padding="none">
            <div className="p-5 pb-0">
              <CardHeader
                title="Recent Quizzes"
                subtitle={`${totalQuizzes} total`}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowRight size={14} />}
                    iconPosition="right"
                    onClick={() => navigate('/dashboard/quizzes')}
                  >
                    View all
                  </Button>
                }
              />
            </div>
            <CardDivider />

            {loading ? (
              <div className="p-5 flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="nb-skeleton h-16 w-full" />
                ))}
              </div>
            ) : recentQuizzes.length === 0 ? (
              <div className="p-10 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 bg-cream border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center">
                  <BookOpen size={24} className="text-ink/40" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-display text-base font-800 text-ink">No quizzes yet</p>
                  <p className="font-body text-sm text-ink/50">Create your first quiz to get started</p>
                </div>
                <Button
                  variant="volt"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => navigate('/dashboard/create')}
                >
                  Create Quiz
                </Button>
              </div>
            ) : (
              <div className="divide-y-2.5 divide-ink">
                {recentQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-cream transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/quizzes`)}
                  >
                    <div className="w-10 h-10 bg-lavender border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-ink" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-600 text-ink truncate">
                        {quiz.title}
                      </p>
                      <p className="font-mono text-xs text-ink/50">
                        {quiz.questions?.length ?? 0} questions · {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <DifficultyBadge difficulty={quiz.difficulty} />
                      <StatusBadge status={quiz.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="none">
            <div className="p-5 pb-0">
              <CardHeader title="Recent Activity" />
            </div>
            <CardDivider />
            <div className="divide-y-2.5 divide-ink">
              {MOCK_ACTIVITY.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-mint border border-ink shrink-0" />
                    <p className="font-body text-sm text-ink">{item.text}</p>
                  </div>
                  <span className="font-mono text-xs text-ink/40 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card padding="none">
            <div className="p-5 pb-0">
              <CardHeader
                title="Top Students"
                subtitle="All time"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<BarChart3 size={14} />}
                    onClick={() => navigate('/dashboard/results')}
                  />
                }
              />
            </div>
            <CardDivider />
            <div className="p-3 flex flex-col gap-2">
              {MOCK_LEADERBOARD.map((student) => (
                <div
                  key={student.rank}
                  className={`flex items-center gap-3 p-3 rounded-nb border-2.5 border-ink transition-all ${
                    student.rank === 1 ? 'bg-volt shadow-nb-sm' : 'bg-white hover:bg-cream'
                  }`}
                >
                  <RankBadge rank={student.rank} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-600 text-ink truncate">
                      {student.name}
                    </p>
                    <p className="font-mono text-xs text-ink/50">
                      {formatDuration(student.time)}
                    </p>
                  </div>
                  <ScoreBadge score={student.score} total={100} />
                </div>
              ))}
            </div>
          </Card>

          <Card variant="volt" padding="md">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-ink rounded-nb border-2.5 border-ink shadow-nb-sm flex items-center justify-center">
                <Zap size={18} className="text-volt" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-base font-800 text-ink">
                  Create a quiz in 60s
                </h3>
                <p className="font-body text-xs text-ink/70">
                  Upload a PDF and let AI generate your questions instantly.
                </p>
              </div>
              <Button
                variant="ink"
                size="sm"
                fullWidth
                icon={<Plus size={14} />}
                onClick={() => navigate('/dashboard/create')}
              >
                Start now
              </Button>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex flex-col gap-3">
              <CardHeader title="Quick Stats" />
              <CardDivider />
              {[
                { label: 'Draft quizzes',    value: quizzes.filter((q) => q.status === 'draft').length, icon: Clock },
                { label: 'Live quizzes',     value: liveQuizzes,                                         icon: Zap },
                { label: 'Completed',        value: quizzes.filter((q) => q.status === 'done').length,   icon: BookOpen },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-ink/50" />
                    <span className="font-body text-sm text-ink/70">{label}</span>
                  </div>
                  <span className="font-display text-sm font-800 text-ink">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}