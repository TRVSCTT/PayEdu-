import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Info,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPaymentStatusTone, formatStatusLabel, formatMoney, getPlatformCurrencyLabel } from '../../utils/formatters'

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function buttonStyles({ variant = 'primary', size = 'md', block = false, className = '' } = {}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
    secondary: 'border border-primary/15 bg-white text-primary hover:bg-primary-light',
    subtle: 'bg-transparent text-text-secondary hover:bg-gray-100',
    danger: 'bg-danger text-white hover:bg-red-700 shadow-sm',
    ghost: 'border border-transparent bg-transparent text-text hover:bg-gray-100',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return cx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    block && 'w-full',
    className,
  )
}

export function cardStyles(className = '') {
  return cx('rounded-2xl border border-border bg-surface shadow-soft', className)
}

export function pageStyles(className = '') {
  return cx('min-h-screen bg-background text-text', className)
}

export function sectionTitleStyles(className = '') {
  return cx('text-sm font-semibold uppercase tracking-[0.18em] text-text-muted', className)
}

const BADGE_TONES = {
  neutral: 'border-border bg-gray-100 text-text-secondary',
  info: 'border-info/10 bg-info/10 text-info',
  success: 'border-success/10 bg-success/10 text-success',
  warning: 'border-warning/10 bg-warning/10 text-warning',
  danger: 'border-danger/10 bg-danger/10 text-danger',
  refund: 'border-refund/10 bg-refund/10 text-refund',
  primary: 'border-primary/10 bg-primary-light text-primary',
}

const STATUS_ICONS = {
  neutral: Info,
  info: CircleDollarSign,
  success: CheckCircle2,
  warning: Clock3,
  danger: XCircle,
  refund: RefreshCcw,
  primary: ShieldCheck,
}

export function StatusBadge({ status, tone, label, className = '' }) {
  const derivedTone = tone || getPaymentStatusTone(status)
  const Icon = STATUS_ICONS[derivedTone] || STATUS_ICONS.neutral
  const computedLabel = label || formatStatusLabel(status)

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
        BADGE_TONES[derivedTone] || BADGE_TONES.neutral,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {computedLabel}
    </span>
  )
}

export function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <div className={cx('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-3">
        {eyebrow ? <span className="app-chip">{eyebrow}</span> : null}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}

export function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={cx('flex items-end justify-between gap-4', className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, helper, tone = 'primary', className = '' }) {
  const tones = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary',
    accent: 'bg-accent-light text-accent',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    refund: 'bg-refund-light text-refund',
    info: 'bg-info-light text-info',
  }

  return (
    <article className={cardStyles(cx('p-5', className))}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className={cx('inline-flex h-11 w-11 items-center justify-center rounded-2xl', tones[tone] || tones.primary)}>
            {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
          </span>
          <div className="space-y-1">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-2xl font-semibold tracking-tight text-text">{value}</p>
            {helper ? <p className="text-xs text-text-muted">{helper}</p> : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export function Money({ value, currency, className = '' }) {
  return <span className={className}>{formatMoney(value, currency)}</span>
}

export function Stepper({ steps, currentStep, className = '' }) {
  return (
    <ol className={cx('grid gap-2 sm:grid-cols-3 lg:grid-cols-6', className)} aria-label="Progression du paiement">
      {steps.map((step, index) => {
        const active = index === currentStep
        const complete = index < currentStep
        const label = typeof step === 'string' ? step : step.label

        return (
          <li
            key={label}
            className={cx(
              'flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors',
              active ? 'border-primary bg-primary-light' : complete ? 'border-success/20 bg-success-light' : 'border-border bg-white',
            )}
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cx(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                complete ? 'bg-success text-white' : active ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary',
              )}
            >
              {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                Étape {index + 1}
              </span>
              <span className="block text-sm font-semibold text-text">{label}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={cardStyles(cx('flex flex-col items-center justify-center gap-4 px-6 py-10 text-center', className))}>
      {Icon ? (
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {description ? <p className="max-w-md text-sm leading-6 text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function LoadingScreen({ title = 'Chargement en cours', description = 'Veuillez patienter quelques instants.' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className={cardStyles('w-full max-w-sm px-6 py-8 text-center')}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <CircleDollarSign className="h-7 w-7 animate-pulse" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}

export function BrandLink({ to = '/', className = '' }) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/20 hover:bg-primary-light',
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        <CircleDollarSign className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="tracking-[0.16em]">ETUTRANSFERT</span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}
