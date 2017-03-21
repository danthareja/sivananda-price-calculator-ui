import _ from 'lodash'
import moment from '../lib/moment'
import { SEASON } from './constants'

// ** Add new seasons here.

// type: one of the seasons defined in ./constants
// startDate: inclsive moment of season's start date
// endDate: inclusive moment of season's end date
// NOTE: seasons can be included in any order, but should never overlap

const seasons = [
  {
    type: SEASON.WINTER,
    startDate: moment('2016-11-20'),
    endDate: moment('2017-06-30')
  },
  {
    type: SEASON.SUMMER,
    startDate: moment('2016-07-01'),
    endDate: moment('2017-10-31')
  }
]

// TODO: Validate season ranges

export function getSeasonByDate (date) {
  if (!moment.isMoment(date)) {
    date = moment(date)
  }

  const season = _.find(seasons, ({ startDate, endDate }) =>
    date.within(moment.range(startDate, endDate))
  )

  if (!season) {
    throw new Error(`Could not find season for date: ${date.format('YYYY-MM-DD')}`)
  }

  return season.type
}
