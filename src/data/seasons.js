import _ from 'lodash'
import moment from '../lib/moment'
import { SEASON } from './constants'

// ** Add new seasons here.

// type: one of the seasons defined in ./constants
// startDate: inclsive moment of season's start date
// endDate: inclusive moment of season's end date
// NOTE: seasons should be listed in chronologcal order from oldest to newest.
//       seasons[n].startDate should be the day after seasons[n-1].endDate

const seasons = [
  {
    type: SEASON.WINTER,
    startDate: createMoment('2016-11-20'),
    endDate: createMoment('2017-06-30')
  },
  {
    type: SEASON.SUMMER,
    startDate: createMoment('2017-07-01'),
    endDate: createMoment('2017-10-31')
  }
]

const range = createRange(seasons)

function createMoment(date) {
  // react-dates uses this format, yay consistency
  return moment(date).startOf('day').hour(12)
}

function createRange(seasons) {
  // validate adjacency
  _.each(seasons, (season, i, seasons) => {
    let nextSeason = seasons[i + 1]
    if (_.isUndefined(nextSeason)) { return }

    let daysBetweenSeasons = nextSeason.startDate.diff(season.endDate, 'days')
    if (daysBetweenSeasons > 1) {
      throw new Error(`Expected seasons to be days between seasons to equal 1. There are ${daysBetweenSeasons} days between seasons[${i}] and seasons[${i + 1}]`)
    }
  })

  return moment.range(
    _.first(seasons).startDate,
    _.last(seasons).endDate
  )
}


export function isWithinSeasonRange (date) {
  return date.within(range)
}

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
