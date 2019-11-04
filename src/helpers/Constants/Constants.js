export const MONTH_NAMES = 'January February March April May June July August September October November December'.split(' ')

export const getMonth = (index, offset = 0) => {
  const monthIndex = index + offset
  const monthsCount = MONTH_NAMES.length
  const monthsModulo = ((monthIndex%monthsCount)+monthsCount)%monthsCount
  return MONTH_NAMES[monthsModulo]
}