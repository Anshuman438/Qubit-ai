import { useNavigate } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { slugify } from '@/utils/helpers'
import {
  Zap,
  Upload,
  Brain,
  Play,
  BarChart3,
  Shield,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload Any File',
    description: 'PDF, DOCX, or plain text. Our parser extracts content from any document instantly.',
    accent: 'bg-volt',
  },
  {
    icon: Brain,
    title: 'AI Generates Questions',
    description: 'GPT-4o reads your content and creates MCQ, True/False, and short answer questions in seconds.',
    accent: 'bg-lavender',
  },
  {
    icon: Play,
    title: 'Go Live Instantly',
    description: 'Share a 6-character code or QR. Students join from any device, no app, no account needed.',
    accent: 'bg-mint',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Watch scores come in live. Export leaderboards and detailed reports with one click.',
    accent: 'bg-sky',
  },
  {
    icon: Shield,
    title: 'Built-in Anti-cheat',
    description: 'Tab switch detection, fullscreen enforcement, and copy-paste blocking, no extensions required.',
    accent: 'bg-peach',
  },
  {
    icon: Clock,
    title: 'Under 60 Seconds',
    description: 'From file upload to live quiz in under a minute. The fastest quiz creation on the market.',
    accent: 'bg-rose',
  },
]

const STEPS = [
  { step: '01', title: 'Upload your material', description: 'Drop a PDF, Word doc, or paste text directly.' },
  { step: '02', title: 'AI writes the questions', description: 'Choose count, difficulty, and question type. Done in seconds.' },
  { step: '03', title: 'Review and publish', description: 'Edit questions if needed, then hit publish to go live.' },
  { step: '04', title: 'Share the code', description: 'Students join with a 6-char code or scan the QR, no login needed.' },
  { step: '05', title: 'Watch results live', description: 'See scores, flag cheaters, and export reports instantly.' },
]

const STATS = [
  { value: '60s', label: 'Average quiz creation time' },
  { value: '99%', label: 'AI question accuracy' },
  { value: '0',   label: 'Extensions required' },
  { value: 'Unlimited', label: 'Students per quiz' },
]

