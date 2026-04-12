import { Search, BookOpen, Users, Zap, Star, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { StatCard, CardHeader, CardDivider } from '@/components/ui/Card'
import Input, { Select, OTPInput, Textarea } from '@/components/ui/Input'

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-col gap-12">

      <div>
        <h1 className="font-display text-4xl font-800 mb-2">Qubit AI</h1>
        <p className="font-body text-ink/60">Design system visual check</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="volt">Primary CTA</Button>
          <Button variant="ink">Dark</Button>
          <Button variant="white">White</Button>
          <Button variant="mint">Success</Button>
          <Button variant="rose">Danger</Button>
          <Button variant="sky">Info</Button>
          <Button variant="lavender">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="volt" size="sm">Small</Button>
          <Button variant="volt" size="md">Medium</Button>
          <Button variant="volt" size="lg">Large</Button>
          <Button variant="ink" loading>Loading</Button>
          <Button variant="volt" icon={<Zap size={16} />}>With Icon</Button>
          <Button variant="ink" icon={<Star size={16} />} iconPosition="right">Icon Right</Button>
          <Button variant="volt" disabled>Disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Stat Cards</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Quizzes" value="24" delta={12} deltaLabel="vs last month" icon={<BookOpen size={16} />} accent="volt" />
          <StatCard label="Total Students" value="1,284" delta={8} deltaLabel="vs last month" icon={<Users size={16} />} accent="sky" />
          <StatCard label="Avg Score" value="74%" delta={-3} deltaLabel="vs last month" icon={<TrendingUp size={16} />} accent="lavender" />
          <StatCard label="Live Now" value="3" icon={<Zap size={16} />} accent="mint" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="white">
            <CardHeader title="White Card" subtitle="Standard card variant" />
            <CardDivider />
            <p className="font-body text-sm text-ink/60 mt-2">Card body content goes here.</p>
          </Card>
          <Card variant="volt">
            <CardHeader title="Volt Card" subtitle="Primary highlight" />
            <CardDivider />
            <p className="font-body text-sm text-ink/60 mt-2">Used for featured content.</p>
          </Card>
          <Card variant="lavender" hover>
            <CardHeader title="Hoverable Card" subtitle="Click me" />
            <CardDivider />
            <p className="font-body text-sm text-ink/60 mt-2">Hover to see press effect.</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Email Address" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="Enter password" />
          <Input label="Search" placeholder="Search quizzes..." icon={<Search size={16} />} iconPosition="left" />
          <Input label="With Error" value="bad@" error="Enter a valid email address" />
          <Input label="With Success" value="valid@email.com" success="Email looks good!" />
          <Select
            label="Difficulty"
            placeholder="Select difficulty"
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
          <Textarea label="Notes" placeholder="Write something..." hint="Max 500 characters" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">OTP Input</h2>
        <OTPInput length={6} value="" onChange={() => {}} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Typography</h2>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-5xl font-800">Display — Syne 800</h1>
          <h2 className="font-display text-3xl font-700">Heading — Syne 700</h2>
          <p className="font-body text-base">Body text — DM Sans 400. The quick brown fox jumps over the lazy dog.</p>
          <p className="font-body text-sm text-ink/60">Secondary text — DM Sans 400 muted.</p>
          <code className="font-mono text-sm bg-ink text-volt px-3 py-1.5 rounded-nb border-2.5 border-ink inline-block">
            const qubit = 'AI-powered quiz';
          </code>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Live Indicator + Progress</h2>
        <div className="flex items-center gap-3">
          <span className="nb-live-dot" />
          <span className="font-body text-sm font-600">3 students active</span>
        </div>
        <div className="max-w-sm flex flex-col gap-2">
          <div className="nb-progress">
            <div className="nb-progress-bar" style={{ width: '65%' }} />
          </div>
          <span className="font-mono text-xs text-ink/50">65% complete</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-800">Color Palette</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'ink',      bg: 'bg-ink',      text: 'text-white' },
            { name: 'cream',    bg: 'bg-cream',    text: 'text-ink' },
            { name: 'volt',     bg: 'bg-volt',     text: 'text-ink' },
            { name: 'lavender', bg: 'bg-lavender', text: 'text-ink' },
            { name: 'mint',     bg: 'bg-mint',     text: 'text-ink' },
            { name: 'peach',    bg: 'bg-peach',    text: 'text-ink' },
            { name: 'rose',     bg: 'bg-rose',     text: 'text-ink' },
            { name: 'sky',      bg: 'bg-sky',      text: 'text-ink' },
          ].map(({ name, bg, text }) => (
            <div
              key={name}
              className={`${bg} ${text} border-2.5 border-ink shadow-nb px-4 py-3 rounded-nb font-mono text-sm font-500`}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}