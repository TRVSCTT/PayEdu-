export const PLATFORM_CONFIG = {
  name: import.meta.env.VITE_PLATFORM_NAME ?? 'ETUTRANSFERT',
  currencyCode: import.meta.env.VITE_PLATFORM_CURRENCY ?? 'XAF',
  currencyLabel: import.meta.env.VITE_PLATFORM_CURRENCY_LABEL ?? '',
}
