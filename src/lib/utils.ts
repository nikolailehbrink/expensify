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

export function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  )
}
