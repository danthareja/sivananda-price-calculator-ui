/* eslint-disable */
import _ from 'lodash'
import moment, { createMoment } from './lib/moment'

import { ROOM_ID, SEASON, DISCOUNT } from './data/constants'

class RoomCategory {
  constructor(id, isWillingToShare) {
    this.id = id
    this.isWillingToShare = isWillingToShare
  }
}

class BeachFrontRoomCategory extends RoomCategory {}
class OceanViewRoomCategory extends RoomCategory {}
class BeachHutRoomCategory extends RoomCategory {}
class GardenBathRoomCategory extends RoomCategory {}
class GardenDoubleRoomCategory extends RoomCategory {}
class GardenSharedRoomCategory extends RoomCategory {}
class GardenSingleRoomCategory extends RoomCategory {}
class DormitoryRoomCategory extends RoomCategory {}
class TentHutRoomCategory extends RoomCategory {}
class TentSpaceRoomCategory extends RoomCategory {}

export class RoomCategoryFactory {
  static createRoomCategory = (roomId) => {
    switch (roomId) {
      case ROOM_ID.BEACHFRONT: return new BeachFrontRoomCategory(ROOM_ID.BEACHFRONT, false)
      case ROOM_ID.BEACHFRONT_SHARING: return new BeachFrontRoomCategory(ROOM_ID.BEACHFRONT, true)
      case ROOM_ID.OCEAN_VIEW: return new OceanViewRoomCategory(ROOM_ID.OCEAN_VIEW, false)
      case ROOM_ID.OCEAN_VIEW_SHARING: return new OceanViewRoomCategory(ROOM_ID.OCEAN_VIEW, true)
      case ROOM_ID.BEACH_HUT: return new BeachHutRoomCategory(ROOM_ID.BEACH_HUT, false)
      case ROOM_ID.BEACH_HUT_SHARING: return new BeachHutRoomCategory(ROOM_ID.BEACH_HUT, true)
      case ROOM_ID.GARDEN_BATH: return new GardenBathRoomCategory(ROOM_ID.GARDEN_BATH, false)
      case ROOM_ID.GARDEN_BATH_SHARING: return new GardenBathRoomCategory(ROOM_ID.GARDEN_BATH, true)
      case ROOM_ID.GARDEN_DOUBLE: return new GardenDoubleRoomCategory(ROOM_ID.GARDEN_DOUBLE, false)
      case ROOM_ID.GARDEN_DOUBLE_SHARING: return new GardenDoubleRoomCategory(ROOM_ID.GARDEN_DOUBLE, true)
      case ROOM_ID.GARDEN_SHARED: return new GardenSharedRoomCategory(ROOM_ID.GARDEN_SHARED, false)
      case ROOM_ID.GARDEN_SHARED_SHARING: return new GardenSharedRoomCategory(ROOM_ID.GARDEN_SHARED, true)
      case ROOM_ID.GARDEN_SINGLE: return new GardenSingleRoomCategory(ROOM_ID.GARDEN_SINGLE, false)
      case ROOM_ID.DORMITORY: return new DormitoryRoomCategory(ROOM_ID.DORMITORY, false)
      case ROOM_ID.TENT_HUT: return new TentHutRoomCategory(ROOM_ID.TENT_HUT, false)
      case ROOM_ID.TENT_SPACE: return new TentSpaceRoomCategory(ROOM_ID.TENT_SPACE, false)
      default: throw new Error(`Invalid roomId: "${roomId}"`)
    }
  }
}


class SeasonPrice {
  constructor(type) {
    this.type = type
  }

  static yvpRates = {
    [SEASON.WINTER]: 32,
    [SEASON.SUMMER]: 20
  };

