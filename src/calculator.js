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

export class Course {
  constructor({ startDate, endDate, tuition, discount = {} }) {
    this._startDate = startDate
    this._endDate = endDate
    this.tuition = tuition
    this.discount = discount
  }

  endDate() {
    return this._endDate.clone()
  }

  startDate() {
    return this._startDate.clone()
  }

  // YVP is not included duing the duration of the course and one night before
  doesYVPApply(date) {
    return date.within(moment.range(this.startDate().subtract(1, 'days'), this.endDate()))
  }

  calculateDiscount() {
    if (this.discount.type === 'percent') {
      return this.tuition * ( this.discount.value / 100 )
    }
    if (this.discount.type === 'fixed') {
      return this.discount.value
    }
    return 0
  }

  howMuch() {
    return this.tuition - this.calculateDiscount()
  }
}

export class RoomStay {
  constructor({ roomId, checkInDate, checkOutDate, roomDiscount, yvpDiscount }) {
    this.roomId = roomId
    this._checkInDate = checkInDate
    this._checkOutDate = checkOutDate
    this.roomDiscount = roomDiscount
    this.yvpDiscount = yvpDiscount
  }

  checkInDate() {
    return this._checkInDate.clone()
  }

  checkOutDate() {
    return this._checkOutDate.clone()
  }

  getDailyRoomYVPRate() {
    var globals = new Singleton()
    var nights = globals.checkOutDate.diff(globals.checkInDate, 'days')
    var dates = _.map(Array.from(moment.range(
      this.checkInDate(),
      this.checkOutDate().subtract(1, 'days') // checkOutDay is not paid for
    ).by('days')))

    var isAloneInRoom = globals.adults === 1; // Children do not affect the "single occupancy" or "double occupancy" base rate

    return _.map(dates, date => {
      var season = getSeasonByDate(date)
      var isDuringCourse = _.some(globals.courses, course => course.doesYVPApply(date))
      var roomRate = getRoomRate(this.roomId, season, isAloneInRoom, nights) * (globals.adults + globals.children / 2)
      var yvpRate = isDuringCourse ? 0 : getYVPRate(season) * globals.adults;

      return {
        date: date,
        room: applyDiscount(roomRate, this.roomDiscount),
        yvp: applyDiscount(yvpRate, this.yvpDiscount)
      }
    })
  }
}

let instance = null

class Singleton {
  constructor() {
    if (!instance) {
      instance = this
    }
    this.time = new Date()
    return instance
  }
}

export default class ReservationCalculator {
  constructor({ adults = 0, children = 0, stays = [], courses = [], grossDiscount }) {
    let globals = new Singleton()
    globals.adults = adults
    globals.children = children
    globals.courses = courses
    globals.checkInDate = _.first(stays).checkInDate()
    globals.checkOutDate = _.last(stays).checkOutDate()

    if (!moment.isMoment(globals.checkInDate) || !moment.isMoment(globals.checkOutDate)) {
      return EMPTY_RATES
    }

    // IMPORTANT ASSUMPTION: stays are one continuous range
    var dailyRoomYVP = _.flatMap(stays, stay => stay.getDailyRoomYVPRate())
    var room = _.sumBy(dailyRoomYVP, 'room')
    var yvp = _.sumBy(dailyRoomYVP, 'yvp')
    var course = _.sumBy(courses, course => course.howMuch())
    var subtotal = _.sum([room, yvp, course])
    var discount = calculateDiscount(subtotal, grossDiscount)
    var total = subtotal - discount

    return { dailyRoomYVP, room, yvp, course, subtotal, total, discount } 
  }
}