const FOOTER_LINKS = ['Features', 'How it works', 'Founders']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="nb-page">
      <PublicNavbar />

      <section className="nb-container py-20 md:py-28">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <div className="nb-badge-ink inline-flex items-center gap-2 animate-slide-in-up">
            <Zap size={12} className="text-volt" />
            <span>AI-powered quiz generation</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-800 text-ink leading-none text-balance animate-slide-in-up">
            Turn any file into a brilliant quiz, instantly
          </h1>

          <p className="font-body text-lg md:text-xl text-ink/60 max-w-2xl text-balance animate-slide-in-up">
            Upload a PDF or Word doc. Our AI reads it and generates perfectly structured questions in seconds. Share with students via a code or QR. No setup, no extensions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 animate-slide-in-up">
            <Button
              variant="volt"
              size="lg"
              icon={<Zap size={18} />}
              onClick={() => navigate('/register')}
            >
              Start for free
            </Button>
            <Button
              variant="white"
              size="lg"
              icon={<Play size={18} />}
              onClick={() => navigate('/join')}
            >
              Join a quiz
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-body text-sm text-ink/50 animate-slide-in-up">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-mint" />
              No credit card required
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-mint" />
              Free to get started
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-mint" />
              No extensions needed
            </span>
          </div>
        </div>

        <div className="mt-16 nb-card p-6 md:p-8 max-w-3xl mx-auto animate-slide-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose border border-ink" />
            <div className="w-3 h-3 rounded-full bg-volt border border-ink" />
            <div className="w-3 h-3 rounded-full bg-mint border border-ink" />
            <span className="font-mono text-xs text-ink/40 ml-2">qubit.ai/dashboard/create</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-4 bg-cream rounded-nb border-2.5 border-ink">
              <div className="w-10 h-10 bg-volt border-2.5 border-ink rounded-nb flex items-center justify-center shrink-0 shadow-nb-sm">
                <FileText size={18} className="text-ink" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-body text-sm font-600">chapter-5-photosynthesis.pdf</span>
                <span className="font-mono text-xs text-ink/50">2.4 MB, Uploaded</span>
              </div>
              <div className="ml-auto nb-badge-mint text-xs">Ready</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Questions', value: '10' },
                { label: 'Type', value: 'MCQ' },
                { label: 'Difficulty', value: 'Medium' },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-white rounded-nb border-2.5 border-ink text-center">
                  <p className="font-display text-lg font-800 text-ink">{item.value}</p>
                  <p className="font-body text-xs text-ink/50">{item.label}</p>
                </div>
              ))}
            </div>
            <Button variant="volt" fullWidth icon={<Brain size={16} />}>
              Generate questions with AI
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16" id="stats">
        <div className="nb-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-2">
                <span className="font-display text-5xl font-800 text-volt">{item.value}</span>
                <span className="font-body text-sm text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nb-section" id="features">
        <div className="nb-container">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <div className="nb-badge-volt">Features</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 text-ink">
              Everything you need
            </h2>
            <p className="font-body text-lg text-ink/60 max-w-xl">
              Built for teachers who value their time and students who deserve a fair assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="nb-card p-6 flex flex-col gap-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-nb-lg transition-all duration-150"
                >
                  <div className={feature.accent + ' w-11 h-11 border-2.5 border-ink rounded-nb shadow-nb-sm flex items-center justify-center'}>
                    <Icon size={20} className="text-ink" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-lg font-800 text-ink">{feature.title}</h3>
                    <p className="font-body text-sm text-ink/60 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="nb-section bg-cream border-y-2.5 border-ink" id="how-it-works">
        <div className="nb-container">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <div className="nb-badge-lavender">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 text-ink">
              Five steps, under a minute
            </h2>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {STEPS.map((item, index) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-12 h-12 bg-volt border-2.5 border-ink rounded-nb shadow-nb flex items-center justify-center">
                    <span className="font-mono text-sm font-700 text-ink">{item.step}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-0.5 h-8 bg-ink/20" />
                  )}
                </div>
                <div className="nb-card p-4 flex-1 flex flex-col gap-1 mb-4">
                  <h3 className="font-display text-base font-800 text-ink">{item.title}</h3>
                  <p className="font-body text-sm text-ink/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nb-section">
        <div className="nb-container">
          <div className="nb-card-volt p-10 md:p-16 flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={20} className="text-ink fill-ink" />
              ))}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-800 text-ink max-w-xl text-balance">
              Ready to create your first quiz?
            </h2>
            <p className="font-body text-lg text-ink/70 max-w-lg">
              Join teachers who are saving hours every week with AI-powered quiz creation.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="ink"
                size="lg"
                icon={<Zap size={18} />}
                onClick={() => navigate('/register')}
              >
                Get started free
              </Button>
              <Button
                variant="white"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                onClick={() => navigate('/founders')}
              >
                Meet the team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-ink border-t-2.5 border-white/10">
        <div className="nb-container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-volt border-2.5 border-white rounded-nb flex items-center justify-center">
                <Zap size={14} className="text-ink" />
              </div>
              <span className="font-display text-lg font-800 text-white">Qubit AI</span>
            </div>

            <div className="flex items-center gap-6">
              {FOOTER_LINKS.map((link) => {
                const isInternal = link === 'Founders'
                const slug = slugify(link)
                const href = isInternal ? '/founders' : '#' + slug
             return (
  <a
    key={link}
    href={href}
    className="font-body text-sm text-white/50 hover:text-white transition-colors"
  >
    {link}
  </a>
)
              })}
            </div>

            <p className="font-body text-sm text-white/30">
              Qubit AI. Built with care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}