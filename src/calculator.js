import _ from 'lodash'

import moment from './lib/moment'
import { getSeasonByDate } from './data/seasons'
import { addVAT, getYVPRate, getRoomRate, applyDiscount } from './data/rates'

const EMPTY_RATES = {
  withoutVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  withVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  perGuestWithoutVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  perGuestWithVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 }
}

export default function calculator({ guests = 1, stays = [], courses = [], discount }) {
  const checkInDate = _.first(stays).checkInDate
  const checkOutDate = _.last(stays).checkOutDate

  if (!moment.isMoment(checkInDate) || !moment.isMoment(checkOutDate)) {
    return EMPTY_RATES
  }

 // BAD ASSUMPTION: stays are one continuous range
  const daysThatMustBePaidFor = Array.from(moment.range(
    checkInDate.clone(),
    checkOutDate.clone().subtract(1, 'days')
  ).by('days'))


  const perGuestWithoutVAT = {}
  perGuestWithoutVAT.perDay = _.map(daysThatMustBePaidFor, date => getDailyStayRate(date, guests, stays, courses))
  perGuestWithoutVAT.room = _.sumBy(perGuestWithoutVAT.perDay, 'room')
  perGuestWithoutVAT.yvp = _.sumBy(perGuestWithoutVAT.perDay, 'yvp')
  perGuestWithoutVAT.course = _.sumBy(courses, course => applyDiscount(course.tuition, course.discount))
  perGuestWithoutVAT.subtotal = _.sum([perGuestWithoutVAT.room, perGuestWithoutVAT.yvp, perGuestWithoutVAT.course])
  perGuestWithoutVAT.total = applyDiscount(perGuestWithoutVAT.subtotal, discount)
  perGuestWithoutVAT.discount = perGuestWithoutVAT.subtotal - perGuestWithoutVAT.total

  const perGuestWithVAT = modifyRates(perGuestWithoutVAT, addVAT)
  const withoutVAT = modifyRates(perGuestWithoutVAT, rate => rate * guests)
  const withVAT = modifyRates(withoutVAT, addVAT)

  return { withVAT, withoutVAT, perGuestWithVAT, perGuestWithoutVAT } 
}

function getDailyStayRate(date, guests, stays, courses) {
  const nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')
  const season = getSeasonByDate(date)

  const stay = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days')
    )
  ))

  if (!_.isObject(stay)) {
    throw new Error(`No stay found for ${date.format('YYYY-MM-DD')}. Are stays continuous?`)
  }

  // YVP is not included duing the course and one night before
  var isDuringCourse = _.some(courses, course => date.within(
    moment.range(
      course.startDate.clone().subtract(1, 'days'),
      course.endDate.clone()
    )
  ))

  return {
    date: date,
    room: applyDiscount(getRoomRate(stay.roomId, season, guests, nights), stay.roomDiscount),
    yvp: isDuringCourse ? 0 : applyDiscount(getYVPRate(season), stay.yvpDiscount)
  }
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

