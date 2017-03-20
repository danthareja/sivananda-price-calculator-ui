import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import roomData from './data/rooms'
import { YVP, VAT } from './data/constants'

const moment = extendMoment(Moment)

export default function calculator({ guests = 1, season = 'winter', stays = [], courses = [] }) {
  // ASSUMPTION: Dates of stays are one continous range
  const datesThatMustBePaidFor = moment.range(
    _.first(stays).checkInDate.clone(),
    _.last(stays).checkOutDate.clone().subtract(1, 'days')
  )

  const perGuest = {
    perDay: _.map(Array.from(datesThatMustBePaidFor.by('days'), date => ({
      date: date,
      room: calculateDailyRoomRate(date, stays, season, guests),
      yvp: calculateDailyYVPRate(date, courses)
    })))
  }
  perGuest.room = _.sumBy(perGuest.perDay, 'room')
  perGuest.yvp = _.sumBy(perGuest.perDay, 'yvp')
  perGuest.course = _.sumBy(courses, 'tuition')
  perGuest.total = _.sum([perGuest.room, perGuest.yvp, perGuest.course])

  const rates = {
    perGuest: perGuest,
    perDay: perGuest.perDay.map(day => ({
      date: day.date,
      room: day.room * guests,
      yvp: day.yvp * guests
    })),
    room: perGuest.room * guests,
    yvp: perGuest.yvp * guests,
    course: perGuest.course * guests,
    total: perGuest.total * guests
  }

  const ratesWithVAT =  _.cloneDeepWith(rates, value => {
    if (moment.isMoment(value)) {
      return value.clone()
    }
    if (_.isNumber(value)) {
      return addVAT(value)
    }
  })

  return { rates, ratesWithVAT } 
}

function calculateDailyRoomRate(date, stays, season, guests) {
  var rateIndex
  
  // Daily rates differ based on the total number of nights stayed
  var nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')

  if (nights >= 21) { rateIndex = 3 }
  if (nights < 21) { rateIndex = 2 }
  if (nights < 14) { rateIndex = 1 }
  if (nights < 7) { rateIndex = 0 }

  if (!_.isNumber(rateIndex)) { throw new Error('No rateIndex found.') }

  var stay = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days')
    )
  ))

  if (!_.isObject(stay)) { throw new Error('No stay found.') }
  

  return _.find(roomData, _.matchesProperty('id', stay.roomId)).baseRateByOccupancy[season][guests][rateIndex]
}

function calculateDailyYVPRate(date, courses) {
  // YVP is not included duing the course and one night before
  var isDuringCourse = _.some(courses, course => date.within(
    moment.range(
      course.startDate.clone().subtract(1, 'days'),
      course.endDate.clone()
    )
  ))

  return isDuringCourse ? 0 : YVP
}

function addVAT (price) {
  if (!_.isNumber(price)) {
    return price
  }
  return price + (price * VAT)
}

