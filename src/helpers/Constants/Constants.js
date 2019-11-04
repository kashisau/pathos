export const MONTH_NAMES = 'January February March April May June July August September October November December'.split(' ')

export const getMonth = (index, offset = 0) => {
  const monthIndex = index + offset
  const monthsCount = MONTH_NAMES.length
  const monthsModulo = ((monthIndex%monthsCount)+monthsCount)%monthsCount
  return MONTH_NAMES[monthsModulo]
}

export const MOOD_POSITIVES = [
  "Colleagues within the PO",
  "Assignment progress",
  "Social activities outside work",
  "Establishing a routine",
  "Time off work",
  "Holidays / travel",
  "Other"
]

export const MOOD_NEGATIVES = [
  "Too much work",
  "Too little work",
  "Progress (or lack thereof)",
  "Isolation",
  "Colleagues within the PO",
  "Unrealistic assignment goals",
  "Other"
]