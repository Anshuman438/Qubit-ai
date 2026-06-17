import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Trophy, Download, Search, Flag, Clock,
  TrendingUp, Users, Target, ChevronDown,
} from 'lucide-react'
import { fetchQuizzes } from '@/store/quizSlice'
import { quizApi } from '@/api/quizApi'
import Card, { StatCard, CardHeader, CardDivider } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { ScoreBadge } from '@/components/ui/Badge'
import { notify } from '@/components/ui/Toast'
import { formatDuration, formatDateTime, downloadBlob, getInitials } from '@/utils/helpers'

const MOCK_ATTEMPTS = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@school.edu',  score: 19, total: 20, time: 842,  submittedAt: '2026-06-15T10:30:00', flagged: false },
  { id: 2, name: 'Arjun Mehta',   email: 'arjun@school.edu',  score: 17, total: 20, time: 901,  submittedAt: '2026-06-15T10:32:00', flagged: false },
  { id: 3, name: 'Sara Khan',     email: 'sara@school.edu',   score: 17, total: 20, time: 780,  submittedAt: '2026-06-15T10:28:00', flagged: true  },
  { id: 4, name: 'Rohan Gupta',   email: 'rohan@school.edu',  score: 16, total: 20, time: 956,  submittedAt: '2026-06-15T10:35:00', flagged: false },
  { id: 5, name: 'Anika Patel',   email: 'anika@school.edu',  score: 15, total: 20, time: 1020, submittedAt: '2026-06-15T10:40:00', flagged: false },
  { id: 6, name: 'Dev Kumar',     email: 'dev@school.edu',    score: 12, total: 20, time: 1100, submittedAt: '2026-06-15T10:38:00', flagged: false },
  { id: 7, name: 'Meera Iyer',    email: 'meera@school.edu',  score: 9,  total: 20, time: 1200, submittedAt: '2026-06-15T10:45:00', flagged: false },
]

const SCORE_BUCKETS = [
  { label: '90-100%', min: 90, max: 100, color: 'bg-mint' },
  { label: '75-89%',  min: 75, max: 89,  color: 'bg-sky' },
  { label: '50-74%',  min: 50, max: 74,  color: 'bg-peach' },
  { label: '0-49%',   min: 0,  max: 49,  color: 'bg-rose' },
]

function RankCell({ rank }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>
  if (rank === 2) return <span className="text-2xl">🥈</span>
  if (rank === 3) return <span className="text-2xl">🥉</span>
  return <span className="font-mono text-sm font-700 text-ink/50">#{rank}</span>
}

