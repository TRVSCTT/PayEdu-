import { PLATFORM_CONFIG } from '../config/platform'

const DATE_LOCALE = 'fr-FR'

function normalizeString(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ')
    .trim()
}

export function getPlatformCurrency() {
  return PLATFORM_CONFIG.currencyCode || ''
}

export function getPlatformCurrencyLabel() {
  return PLATFORM_CONFIG.currencyLabel || PLATFORM_CONFIG.currencyCode || 'Devise configurée'
}

export function formatMoney(value, currency = getPlatformCurrency()) {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) {
    return '0'
  }

  const normalizedCurrency = String(currency || '').trim()

  if (!normalizedCurrency) {
    return new Intl.NumberFormat(DATE_LOCALE).format(amount)
  }

  try {
    return new Intl.NumberFormat(DATE_LOCALE, {
      style: 'currency',
      currency: normalizedCurrency,
      currencyDisplay: 'code',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${new Intl.NumberFormat(DATE_LOCALE).format(amount)} ${normalizedCurrency}`
  }
}

export function formatDate(date, options = {}) {
  if (!date) {
    return '—'
  }

  try {
    return new Intl.DateTimeFormat(DATE_LOCALE, options).format(new Date(date))
  } catch {
    return String(date)
  }
}

export function formatDateTime(date) {
  return formatDate(date, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function maskReference(value, { visibleStart = 3, visibleEnd = 3, mask = '•' } = {}) {
  const text = String(value ?? '')
  if (text.length <= visibleStart + visibleEnd) {
    return text
  }

  return `${text.slice(0, visibleStart)}${mask.repeat(Math.max(text.length - visibleStart - visibleEnd, 4))}${text.slice(-visibleEnd)}`
}

export function formatStatusLabel(status) {
  const normalized = normalizeString(status)

  const mapping = [
    { match: ['initie', 'initiated', 'en cours', 'started'], label: 'Paiement initié' },
    { match: ['attente', 'pending', 'en attente'], label: 'Paiement en attente' },
    { match: ['confirme', 'confirmed', 'acquittee', 'acquitte', 'valide'], label: 'Paiement confirmé' },
    { match: ['echoue', 'failed', 'refuse', 'rejected', 'error'], label: 'Paiement échoué' },
    { match: ['expire', 'expired'], label: 'Paiement expiré' },
    { match: ['annule', 'cancelled', 'canceled'], label: 'Paiement annulé' },
    { match: ['rembourse', 'refunded'], label: 'Paiement remboursé' },
  ]

  for (const entry of mapping) {
    if (entry.match.some((match) => normalized.includes(match))) {
      return entry.label
    }
  }

  return status ? String(status) : 'Statut inconnu'
}

export function getPaymentStatusTone(status) {
  const normalized = normalizeString(status)

  if (normalized.includes('rembourse')) return 'refund'
  if (normalized.includes('confirme') || normalized.includes('acquittee') || normalized.includes('valide')) return 'success'
  if (normalized.includes('attente') || normalized.includes('pending')) return 'warning'
  if (normalized.includes('echoue') || normalized.includes('failed') || normalized.includes('refuse') || normalized.includes('rejected') || normalized.includes('error')) return 'danger'
  if (normalized.includes('expire')) return 'neutral'
  if (normalized.includes('annule') || normalized.includes('cancel')) return 'neutral'
  if (normalized.includes('initie') || normalized.includes('started')) return 'info'

  return 'neutral'
}
