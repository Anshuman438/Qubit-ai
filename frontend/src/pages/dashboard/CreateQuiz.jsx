import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, Brain, Plus, Trash2, Check,
  ChevronDown, ChevronUp, Zap, Eye, EyeOff, Copy,
} from 'lucide-react'
import {
  generateQuestions,
  createQuiz,
  addQuestion,
  removeQuestion,
  acceptAllGenerated,
  acceptGeneratedQuestion,
  clearGeneratedQs,
} from '@/store/quizSlice'
import { quizApi } from '@/api/quizApi'
import Card, { CardHeader, CardDivider } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select, Textarea } from '@/components/ui/Input'
import { DifficultyBadge } from '@/components/ui/Badge'
import { notify } from '@/components/ui/Toast'
import { truncate } from '@/utils/helpers'

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30].map((n) => ({ value: String(n), label: `${n} questions` }))
const DIFFICULTIES    = ['easy', 'medium', 'hard', 'mixed'].map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))
const TYPES           = [
  { value: 'mcq',       label: 'Multiple Choice (MCQ)' },
  { value: 'truefalse', label: 'True / False' },
  { value: 'short',     label: 'Short Answer' },
  { value: 'mixed',     label: 'Mixed' },
]
const TIME_LIMITS = [5, 10, 15, 20, 30, 45, 60].map((n) => ({ value: String(n), label: `${n} minutes` }))