  static roomRates = {
    [ROOM_ID.BEACHFRONT]: {
      [SEASON.WINTER]: {
        alone: [318, 296, 282, 272],
        sharing: [159, 148, 141, 136],
      },
      [SEASON.SUMMER]: {
        alone: [272, 256, 242, 232],
        sharing: [136, 128, 121, 116],
      }
    },
    [ROOM_ID.OCEAN_VIEW]: {
      [SEASON.WINTER]: {
        alone: [294, 274, 260, 250],
        sharing: [147, 137, 130, 125],
      },
      [SEASON.SUMMER]: {
        alone: [258, 242, 228, 218],
        sharing: [129, 121, 114, 109],
      }
    },
    [ROOM_ID.BEACH_HUT]: {
      [SEASON.WINTER]: {
        alone: [254, 238, 224, 216],
        sharing: [127, 119, 112, 108],
      },
      [SEASON.SUMMER]: {
        alone: [218, 204, 194, 186],
        sharing: [109, 102, 97, 93],
      }
    },
    [ROOM_ID.GARDEN_BATH]: {
      [SEASON.WINTER]: {
        alone: [276, 258, 244, 234],
        sharing: [138, 129, 122, 117],
      },
      [SEASON.SUMMER]: {
        alone: [242, 226, 214, 206],
        sharing: [121, 113, 107, 103],
      }
    },
    [ROOM_ID.GARDEN_DOUBLE]: {
      [SEASON.WINTER]: {
        alone: [138, 130, 124, 118],
        sharing: [112, 106, 101, 97],
      },
      [SEASON.SUMMER]: {
        alone: [116, 108, 103, 99],
        sharing: [99, 93, 88, 84],
      }
    },
    [ROOM_ID.GARDEN_SHARED]: {
      [SEASON.WINTER]: {
        alone: [224, 212, 202, 194],
        sharing: [112, 106, 101, 97],
      },
      [SEASON.SUMMER]: {
        alone: [198, 186, 176, 168],
        sharing: [99, 93, 88, 84],
      }
    },
    [ROOM_ID.GARDEN_SINGLE]:  {
      [SEASON.WINTER]: {
        alone: [133, 125, 119, 113]
      },
      [SEASON.SUMMER]: {
        alone: [116, 108, 103, 99]
      }
    },
    [ROOM_ID.DORMITORY]: {
      [SEASON.WINTER]: {
        alone: [80, 75, 71, 69],
        sharing: [80, 75, 71, 69]
      },
      [SEASON.SUMMER]: {
        alone: [83, 77, 73, 70],
        sharing: [83, 77, 73, 70]
      }
    },
    [ROOM_ID.TENT_HUT]: {
      [SEASON.WINTER]: {
        alone: [82, 77, 73, 70],
        sharing: [82, 77, 73, 70]
      }
    },
    [ROOM_ID.TENT_SPACE]: {
      [SEASON.WINTER]: {
        alone: [69, 64, 61, 58]
      }
    }
  };

  getRoomBaseRate(roomCategory, isSharing, nights){
    if (nights <= 6) { return SeasonPrice.roomRates[roomCategory.id][this.type][isSharing ? 'sharing' : 'alone'][0] }
    if (nights <= 13) { return SeasonPrice.roomRates[roomCategory.id][this.type][isSharing ? 'sharing' : 'alone'][1] }
    if (nights <= 20) { return SeasonPrice.roomRates[roomCategory.id][this.type][isSharing ? 'sharing' : 'alone'][2] }
    if (nights >= 21) { return SeasonPrice.roomRates[roomCategory.id][this.type][isSharing ? 'sharing' : 'alone'][3] }
  }

  getYVPRate(date){
    return SeasonPrice.yvpRates[this.type]
  }
}

class WinterSeasonPrice extends SeasonPrice {}
class SummerSeasonPrice extends SeasonPrice {
  getRoomBaseRate(roomCategory, isSharing, nights) {
    if (!isSharing) {
      return super.getRoomBaseRate(roomCategory, isSharing, nights) * 0.85  
    }
    return super.getRoomBaseRate(roomCategory, isSharing, nights)
  }
}

export class SeasonPriceFactory {
  static seasons = [
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
  ];

  static getSeasonFromDate = (date) => {
    return _.find(SeasonPriceFactory.seasons, ({ startDate, endDate }) =>
      date.within(moment.range(startDate, endDate))
    )
  };

