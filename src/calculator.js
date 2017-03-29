import _ from 'lodash'

import moment from './lib/moment'
import { getSeasonByDate } from './data/seasons'
import { getYVPRate, getRoomRate, applyDiscount, calculateDiscount } from './data/rates'

const EMPTY_RATES = {
  dailyRoomYVP: [],
  room: 0,
  yvp: 0,
  course: 0,
  subtotal: 0,
  discount: 0,
  total: 0
}

export default function calculator({ adults = 0, children = 0, stays = [], courses = [], grossDiscount }) {
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

  var dailyRoomYVP = _.map(daysThatMustBePaidFor, date => getDailyRoomYVPRate(date, adults, children, stays, courses))
  var room = _.sumBy(dailyRoomYVP, 'room')
  var yvp = _.sumBy(dailyRoomYVP, 'yvp')
  var course = _.sumBy(courses, course => applyDiscount(course.tuition, course.discount))
  var subtotal = _.sum([room, yvp, course])
  var discount = calculateDiscount(subtotal, grossDiscount)
  var total = subtotal - discount

  return { dailyRoomYVP, room, yvp, course, subtotal, total, discount } 
}

function getDailyRoomYVPRate(date, adults, children, stays, courses) {
  const nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')
  const season = getSeasonByDate(date)

  const theStayForThisDate = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days') // The night of the checkout date is not paid for
    )
  ))

  if (!_.isObject(theStayForThisDate)) {
    throw new Error(`No stay found for ${date.format('YYYY-MM-DD')}. Are stays continuous?`)
  }

  var isDuringCourse = _.some(courses, course => date.within(
    moment.range(
      course.startDate.clone().subtract(1, 'days'), // YVP is not included duing the course and one night before
      course.endDate.clone()
    )
  ))
 
  var isAloneInRoom = adults === 1; // Children do not affect the "single occupancy" or "double occupancy" base rate

  var roomRate = getRoomRate(theStayForThisDate.roomId, season, isAloneInRoom, nights) * (adults + children / 2);
  var yvpRate = isDuringCourse ? 0 : getYVPRate(season) * adults;

  return {
    date: date,
    room: applyDiscount(roomRate, theStayForThisDate.roomDiscount),
    yvp: applyDiscount(yvpRate, theStayForThisDate.yvpDiscount)
  }
}