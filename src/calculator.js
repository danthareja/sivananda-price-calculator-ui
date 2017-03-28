import _ from 'lodash'

import moment from './lib/moment'
import { getSeasonByDate } from './data/seasons'
import { addVAT, getYVPRate, getRoomRate, applyDiscount } from './data/rates'

const EMPTY_RATES = {
  withoutVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  withVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  dailyRoomYVPRate: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 },
  perGuestWithVAT: { perDay: [], room: 0, yvp: 0, course: 0, total: 0 }
}

export default function calculator({ guests = 1, children = 0, stays = [], courses = [], discount }) {
  const checkInDate = _.first(stays).checkInDate
  const checkOutDate = _.last(stays).checkOutDate

  if (!moment.isMoment(checkInDate) || !moment.isMoment(checkOutDate)) {
    return EMPTY_RATES
  }

  // IMPORTANT ASSUMPTION: stays are one continuous range
  const daysThatMustBePaidFor = Array.from(moment.range(
    checkInDate.clone(),
    checkOutDate.clone().subtract(1, 'days')
  ).by('days'))

  var dailyRoomYVP = _.map(daysThatMustBePaidFor, date => getDailyRoomYvpRate(date, guests, children, stays, courses))
  var room = _.sumBy(dailyRoomYVP, 'room')
  var yvp = _.sumBy(dailyRoomYVP, 'yvp')
  var course = _.sumBy(courses, course => applyDiscount(course.tuition, course.discount))
  var subtotal = _.sum([room, yvp, course])
  var total = applyDiscount(subtotal, discount)
  var discount = subtotal - total

  return {dailyRoomYVP, room, yvp, course, subtotal, total, discount} 
}

function getDailyRoomYvpRate(date, guests, children, stays, courses) {
  const nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')
  const season = getSeasonByDate(date)

  const theStayForThisDate = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days') //The night of the checkout date is not paid for.
    )
  ))

  if (!_.isObject(theStayForThisDate)) {
    throw new Error(`No stay found for ${date.format('YYYY-MM-DD')}. Are stays continuous?`)
  }

  var isDuringCourse = _.some(courses, course => date.within(
    moment.range(
      course.startDate.clone().subtract(1, 'days'),// YVP is not included duing the course and one night before
      course.endDate.clone()
    )
  ))
 
  var isAloneInRoom = guests === 1;
  var roomRate = getRoomRate(theStayForThisDate.roomId, season, isAloneInRoom, nights) * (guests + children/2);
  var yvpRate = getYVPRate(season) * guests;
  return {
    date: date,
    room: applyDiscount(roomRate, theStayForThisDate.roomDiscount),
    yvp: isDuringCourse ? 0 : applyDiscount(yvpRate, theStayForThisDate.yvpDiscount)
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