function ScoreDistribution({ attempts }) {
  const total = attempts.length || 1
  const buckets = SCORE_BUCKETS.map((b) => {
    const count = attempts.filter((a) => {
      const pct = (a.score / a.total) * 100
      return pct >= b.min && pct <= b.max
    }).length
    return { ...b, count, pct: Math.round((count / total) * 100) }
  })

  return (
    <div className="flex flex-col gap-3">
      {buckets.map((b) => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink/50 w-16 shrink-0">{b.label}</span>
          <div className="nb-progress flex-1">
            <div className={`nb-progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} />
          </div>
          <span className="font-mono text-xs font-700 text-ink w-10 text-right shrink-0">
            {b.count}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Results() {
  const dispatch = useDispatch()
  const { quizzes } = useSelector((state) => state.quiz)

  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [search,       setSearch]       = useState('')
  const [sortBy,        setSortBy]      = useState('score')
  const [exporting,     setExporting]   = useState(false)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  useEffect(() => {
    if (quizzes.length > 0 && !selectedQuiz) {
      setSelectedQuiz(quizzes[0]._id)
    }
  }, [quizzes, selectedQuiz])

  const attempts = MOCK_ATTEMPTS
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'time')  return a.time - b.time
      if (sortBy === 'name')  return a.name.localeCompare(b.name)
      return 0
    })

  const avgScore   = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / attempts.length)
    : 0
  const highScore  = attempts.length ? Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100))) : 0
  const flaggedCount = attempts.filter((a) => a.flagged).length

  const handleExport = async (format) => {
    if (!selectedQuiz) { notify.error('Select a quiz first'); return }
    setExporting(true)
    try {
      const res = await quizApi.exportResults(selectedQuiz, format)
      downloadBlob(res.data, `quiz-results.${format}`)
      notify.success(`Results exported as ${format.toUpperCase()}`)
    } catch {
      notify.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const quizOptions = quizzes.map((q) => ({ value: q._id, label: q.title }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            options={quizOptions}
            placeholder="Select a quiz"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="white"
            size="sm"
            icon={<Download size={14} />}
            loading={exporting}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="ink"
            size="sm"
            icon={<Download size={14} />}
            loading={exporting}
            onClick={() => handleExport('xlsx')}
          >
            Export XLSX
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Attempts"
          value={attempts.length}
          icon={<Users size={16} />}
          accent="sky"
        />
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={<TrendingUp size={16} />}
          accent="lavender"
        />
        <StatCard
          label="Highest Score"
          value={`${highScore}%`}
          icon={<Trophy size={16} />}
          accent="volt"
        />
        <StatCard
          label="Flagged"
          value={flaggedCount}
          icon={<Flag size={16} />}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardHeader title="Leaderboard" subtitle={`${attempts.length} students`} />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="nb-input pl-8 py-1.5 text-xs w-32 sm:w-40"
                  />
                </div>
              </div>
            </div>
            <CardDivider />

            <div className="overflow-x-auto">
              <table className="nb-table">
                <thead>
                  <tr>
                    <th className="w-16">Rank</th>
                    <th>Student</th>
                    <th
                      className="cursor-pointer"
                      onClick={() => setSortBy('score')}
                    >
                      <span className="flex items-center gap-1">Score <ChevronDown size={12} /></span>
                    </th>
                    <th
                      className="cursor-pointer"
                      onClick={() => setSortBy('time')}
                    >
                      <span className="flex items-center gap-1">Time <ChevronDown size={12} /></span>
                    </th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => (
                    <tr key={a.id}>
                      <td><RankCell rank={i + 1} /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-lavender border-2 border-ink rounded-nb flex items-center justify-center shrink-0">
                            <span className="font-display text-xs font-800 text-ink">{getInitials(a.name)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-600">{a.name}</span>
                            <span className="font-mono text-xs text-ink/40">{a.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-700">{a.score}/{a.total}</span>
                          <ScoreBadge score={a.score} total={a.total} />
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1 font-mono text-xs">
                          <Clock size={11} className="text-ink/40" />
                          {formatDuration(a.time)}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-ink/50">
                          {formatDateTime(a.submittedAt)}
                        </span>
                      </td>
                      <td>
                        {a.flagged ? (
                          <span className="flex items-center gap-1 nb-badge-rose">
                            <Flag size={10} /> Flagged
                          </span>
                        ) : (
                          <span className="nb-badge-mint">Clean</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card padding="md">
            <CardHeader title="Score Distribution" />
            <CardDivider />
            <div className="pt-3">
              <ScoreDistribution attempts={attempts} />
            </div>
          </Card>

          <Card variant="lavender" padding="md">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-ink rounded-nb border-2.5 border-ink shadow-nb-sm flex items-center justify-center">
                <Target size={18} className="text-volt" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-base font-800 text-ink">
                  Insight
                </h3>
                <p className="font-body text-xs text-ink/70 leading-relaxed">
                  {avgScore >= 75
                    ? 'Students are performing well above average. Consider increasing difficulty for the next quiz.'
                    : avgScore >= 50
                    ? 'Performance is moderate. Review the questions with the lowest correct-answer rate.'
                    : 'Scores are below expectations. Consider revisiting the material before the next assessment.'}
                </p>
              </div>
            </div>
          </Card>

          {flaggedCount > 0 && (
            <Card padding="md" className="border-rose">
              <div className="flex items-start gap-3">
                <Flag size={18} className="text-rose shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-sm font-800 text-ink">
                    {flaggedCount} flagged attempt{flaggedCount !== 1 ? 's' : ''}
                  </h3>
                  <p className="font-body text-xs text-ink/60">
                    These students triggered anti-cheat violations during their attempt. Review before finalizing grades.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}