const STEPS = ['Upload', 'Configure', 'Review', 'Publish']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, index) => {
        const done   = index < current
        const active = index === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-nb border-2.5 border-ink flex items-center justify-center font-mono text-xs font-700 transition-all ${
                done   ? 'bg-mint text-ink shadow-nb-sm' :
                active ? 'bg-volt text-ink shadow-nb-sm' :
                         'bg-white text-ink/40'
              }`}>
                {done ? <Check size={12} /> : index + 1}
              </div>
              <span className={`font-body text-xs font-600 hidden sm:block ${active ? 'text-ink' : 'text-ink/40'}`}>
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${done ? 'bg-mint' : 'bg-ink/20'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function QuestionCard({ question, index, onRemove, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="nb-card overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-cream transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-7 h-7 bg-ink text-white rounded-nb border-2.5 border-ink flex items-center justify-center font-mono text-xs font-700 shrink-0">
          {index + 1}
        </div>
        <p className="flex-1 font-body text-sm font-600 text-ink truncate">
          {truncate(question.text ?? question.question, 80)}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="nb-tag">{question.type ?? 'mcq'}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(index) }}
            className="p-1 rounded hover:bg-rose/20 text-ink/40 hover:text-rose transition-colors"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={14} className="text-ink/40" /> : <ChevronDown size={14} className="text-ink/40" />}
        </div>
      </div>

      {open && (
        <div className="border-t-2.5 border-ink px-4 py-4 flex flex-col gap-3 bg-cream animate-slide-in-up">
          <p className="font-body text-sm text-ink font-600">{question.text ?? question.question}</p>

          {(question.type === 'mcq' || !question.type) && question.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((opt, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-nb border-2.5 text-sm font-body ${
                    opt === (question.correctAnswer ?? question.answer)
                      ? 'bg-mint border-ink font-600'
                      : 'bg-white border-ink/30 text-ink/70'
                  }`}
                >
                  <span className="font-mono text-xs mr-2 text-ink/50">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </div>
              ))}
            </div>
          )}

          {(question.type === 'truefalse') && (
            <div className="flex gap-2">
              {['True', 'False'].map((opt) => (
                <div
                  key={opt}
                  className={`px-4 py-2 rounded-nb border-2.5 text-sm font-body font-600 ${
                    opt === (question.correctAnswer ?? question.answer)
                      ? 'bg-mint border-ink'
                      : 'bg-white border-ink/30 text-ink/50'
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}

          {question.type === 'short' && (
            <div className="px-3 py-2 bg-mint/20 border-2.5 border-mint rounded-nb">
              <span className="font-mono text-xs text-ink/50 mr-2">Answer:</span>
              <span className="font-body text-sm font-600 text-ink">{question.correctAnswer ?? question.answer}</span>
            </div>
          )}

          {question.explanation && (
            <div className="px-3 py-2 bg-sky/20 border-2.5 border-sky rounded-nb">
              <span className="font-mono text-xs text-ink/50 mr-1">Explanation:</span>
              <span className="font-body text-sm text-ink/70">{question.explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CreateQuiz() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { questions, generatedQs, generating, loading } = useSelector((state) => state.quiz)

  const [step,        setStep]        = useState(0)
  const [file,        setFile]        = useState(null)
  const [fileId,      setFileId]      = useState(null)
  const [uploading,   setUploading]   = useState(false)
  const [preview,     setPreview]     = useState('')
  const [count,       setCount]       = useState('10')
  const [difficulty,  setDifficulty]  = useState('mixed')
  const [qtype,       setQtype]       = useState('mcq')
  const [title,       setTitle]       = useState('')
  const [timeLimit,   setTimeLimit]   = useState('20')
  const [negative,    setNegative]    = useState('0')
  const [shuffle,     setShuffle]     = useState(true)
  const [quizCode,    setQuizCode]    = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const fileRef = useRef()

  const handleFileDrop = async (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer?.files[0] ?? e.target.files[0]
    if (!dropped) return
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowed.includes(dropped.type)) {
      notify.error('Only PDF, DOCX, and TXT files are supported')
      return
    }
    if (dropped.size > 10 * 1024 * 1024) {
      notify.error('File size must be under 10MB')
      return
    }
    setFile(dropped)
    await uploadFile(dropped)
  }

  const uploadFile = async (f) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', f)
      const res = await quizApi.uploadFile(form)
      setFileId(res.data.fileId)
      setPreview(res.data.preview ?? '')
      notify.success('File uploaded successfully')
      setStep(1)
    } catch {
      notify.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!fileId) { notify.error('Please upload a file first'); return }
    const result = await dispatch(generateQuestions({
      fileId,
      count:      parseInt(count),
      difficulty,
      type:       qtype,
    }))
    if (generateQuestions.fulfilled.match(result)) {
      notify.success(`${result.payload.questions.length} questions generated!`)
      setStep(2)
    }
  }

  const handleAcceptAll = () => {
    dispatch(acceptAllGenerated())
    notify.success('All questions added to your quiz')
  }

  const handleAcceptOne = (index) => {
    dispatch(acceptGeneratedQuestion(index))
    notify.success('Question added')
  }

  const handlePublish = async () => {
    if (!title.trim()) { notify.error('Quiz title is required'); return }
    if (questions.length === 0) { notify.error('Add at least one question'); return }

    const result = await dispatch(createQuiz({
      title:      title.trim(),
      questions,
      timeLimit:  parseInt(timeLimit),
      negative:   parseFloat(negative),
      shuffle,
      difficulty,
    }))

    if (createQuiz.fulfilled.match(result)) {
      setQuizCode(result.payload.quiz.code)
      notify.success('Quiz published successfully!')
      setStep(3)
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(quizCode)
    notify.success('Quiz code copied!')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <StepIndicator current={step} />
        {step > 0 && step < 3 && (
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </Button>
        )}
      </div>

      {step === 0 && (
        <Card padding="none" className="animate-slide-in-up">
          <div className="p-6">
            <CardHeader
              title="Upload your material"
              subtitle="PDF, DOCX, or TXT — max 10MB"
            />
          </div>
          <CardDivider />
          <div className="p-6 flex flex-col gap-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                border-2.5 border-dashed border-ink rounded-nb
                flex flex-col items-center justify-center gap-4
                py-16 px-8 cursor-pointer text-center
                transition-all duration-150
                hover:bg-volt/10 hover:border-solid
                ${uploading ? 'opacity-60 pointer-events-none' : ''}
              `}
            >
              <div className="w-14 h-14 bg-cream border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center animate-float">
                <Upload size={24} className="text-ink" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-lg font-800 text-ink">
                  Drop your file here
                </p>
                <p className="font-body text-sm text-ink/50">
                  or click to browse · PDF, DOCX, TXT · max 10MB
                </p>
              </div>
              {uploading && (
                <div className="nb-badge-volt animate-pulse">
                  Uploading...
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileDrop}
            />

            {file && (
              <div className="flex items-center gap-3 p-4 bg-cream rounded-nb border-2.5 border-ink animate-slide-in-up">
                <div className="w-10 h-10 bg-volt border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-ink" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-600 text-ink truncate">{file.name}</p>
                  <p className="font-mono text-xs text-ink/50">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="nb-badge-mint">Uploaded</div>
              </div>
            )}

            {preview && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex items-center gap-2 font-body text-xs font-600 text-ink/60 hover:text-ink transition-colors"
                >
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPreview ? 'Hide' : 'Show'} extracted text preview
                </button>
                {showPreview && (
                  <div className="p-4 bg-ink rounded-nb border-2.5 border-ink max-h-40 overflow-y-auto scrollbar-hide animate-slide-in-up">
                    <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap">{preview}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card padding="none" className="animate-slide-in-up">
          <div className="p-6">
            <CardHeader
              title="Configure generation"
              subtitle="Tell the AI what kind of questions to create"
            />
          </div>
          <CardDivider />
          <div className="p-6 flex flex-col gap-5">
            {file && (
              <div className="flex items-center gap-3 p-3 bg-cream rounded-nb border-2.5 border-ink">
                <FileText size={16} className="text-ink/50 shrink-0" />
                <span className="font-body text-sm font-600 text-ink truncate">{file.name}</span>
                <div className="ml-auto nb-badge-mint text-xs">Ready</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Number of questions"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                options={QUESTION_COUNTS}
              />
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                options={DIFFICULTIES}
              />
              <Select
                label="Question type"
                value={qtype}
                onChange={(e) => setQtype(e.target.value)}
                options={TYPES}
              />
            </div>

            <div className="p-4 bg-lavender/20 border-2.5 border-lavender rounded-nb flex items-start gap-3">
              <Brain size={18} className="text-ink shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <p className="font-body text-sm font-600 text-ink">AI will generate from your content</p>
                <p className="font-body text-xs text-ink/60">
                  Questions are strictly based on the uploaded file. No hallucinations — only content from your material.
                </p>
              </div>
            </div>

            <Button
              variant="volt"
              fullWidth
              size="lg"
              loading={generating}
              icon={<Brain size={18} />}
              onClick={handleGenerate}
            >
              {generating ? 'Generating questions...' : `Generate ${count} questions with AI`}
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-slide-in-up">
          {generatedQs.length > 0 && (
            <Card padding="none">
              <div className="p-5">
                <CardHeader
                  title={`${generatedQs.length} questions generated`}
                  subtitle="Review and accept the questions you want"
                  action={
                    <Button
                      variant="mint"
                      size="sm"
                      icon={<Check size={14} />}
                      onClick={handleAcceptAll}
                    >
                      Accept all
                    </Button>
                  }
                />
              </div>
              <CardDivider />
              <div className="p-4 flex flex-col gap-3">
                {generatedQs.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-1">
                      <QuestionCard question={q} index={i} onRemove={() => dispatch(clearGeneratedQs())} defaultOpen={i === 0} />
                    </div>
                    <Button
                      variant="mint"
                      size="sm"
                      icon={<Plus size={14} />}
                      onClick={() => handleAcceptOne(i)}
                      className="shrink-0 mt-1"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card padding="none">
            <div className="p-5">
              <CardHeader
                title={`Quiz questions (${questions.length})`}
                subtitle="These will appear in the final quiz"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Plus size={14} />}
                    onClick={() => notify.info('Manual question editor coming soon')}
                  >
                    Add manually
                  </Button>
                }
              />
            </div>
            <CardDivider />

            {questions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <p className="font-body text-sm text-ink/50">No questions added yet.</p>
                <p className="font-body text-xs text-ink/40">Accept generated questions above or add manually.</p>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-3">
                {questions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    index={i}
                    onRemove={(idx) => dispatch(removeQuestion(idx))}
                  />
                ))}
              </div>
            )}
          </Card>

          {questions.length > 0 && (
            <Button
              variant="volt"
              fullWidth
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => setStep(3)}
            >
              Configure and publish →
            </Button>
          )}
        </div>
      )}

      {step === 3 && quizCode ? (
        <Card padding="none" className="animate-slide-in-up">
          <div className="p-6 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-mint border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center">
              <Check size={28} className="text-ink" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-800 text-ink">Quiz published!</h2>
              <p className="font-body text-sm text-ink/60">Share the code with your students to start.</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-volt border-2.5 border-ink rounded-nb shadow-nb w-full justify-center">
              <span className="font-display text-4xl font-800 text-ink tracking-widest">{quizCode}</span>
              <button onClick={copyCode} className="p-2 bg-ink text-white rounded-nb hover:opacity-80 transition-opacity">
                <Copy size={16} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button variant="ink" fullWidth onClick={() => navigate('/dashboard/quizzes')}>
                View my quizzes
              </Button>
              <Button variant="ghost" fullWidth onClick={() => { setStep(0); setFile(null); setFileId(null); setPreview(''); setTitle(''); setQuizCode('') }}>
                Create another
              </Button>
            </div>
          </div>
        </Card>
      ) : step === 3 && (
        <Card padding="none" className="animate-slide-in-up">
          <div className="p-6">
            <CardHeader title="Publish quiz" subtitle="Final settings before going live" />
          </div>
          <CardDivider />
          <div className="p-6 flex flex-col gap-5">
            <Input
              label="Quiz title"
              placeholder="e.g. Chapter 5 — Photosynthesis Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Time limit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                options={TIME_LIMITS}
              />
              <Input
                label="Negative marking"
                type="number"
                placeholder="0"
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
                hint="Points deducted per wrong answer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-cream rounded-nb border-2.5 border-ink">
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-sm font-600 text-ink">Shuffle questions</span>
                <span className="font-body text-xs text-ink/50">Randomize order for each student</span>
              </div>
              <button
                onClick={() => setShuffle((v) => !v)}
                className={`w-12 h-6 rounded-full border-2.5 border-ink transition-colors relative ${shuffle ? 'bg-mint' : 'bg-white'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-ink rounded-full transition-all ${shuffle ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="p-4 bg-cream rounded-nb border-2.5 border-ink flex items-center justify-between">
              <span className="font-body text-sm font-600 text-ink">Questions in this quiz</span>
              <span className="font-display text-xl font-800 text-ink">{questions.length}</span>
            </div>
            <Button
              variant="volt"
              fullWidth
              size="lg"
              loading={loading}
              icon={<Zap size={18} />}
              onClick={handlePublish}
            >
              Publish quiz
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}