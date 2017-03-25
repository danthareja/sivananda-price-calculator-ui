import _ from 'lodash'

import moment from './lib/moment'
import { getSeasonByDate } from './data/seasons'
import { addVAT, getYVPRate, getRoomRate, addDiscount } from './data/rates'

const EMPTY_RATES = {
  withoutVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  withVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  perGuestWithoutVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  perGuestWithVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 }
}

export default function calculator({ guests = 1, stays = [], courses = [] }) {
  const checkInDate = _.first(stays).checkInDate
  const checkOutDate = _.last(stays).checkOutDate

  if (!moment.isMoment(checkInDate) || !moment.isMoment(checkOutDate)) {
    return EMPTY_RATES
  }

  // TODO: Validate that dates of stay are one continuous range
  const daysThatMustBePaidFor = Array.from(moment.range(
    checkInDate.clone(),
    checkOutDate.clone().subtract(1, 'days')
  ).by('days'))

  const perGuestWithoutVAT = {}
  perGuestWithoutVAT.perDay = _.map(daysThatMustBePaidFor, date => ({
    date: date,
    room: getDailyRoomRate(date, stays, guests),
    yvp: getDailyYVPRate(date, courses)
  }))
  perGuestWithoutVAT.room = _.sumBy(perGuestWithoutVAT.perDay, 'room')
  perGuestWithoutVAT.yvp = _.sumBy(perGuestWithoutVAT.perDay, 'yvp')
  perGuestWithoutVAT.course = _.sumBy(courses, course => addDiscount(course.tuition, course.discount))
  perGuestWithoutVAT.total = _.sum([perGuestWithoutVAT.room, perGuestWithoutVAT.yvp, perGuestWithoutVAT.course])

  const perGuestWithVAT = modifyRates(perGuestWithoutVAT, addVAT)
  const withoutVAT = modifyRates(perGuestWithoutVAT, rate => rate * guests)
  const withVAT = modifyRates(withoutVAT, addVAT)

  return { withVAT, withoutVAT, perGuestWithVAT, perGuestWithoutVAT } 
}

function getDailyRoomRate(date, stays, guests) {
  var season = getSeasonByDate(date)
  var nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')
  var stay = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days')
    )
  ))

  if (!_.isObject(stay)) { throw new Error('No stay found. Is the stay range continuous?') }

  return addDiscount(getRoomRate(stay.roomId, season, guests, nights), stay.discount)
}

function getDailyYVPRate(date, courses) {
  var season = getSeasonByDate(date)

  // YVP is not included duing the course and one night before
  var isDuringCourse = _.some(courses, course => date.within(
    moment.range(
      course.startDate.clone().subtract(1, 'days'),
      course.endDate.clone()
    )
  ))

  return isDuringCourse ? 0 : getYVPRate(season)
}

function modifyRates(rates, modifier) {
  return _.cloneDeepWith(rates, value => {
    if (moment.isMoment(value)) {
      return value.clone()
    }
    if (_.isNumber(value)) {
      return modifier(value)
    }
  })
}

