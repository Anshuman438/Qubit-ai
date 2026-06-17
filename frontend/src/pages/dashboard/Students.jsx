import { useState, useMemo } from 'react'
import {
  Search, Mail, TrendingUp, TrendingDown, Award,
  BookOpen, Clock, ChevronDown, Filter, Users,
} from 'lucide-react'
import Card, { StatCard, CardHeader, CardDivider } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { ScoreBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { getInitials, formatDate, scoreColor } from '@/utils/helpers'

const MOCK_STUDENTS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@school.edu',  quizzesTaken: 12, avgScore: 91, trend: 'up',   lastActive: '2026-06-16T09:00:00', bestQuiz: 'React Basics',       worstQuiz: 'Networks' },
  { id: 2, name: 'Arjun Mehta',  email: 'arjun@school.edu',  quizzesTaken: 15, avgScore: 84, trend: 'up',   lastActive: '2026-06-16T11:20:00', bestQuiz: 'Data Structures',    worstQuiz: 'OS Concepts' },
  { id: 3, name: 'Sara Khan',    email: 'sara@school.edu',   quizzesTaken: 9,  avgScore: 78, trend: 'down', lastActive: '2026-06-15T14:00:00', bestQuiz: 'JavaScript Fund.',   worstQuiz: 'React Basics' },
  { id: 4, name: 'Rohan Gupta',  email: 'rohan@school.edu',  quizzesTaken: 11, avgScore: 73, trend: 'up',   lastActive: '2026-06-16T08:30:00', bestQuiz: 'OS Concepts',        worstQuiz: 'Data Structures' },
  { id: 5, name: 'Anika Patel',  email: 'anika@school.edu',  quizzesTaken: 8,  avgScore: 68, trend: 'down', lastActive: '2026-06-14T16:45:00', bestQuiz: 'Networks',           worstQuiz: 'JavaScript Fund.' },
  { id: 6, name: 'Dev Kumar',    email: 'dev@school.edu',    quizzesTaken: 6,  avgScore: 55, trend: 'down', lastActive: '2026-06-13T10:10:00', bestQuiz: 'React Basics',       worstQuiz: 'OS Concepts' },
  { id: 7, name: 'Meera Iyer',   email: 'meera@school.edu',  quizzesTaken: 14, avgScore: 88, trend: 'up',   lastActive: '2026-06-16T12:00:00', bestQuiz: 'Data Structures',    worstQuiz: 'Networks' },
]

const SORT_OPTIONS = [
  { value: 'avgScore-desc',     label: 'Highest score' },
  { value: 'avgScore-asc',      label: 'Lowest score' },
  { value: 'quizzesTaken-desc', label: 'Most active' },
  { value: 'name-asc',          label: 'Name (A-Z)' },
]

function StudentDetailModal({ student, onClose }) {
  if (!student) return null

  return (
    <Modal open={Boolean(student)} onClose={onClose} title={student.name} subtitle={student.email} size="md">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="nb-card-cream p-4 flex flex-col items-center gap-1">
            <BookOpen size={16} className="text-ink/50" />
            <span className="font-display text-xl font-800 text-ink">{student.quizzesTaken}</span>
            <span className="font-body text-xs text-ink/50">Quizzes</span>
          </div>
          <div className="nb-card-cream p-4 flex flex-col items-center gap-1">
            <Award size={16} className="text-ink/50" />
            <span className={`font-display text-xl font-800 ${scoreColor(student.avgScore)}`}>
              {student.avgScore}%
            </span>
            <span className="font-body text-xs text-ink/50">Avg Score</span>
          </div>
          <div className="nb-card-cream p-4 flex flex-col items-center gap-1">
            {student.trend === 'up'
              ? <TrendingUp size={16} className="text-mint" />
              : <TrendingDown size={16} className="text-rose" />
            }
            <span className="font-display text-xl font-800 text-ink capitalize">{student.trend}</span>
            <span className="font-body text-xs text-ink/50">Trend</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-mint/15 border-2.5 border-mint rounded-nb">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-ink" />
              <span className="font-body text-sm font-600 text-ink">Best performance</span>
            </div>
            <span className="font-body text-sm text-ink/70">{student.bestQuiz}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-rose/15 border-2.5 border-rose rounded-nb">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-ink" />
              <span className="font-body text-sm font-600 text-ink">Needs improvement</span>
            </div>
            <span className="font-body text-sm text-ink/70">{student.worstQuiz}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-cream rounded-nb border-2.5 border-ink">
          <Clock size={14} className="text-ink/50" />
          <span className="font-body text-sm text-ink/70">
            Last active {formatDate(student.lastActive)}
          </span>
        </div>
      </div>
    </Modal>
  )
}