  static createSeasonPrice = (date) => {
    const season = SeasonPriceFactory.getSeasonFromDate(date)

    if (!season) {
      throw new Error(`Could not find season for date: ${date.format('YYYY-MM-DD')}`)
    }

    switch (season.type) {
      case SEASON.WINTER: return new WinterSeasonPrice(SEASON.WINTER)
      case SEASON.SUMMER:  return new SummerSeasonPrice(SEASON.SUMMER)
      default:
        throw new Error(`Unexpected season type: "${season.type}"`)
    }
  }
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
    if (this.discount.type === DISCOUNT.PERCENT) {
      return this.tuition * ( this.discount.value / 100 )
    }
    if (this.discount.type === DISCOUNT.FIXED) {
      return this.discount.value
    }
    return 0
  }

  totalCost() {
    return _.round(this.tuition - this.calculateDiscount(), 2)
  }
}

export class RoomStay {
  constructor({ roomId, checkInDate, checkOutDate, roomDiscount = {}, yvpDiscount = {} }) {
    this.roomId = roomId
    this._checkInDate = checkInDate
    this._checkOutDate = checkOutDate
    this.roomDiscount = roomDiscount
    this.yvpDiscount = yvpDiscount
    this.roomCategory = RoomCategoryFactory.createRoomCategory(roomId)
  }

  checkInDate() {
    return this._checkInDate.clone()
  }

  checkOutDate() {
    return this._checkOutDate.clone()
  }

  getDateRange() {
    return Array.from(moment.range(
      this.checkInDate(),
      this.checkOutDate().subtract(1, 'days') // checkOutDay is not paid for
    ).by('days'))
  }

  getNightsCountingTowardsTotal() {
    return this._checkOutDate.diff(this._checkInDate, 'days')
  }

  calculateDiscount(price, discount) {
    switch (discount.type) {
      case DISCOUNT.PERCENT:
        return price * ( discount.value / 100 )
      case DISCOUNT.FIXED:
        return discount.value
      default:
        return 0
    }
  }

  applyDiscount(price, discount) {
    return price - this.calculateDiscount(price, discount)
  }

  getRoomRate(date) {
    var seasonPrice = SeasonPriceFactory.createSeasonPrice(date)
    var isSharing = this.roomCategory.isWillingToShare || ReservationCalculator.adults + ReservationCalculator.children > 1
    return seasonPrice.getRoomBaseRate(this.roomCategory, isSharing, ReservationCalculator.getTotalNumberOfNights()) * (ReservationCalculator.adults + ReservationCalculator.children / 2)
  }

  getYVPRate(date) {
    var seasonPrice = SeasonPriceFactory.createSeasonPrice(date)
    var isDuringCourse = _.some(ReservationCalculator.courses, course => course.doesYVPApply(date))
    return isDuringCourse ? 0 : seasonPrice.getYVPRate() * ReservationCalculator.adults;
  }

  getDailyRoomYVPRate() {
    return _.map(this.getDateRange(), date => ({
      date: date,
      room: _.round(this.applyDiscount(this.getRoomRate(date), this.roomDiscount), 2),
      yvp: _.round(this.applyDiscount(this.getYVPRate(date), this.yvpDiscount), 2)
    }))
  }
}

export class TTCStay extends RoomStay {
  static _roomIds = [
    ROOM_ID.TENT_SPACE,
    ROOM_ID.TENT_HUT,
    ROOM_ID.DORMITORY
  ];

