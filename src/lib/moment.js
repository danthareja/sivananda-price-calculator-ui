// A common module to consistently import the extended version of 'moment'
import moment from 'moment'
import { extendMoment } from 'moment-range'

export default extendMoment(moment)
export function createMoment(date = moment()) {
  if (!moment.isMoment(date)) {
    date = moment(date, 'YYYY-MM-DD')
  }
  return date.startOf('day').hour(12)
}