function StudentRow({ student, onClick }) {
  return (
    <tr className="cursor-pointer" onClick={() => onClick(student)}>
      <td>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lavender border-2.5 border-ink rounded-nb flex items-center justify-center shrink-0">
            <span className="font-display text-xs font-800 text-ink">{getInitials(student.name)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-600">{student.name}</span>
            <span className="font-mono text-xs text-ink/40 flex items-center gap-1">
              <Mail size={10} /> {student.email}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className="font-700">{student.quizzesTaken}</span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <span className={`font-display text-base font-800 ${scoreColor(student.avgScore)}`}>
            {student.avgScore}%
          </span>
          <ScoreBadge score={student.avgScore} total={100} />
        </div>
      </td>
      <td>
        {student.trend === 'up' ? (
          <span className="flex items-center gap-1 text-mint font-600 text-xs">
            <TrendingUp size={12} /> Improving
          </span>
        ) : (
          <span className="flex items-center gap-1 text-rose font-600 text-xs">
            <TrendingDown size={12} /> Declining
          </span>
        )}
      </td>
      <td>
        <span className="font-mono text-xs text-ink/50">{formatDate(student.lastActive)}</span>
      </td>
    </tr>
  )
}

export default function Students() {
  const [search,   setSearch]   = useState('')
  const [sort,     setSort]     = useState('avgScore-desc')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const [key, dir] = sort.split('-')
    return MOCK_STUDENTS
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (key === 'name') return dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        return dir === 'asc' ? a[key] - b[key] : b[key] - a[key]
      })
  }, [search, sort])

  const totalStudents = MOCK_STUDENTS.length
  const avgClassScore = Math.round(MOCK_STUDENTS.reduce((s, x) => s + x.avgScore, 0) / totalStudents)
  const topPerformer   = [...MOCK_STUDENTS].sort((a, b) => b.avgScore - a.avgScore)[0]
  const needsAttention  = MOCK_STUDENTS.filter((s) => s.avgScore < 60).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={<Users size={16} />}
          accent="sky"
        />
        <StatCard
          label="Class Average"
          value={`${avgClassScore}%`}
          icon={<TrendingUp size={16} />}
          accent="lavender"
        />
        <StatCard
          label="Top Performer"
          value={topPerformer.name.split(' ')[0]}
          icon={<Award size={16} />}
          accent="volt"
        />
        <StatCard
          label="Needs Attention"
          value={needsAttention}
          icon={<TrendingDown size={16} />}
          accent="rose"
        />
      </div>

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="nb-input pl-9 py-2 text-sm"
            />
          </div>
          <div className="w-full sm:w-56">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-5">
          <CardHeader title="All Students" subtitle={`${filtered.length} of ${totalStudents} shown`} />
        </div>
        <CardDivider />

        {filtered.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center gap-2">
            <Users size={28} className="text-ink/20" />
            <p className="font-body text-sm text-ink/50">No students match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="nb-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quizzes Taken</th>
                  <th>Avg Score</th>
                  <th>Trend</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <StudentRow key={student.id} student={student} onClick={setSelected} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <StudentDetailModal student={selected} onClose={() => setSelected(null)} />
    </div>
  )
}