  // Be sure to include free days
  static _dates = [{
    label: 'April 4 — May 1, 2017',
    checkInDate: createMoment('2017-04-03'),
    checkOutDate: createMoment('2017-05-03')
  }, {
    label: 'May 4 — 31, 2017',
    checkInDate: createMoment('2017-05-03'),
    checkOutDate: createMoment('2017-06-02')
  }, {
    label: 'June 3 — 30, 2017',
    checkInDate: createMoment('2017-06-02'),
    checkOutDate: createMoment('2017-07-02')
  }, {
    label: 'July 3 — 30, 2017',
    checkInDate: createMoment('2017-07-02'),
    checkOutDate: createMoment('2017-08-01')
  }, {
    label: 'November 4 — December 1, 2017',
    checkInDate: createMoment('2017-11-03'),
    checkOutDate: createMoment('2017-12-03')
  }, {
    label: 'December 4 — 31, 2017',
    checkInDate: createMoment('2017-12-03'),
    checkOutDate: createMoment('2018-01-03')
  }, {
    label: 'January 4 — 31, 2018',
    checkInDate: createMoment('2018-01-03'),
    checkOutDate: createMoment('2018-02-02')
  }, {
    label: 'February 3 — March 2, 2018',
    checkInDate: createMoment('2018-02-02'),
    checkOutDate: createMoment('2018-03-04')
  }, {
    label: 'March 7 — April 3, 2018',
    checkInDate: createMoment('2018-03-06'),
    checkOutDate: createMoment('2018-04-05')
  }, {
    label: 'May 6 — June 2, 2018',
    checkInDate: createMoment('2018-05-05'),
    checkOutDate: createMoment('2018-06-04')
  }, {
    label: 'June 5 — July 2, 2018',
    checkInDate: createMoment('2018-06-04'),
    checkOutDate: createMoment('2018-07-04')
  }, {
    label: 'July 5 — August 1, 2018',
    checkInDate: createMoment('2018-07-04'),
    checkOutDate: createMoment('2018-08-03')
  }];

  // Combine rooms and dates together
  static getDates = () => _.flatMap(TTCStay._dates, date =>
    _.map(TTCStay._roomIds, roomId => {
      return _.assign({ roomId }, date)
    })
  );

  // A TTC stay will not count towards the price code
  // of other room stay rates
  getNightsCountingTowardsTotal() {
    return 0
  }

  getDailyRoomYVPRate() {
    let packagePrice;
    switch (this.roomCategory.constructor.name) {
      case 'TentSpaceRoomCategory':
        packagePrice = 2400
        break
      case 'DormitoryRoomCategory':
        packagePrice = 3255
        break
      case 'TentHutRoomCategory':
        packagePrice = 3490
        break
    }
    return [{
      date: this.checkInDate(),
      room: packagePrice,
      yvp: 0
    }]
  }
}

export default class ReservationCalculator {
  static VAT = 0.075;

  // Default "globals" (blehhhhh)
  static adults = 0;
  static children = 0;
  static stays = [];
  static courses = [];
  static checkInDate = null;
  static checkOutDate = null;

  static getTotalNumberOfNights = () => {
    return _.sumBy(ReservationCalculator.stays, stay => stay.getNightsCountingTowardsTotal())
  };

  constructor({ adults = 0, children = 0, stays = [], courses = [],  }) {
    ReservationCalculator.adults = adults
    ReservationCalculator.children = children
    ReservationCalculator.stays = stays
    ReservationCalculator.courses = courses
    ReservationCalculator.checkInDate = _.size(stays) > 0 ? _.first(stays).checkInDate() : moment()
    ReservationCalculator.checkOutDate = _.size(stays) > 0 ? _.last(stays).checkOutDate() : moment()

    if (!moment.isMoment(ReservationCalculator.checkInDate) || !moment.isMoment(ReservationCalculator.checkOutDate)) {
      throw new Error('checkInDate and checkOutDate must be a moment object')
    }
  }

  getDailyRoomYVP() {
    // Because stays could be overlapping, we should merge room rate objects together
    return _.reduce(ReservationCalculator.stays, (obj, stay) => {
      _.each(stay.getDailyRoomYVPRate(), rate => {
        let key = rate.date.format('MM/DD/YYYY');

        if (!obj[key]) { obj[key] = {}}
        if (!obj[key].room) { obj[key].room = 0 }
        if (!obj[key].yvp) { obj[key].yvp = 0 }

        obj[key].room += rate.room
        obj[key].yvp += rate.yvp
      })
      return obj
    }, {})
  }

  getTotalRoom() {
    return _.round(_.sumBy(_.values(this.getDailyRoomYVP()), 'room'), 2)
  }

  getTotalYVP() {
    return _.round(_.sumBy(_.values(this.getDailyRoomYVP()), 'yvp'), 2)
  }

  getTotalCourse() {
    return _.round(_.sumBy(ReservationCalculator.courses, course => course.totalCost()), 2)
  }

  getSubtotal() {
    return this.getTotalRoom() + this.getTotalYVP() + this.getTotalCourse()
  }

  getGrandTotal() {
    return  this.getSubtotal()
  }
}

