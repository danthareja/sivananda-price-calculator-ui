import _ from 'lodash'

import moment from './lib/moment'
import { getSeasonByDate } from './data/seasons'
import { addVAT, getYVPRate, getRoomRate } from './data/rates'

const EMPTY_RESULT = {
  rates: {
    perGuest: {
      perDay: [],
      room: 0,
      yvp: 0,
      course: 0,
      total: 0
    },
    perDay: [],
    room: 0,
    yvp: 0,
    course: 0,
    total: 0
  },
  ratesWithVAT: {
    perGuest: {
      perDay: [],
      room: 0,
      yvp: 0,
      course: 0,
      total: 0
    },
    perDay: [],
    room: 0,
    yvp: 0,
    course: 0,
    total: 0
  }
}

export default function calculator({ guests = 1, stays = [], courses = [] }) {
  const checkInDate = _.first(stays).checkInDate
  const checkOutDate = _.last(stays).checkOutDate

  if (!moment.isMoment(checkInDate) || !moment.isMoment(checkOutDate)) {
    return EMPTY_RESULT
  }

  // TODO: Validate that dates of stay are one continuous range
  const datesThatMustBePaidFor = moment.range(
    checkInDate.clone(),
    checkOutDate.clone().subtract(1, 'days')
  )

  const perGuest = {
    perDay: _.map(Array.from(datesThatMustBePaidFor.by('days'), date => ({
      date: date,
      room: getDailyRoomRate(date, stays, guests),
      yvp: getDailyYVPRate(date, courses)
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

function getDailyRoomRate(date, stays, guests) {
  var nights =  _.last(stays).checkOutDate.diff(_.first(stays).checkInDate, 'days')
  var season = getSeasonByDate(date)

  var stay = _.find(stays, stay => date.within(
    moment.range(
      stay.checkInDate.clone(),
      stay.checkOutDate.clone().subtract(1, 'days')
    )
  ))

  if (!_.isObject(stay)) { throw new Error('No stay found.') }

  return getRoomRate(stay.roomId, season, guests, nights)
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


