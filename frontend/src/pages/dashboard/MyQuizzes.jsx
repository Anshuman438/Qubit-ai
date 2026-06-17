import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Plus, Search, Filter, MoreVertical,
  Trash2, ToggleLeft, ToggleRight, QrCode, Copy,
  BarChart3, Clock, Users, Zap,
} from 'lucide-react'
import {
  fetchQuizzes,
  deleteQuiz,
  toggleQuizStatus,
  setFilters,
} from '@/store/quizSlice'
import Card, { CardHeader, CardDivider } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatusBadge, DifficultyBadge } from '@/components/ui/Badge'
import Modal, { ConfirmModal } from '@/components/ui/Modal'
import { notify } from '@/components/ui/Toast'
import { formatDate, truncate } from '@/utils/helpers'

import { quizApi } from '@/api/quizApi'

function QuizActionMenu({ quiz, onDelete, onToggle, onQR, onCopyCode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1.5 rounded-nb border-2.5 border-transparent hover:border-ink hover:bg-cream hover:shadow-nb-sm transition-all"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 nb-card py-1 z-20 animate-slide-in-up">
            <button
              onClick={() => { onCopyCode(quiz.code); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-cream transition-colors"
            >
              <Copy size={14} className="text-ink/50" /> Copy code
            </button>
            <button
              onClick={() => { onQR(quiz); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-cream transition-colors"
            >
              <QrCode size={14} className="text-ink/50" /> Show QR
            </button>
            <button
              onClick={() => { onToggle(quiz); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 font-body text-sm text-ink hover:bg-cream transition-colors"
            >
              {quiz.status === 'live'
                ? <><ToggleLeft  size={14} className="text-rose" /> Deactivate</>
                : <><ToggleRight size={14} className="text-mint" /> Go live</>
              }
            </button>
            <div className="border-t-2.5 border-ink/10 my-1" />
            <button
              onClick={() => { onDelete(quiz); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 font-body text-sm text-rose hover:bg-rose/10 transition-colors"
            >
              <Trash2 size={14} /> Delete quiz
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function QuizCard({ quiz, onDelete, onToggle, onQR, onCopyCode }) {
  const navigate = useNavigate()

  const statusColors = {
    live:  'border-l-mint',
    draft: 'border-l-ink/20',
    done:  'border-l-lavender',
  }

  return (
    <div className={`nb-card overflow-hidden border-l-4 ${statusColors[quiz.status] ?? 'border-l-ink/20'} hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-nb-lg transition-all duration-150`}>
      <div className="p-5 flex items-start gap-4">
        <div className="w-11 h-11 bg-lavender border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-ink" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-display text-base font-800 text-ink cursor-pointer hover:text-ink/70 transition-colors"
              onClick={() => navigate('/dashboard/results')}
            >
              {truncate(quiz.title, 50)}
            </h3>
            <QuizActionMenu
              quiz={quiz}
              onDelete={onDelete}
              onToggle={onToggle}
              onQR={onQR}
              onCopyCode={onCopyCode}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={quiz.status} />
            <DifficultyBadge difficulty={quiz.difficulty} />
            {quiz.status === 'live' && (
              <span className="flex items-center gap-1 font-mono text-xs text-mint">
                <span className="nb-live-dot" /> Live
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-ink/50">
            <span className="flex items-center gap-1">
              <BookOpen size={11} />
              {quiz.questions?.length ?? 0} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {quiz.timeLimit ?? 20} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              {quiz.attemptCount ?? 0} attempts
            </span>
            <span className="flex items-center gap-1">
              Created {formatDate(quiz.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t-2.5 border-ink px-5 py-3 bg-cream flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-ink/50">Code:</span>
          <span className="font-display text-sm font-800 text-ink tracking-wider">{quiz.code}</span>
          <button
            onClick={() => onCopyCode(quiz.code)}
            className="p-1 rounded hover:bg-ink hover:text-white text-ink/40 transition-colors"
          >
            <Copy size={12} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<BarChart3 size={13} />}
            onClick={() => navigate('/dashboard/results')}
          >
            Results
          </Button>
          <Button
            variant={quiz.status === 'live' ? 'rose' : 'mint'}
            size="sm"
            icon={quiz.status === 'live' ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
            onClick={() => onToggle(quiz)}
          >
            {quiz.status === 'live' ? 'Deactivate' : 'Go live'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-20 h-20 bg-cream border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center animate-float">
        <BookOpen size={32} className="text-ink/30" />
      </div>
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="font-display text-xl font-800 text-ink">No quizzes yet</h3>
        <p className="font-body text-sm text-ink/50">
          Create your first quiz by uploading a PDF or Word document and letting AI do the work.
        </p>
      </div>
      <Button variant="volt" icon={<Plus size={16} />} onClick={onCreate}>
        Create your first quiz
      </Button>
    </div>
  )
}

export default function MyQuizzes() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { quizzes, loading, filters } = useSelector((state) => state.quiz)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)
  const [qrTarget,     setQrTarget]     = useState(null)
  const [qrImage,      setQrImage]      = useState('')
  const [viewMode,     setViewMode]     = useState('grid')

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  const filtered = quizzes.filter((q) => {
    const matchStatus = filters.status === 'all' || q.status === filters.status
    const matchSearch = !filters.search || q.title.toLowerCase().includes(filters.search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleToggle = async (quiz) => {
    const result = await dispatch(toggleQuizStatus(quiz._id))
    if (toggleQuizStatus.fulfilled.match(result)) {
      const next = result.payload.quiz.status
      notify.success(`Quiz is now ${next === 'live' ? '🟢 live' : '⚪ inactive'}`)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const result = await dispatch(deleteQuiz(deleteTarget._id))
    setDeleting(false)
    if (deleteQuiz.fulfilled.match(result)) {
      notify.success('Quiz deleted')
      setDeleteTarget(null)
    }
  }

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    notify.success(`Code "${code}" copied to clipboard`)
  }

  const handleShowQR = async (quiz) => {
    setQrTarget(quiz)
    try {
      const res = await quizApi.getQR(quiz._id)
      setQrImage(res.data.qr)
    } catch {
      notify.error('Failed to load QR code')
    }
  }

  const STATUS_FILTERS = [
    { value: 'all',   label: 'All' },
    { value: 'live',  label: 'Live' },
    { value: 'draft', label: 'Draft' },
    { value: 'done',  label: 'Done' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-800 text-ink">{quizzes.length}</span>
          <span className="font-body text-sm text-ink/50">quizzes total</span>
          {quizzes.filter((q) => q.status === 'live').length > 0 && (
            <span className="flex items-center gap-1.5 nb-badge-mint">
              <span className="nb-live-dot" />
              {quizzes.filter((q) => q.status === 'live').length} live
            </span>
          )}
        </div>
        <Button
          variant="volt"
          icon={<Plus size={16} />}
          onClick={() => navigate('/dashboard/create')}
        >
          New Quiz
        </Button>
      </div>

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="nb-input pl-9 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-ink/40 shrink-0" />
            <div className="flex border-2.5 border-ink rounded-nb overflow-hidden shadow-nb-sm">
              {STATUS_FILTERS.map((f, i) => (
                <button
                  key={f.value}
                  onClick={() => dispatch(setFilters({ status: f.value }))}
                  className={`
                    px-3 py-1.5 font-body text-xs font-600 transition-all duration-100
                    ${i > 0 ? 'border-l-2.5 border-ink' : ''}
                    ${filters.status === f.value ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="nb-skeleton h-40 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        quizzes.length === 0
          ? <EmptyState onCreate={() => navigate('/dashboard/create')} />
          : (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <Search size={32} className="text-ink/20" />
              <p className="font-body text-sm text-ink/50">No quizzes match your search</p>
              <Button variant="ghost" size="sm" onClick={() => dispatch(setFilters({ search: '', status: 'all' }))}>
                Clear filters
              </Button>
            </div>
          )
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={setDeleteTarget}
              onToggle={handleToggle}
              onQR={handleShowQR}
              onCopyCode={handleCopyCode}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete quiz?"
        message={`"${deleteTarget?.title}" and all its student attempts will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete permanently"
        loading={deleting}
        variant="rose"
      />

      <Modal
        open={Boolean(qrTarget)}
        onClose={() => { setQrTarget(null); setQrImage('') }}
        title="Quiz QR Code"
        subtitle={qrTarget?.title}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 py-2">
          {qrImage ? (
            <img src={qrImage} alt="QR Code" className="w-48 h-48 border-2.5 border-ink rounded-nb shadow-nb" />
          ) : (
            <div className="w-48 h-48 nb-skeleton" />
          )}
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-800 text-ink tracking-widest">
              {qrTarget?.code}
            </span>
            <p className="font-body text-xs text-ink/50">
              Students can scan or enter this code
            </p>
          </div>
          <Button
            variant="volt"
            fullWidth
            icon={<Copy size={14} />}
            onClick={() => handleCopyCode(qrTarget?.code)}
          >
            Copy code
          </Button>
        </div>
      </Modal>
    </div>
  )
}