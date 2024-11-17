export function formatCentsToEuro(cents: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
  }).format(date)
}
