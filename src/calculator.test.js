import _ from 'lodash'
import moment, { createMoment } from './lib/moment'
import { ROOM_ID, DISCOUNT, SEASON } from './constants'
import ReservationCalculator, { Course, RoomStay, TTCStay, SeasonPriceFactory, SeasonPrice } from './calculator'

const dates = {
  [SEASON.SUMMER_2015]: createMoment('2015-06-01'),
  [SEASON.WINTER_2016]: createMoment('2015-11-01'),
  [SEASON.SUMMER_2016]: createMoment('2016-04-01'),
  [SEASON.WINTER_2017]: createMoment('2016-11-01'),
  [SEASON.SUMMER_2017]: createMoment('2017-07-01'),
  [SEASON.WINTER_2018]: createMoment('2017-11-01'),
  [SEASON.SUMMER_2018]: createMoment('2018-07-01'),
};

describe('base rates (1 adult)', function() {
  const nights = [1, 7, 14, 21];
  
  const rooms = {
    [ROOM_ID.BEACHFRONT_SHARING]: {
      [SEASON.SUMMER_2015]: [136, 128, 121, 116],
      [SEASON.WINTER_2016]: [147, 137, 131, 127],
      [SEASON.SUMMER_2016]: [159, 148, 141, 136],
      [SEASON.WINTER_2017]: [159, 148, 141, 136],
      [SEASON.SUMMER_2017]: [136, 128, 121, 116],
      [SEASON.WINTER_2018]: [159, 148, 141, 136],
      [SEASON.SUMMER_2018]: [136, 128, 121, 116],
    },
    [ROOM_ID.OCEAN_VIEW_SHARING]: {
      [SEASON.SUMMER_2015]: [129, 121, 114, 109],
      [SEASON.WINTER_2016]: [140, 130, 124, 119],
      [SEASON.SUMMER_2016]: [147, 137, 130, 125],
      [SEASON.WINTER_2017]: [147, 137, 130, 125],
      [SEASON.SUMMER_2017]: [129, 121, 114, 109],
      [SEASON.WINTER_2018]: [147, 137, 130, 125],
      [SEASON.SUMMER_2018]: [129, 121, 114, 109],
    },
    [ROOM_ID.BEACH_HUT_SHARING]: {
      [SEASON.SUMMER_2015]: [109, 102, 97, 93],
      [SEASON.WINTER_2016]: [120, 112, 106, 102],
      [SEASON.SUMMER_2016]: [127, 119, 112, 108],
      [SEASON.WINTER_2017]: [127, 119, 112, 108],
      [SEASON.SUMMER_2017]:  [109, 102, 97, 93],
      [SEASON.WINTER_2018]: [127, 119, 112, 108],
      [SEASON.SUMMER_2018]:  [109, 102, 97, 93],
    },
    [ROOM_ID.GARDEN_BATH_SHARING]: {
      [SEASON.SUMMER_2015]: [121, 113, 107, 103],
      [SEASON.WINTER_2016]: [131, 123, 116, 111],
      [SEASON.SUMMER_2016]: [138, 129, 122, 117],
      [SEASON.WINTER_2017]: [138, 129, 122, 117],
      [SEASON.SUMMER_2017]: [121, 113, 107, 103],
      [SEASON.WINTER_2018]: [138, 129, 122, 117],
      [SEASON.SUMMER_2018]: [121, 113, 107, 103],
    },
    [ROOM_ID.GARDEN_DOUBLE]: {
      [SEASON.SUMMER_2015]: [99, 93, 88, 84],
      [SEASON.WINTER_2016]: [109, 103, 98, 94],
      [SEASON.SUMMER_2016]: [138, 130, 124, 118],
      [SEASON.WINTER_2017]: [138, 130, 124, 118],
      [SEASON.SUMMER_2017]: [120, 112, 106, 102],
      [SEASON.WINTER_2018]: [138, 130, 124, 118],
      [SEASON.SUMMER_2018]: [120, 112, 106, 102],
    },
    [ROOM_ID.GARDEN_SHARED_SHARING]: {
      [SEASON.SUMMER_2015]: [99, 93, 88, 84],
      [SEASON.WINTER_2016]: [109, 103, 98, 94],
      [SEASON.SUMMER_2016]: [112, 106, 101, 97],
      [SEASON.WINTER_2017]: [112, 106, 101, 97],
      [SEASON.SUMMER_2017]: [99, 93, 88, 84],
      [SEASON.WINTER_2018]: [112, 106, 101, 97],
      [SEASON.SUMMER_2018]: [99, 93, 88, 84],
    },
    [ROOM_ID.GARDEN_SINGLE]:  {
      [SEASON.SUMMER_2015]: [116, 108, 103, 99],
      [SEASON.WINTER_2016]: [127, 119, 113, 108],
      [SEASON.SUMMER_2016]: [133, 125, 119, 113],
      [SEASON.WINTER_2017]: [133, 125, 119, 113],
      [SEASON.SUMMER_2017]: [116, 108, 103, 99],
      [SEASON.WINTER_2018]: [133, 125, 119, 113],
      [SEASON.SUMMER_2018]: [116, 108, 103, 99],
    },
    [ROOM_ID.DORMITORY]: {
      [SEASON.SUMMER_2015]: [83, 77, 73, 70],
      [SEASON.WINTER_2016]: [94, 88, 84, 81],
      [SEASON.SUMMER_2016]: [80, 75, 71, 69],
      [SEASON.WINTER_2017]: [80, 75, 71, 69],
      [SEASON.SUMMER_2017]: [80, 75, 71, 69],
      [SEASON.WINTER_2018]: [80, 75, 71, 69],
      [SEASON.SUMMER_2018]: [80, 75, 71, 69],
    },
    [ROOM_ID.TENT_HUT]: {
      [SEASON.SUMMER_2015]: [79, 74, 70, 67],
      [SEASON.WINTER_2016]: [79, 74, 70, 67],
      [SEASON.SUMMER_2016]: [82, 77, 73, 70],
      [SEASON.WINTER_2017]: [82, 77, 73, 70],
      [SEASON.SUMMER_2017]: [82, 77, 73, 70],
      [SEASON.WINTER_2018]: [82, 77, 73, 70],
      [SEASON.SUMMER_2018]: [82, 77, 73, 70],
    },
    [ROOM_ID.TENT_SPACE]: {
      [SEASON.SUMMER_2015]: [69, 64, 61, 58],
      [SEASON.WINTER_2016]: [69, 64, 61, 58],
      [SEASON.SUMMER_2016]: [69, 64, 61, 58],
      [SEASON.WINTER_2017]: [69, 64, 61, 58],
      [SEASON.WINTER_2018]: [69, 64, 61, 58],
    },
    [ROOM_ID.NULL_ROOM]: {
      [SEASON.SUMMER_2015]: [0, 0, 0, 0],
      [SEASON.WINTER_2016]: [0, 0, 0, 0],
      [SEASON.SUMMER_2016]: [0, 0, 0, 0],
      [SEASON.WINTER_2017]: [0, 0, 0, 0],
      [SEASON.SUMMER_2017]: [0, 0, 0, 0],
      [SEASON.WINTER_2018]: [0, 0, 0, 0],
      [SEASON.SUMMER_2018]: [0, 0, 0, 0],
    }
  };

  _.each(rooms, (rates, roomId) => {
    _.each(rates, (rate, season) => {
      _.each(nights, (nights, index) => {
        it(`${roomId.toUpperCase()}, ${season.toUpperCase()}, ${nights} night(s)`, () => {
          const calculator = new ReservationCalculator({
            adults: 1,
            stays: [new RoomStay({
              roomId: roomId,
              checkInDate: dates[season].clone(),
              checkOutDate: dates[season].clone().add(nights, 'days')
            })]
          })
          expect(calculator.getTotalRoom() / nights).toEqual(rates[season][index])
        })
      })
    })
  })
})

describe('user stories', function() {
  it('one adult staying 3 nights in a ocean view deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(882)
    expect(calculator.getTotalYVP()).toEqual(96)
    expect(calculator.getGrandTotal()).toEqual(978)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('one adult staying 3 nights in a ocean view deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(774 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(60)
    expect(calculator.getGrandTotal()).toEqual(774 * 0.85 + 60)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('one adult staying 4 nights in a garden room single during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(4, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(532)
    expect(calculator.getTotalYVP()).toEqual(128)
    expect(calculator.getGrandTotal()).toEqual(660)
    expect(calculator.getTotalNumberOfNights()).toEqual(4)
  })

  it('one adult staying 4 nights in a garden room single during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(116 * 4)
    expect(calculator.getTotalYVP()).toEqual(80)
    expect(calculator.getGrandTotal()).toEqual(116 * 4 + 80)
    expect(calculator.getTotalNumberOfNights()).toEqual(4)
  })

  it('one adult staying 8 nights in a garden room double bed during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1040)
    expect(calculator.getTotalYVP()).toEqual(256)
    expect(calculator.getGrandTotal()).toEqual(1296)
    expect(calculator.getTotalNumberOfNights()).toEqual(8)
  })

  it('one adult staying 8 nights in a garden room double bed during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 8)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(112*8+ 160)
    expect(calculator.getTotalNumberOfNights()).toEqual(8)
  })

  it('one adult staying 12 nights in beachfront deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3552)
    expect(calculator.getTotalYVP()).toEqual(384)
    expect(calculator.getGrandTotal()).toEqual(3936)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })

  it('one adult staying 12 nights in beachfront deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3072 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(240)
    expect(calculator.getGrandTotal()).toEqual(3072 * 0.85 + 240)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })

  it('one adult staying 3 nights in a dormitory during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.DORMITORY,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(80 * 3)
    expect(calculator.getTotalYVP()).toEqual(32 * 3)
    expect(calculator.getGrandTotal()).toEqual(80 * 3 + 32 * 3)
  })

  it('one adult staying offsite for 3 nights during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.NULL_ROOM,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(0)
    expect(calculator.getTotalYVP()).toEqual(32 * 3)
    expect(calculator.getGrandTotal()).toEqual(32 * 3)
  })

  it('one adult staying offsite for 3 nights during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.NULL_ROOM,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(0)
    expect(calculator.getTotalYVP()).toEqual(20 * 3)
    expect(calculator.getGrandTotal()).toEqual(20 * 3)
  })

  it('two adults staying 5 nights in a beachfront deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1590)
    expect(calculator.getTotalYVP()).toEqual(320)
    expect(calculator.getGrandTotal()).toEqual(1910)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('two adults staying 5 nights in a beachfront deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1360)
    expect(calculator.getTotalYVP()).toEqual(200)
    expect(calculator.getGrandTotal()).toEqual(1560)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('two adults staying 15 nights in a garden room double bed during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(15, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3030)
    expect(calculator.getTotalYVP()).toEqual(960)
    expect(calculator.getGrandTotal()).toEqual(3990)
    expect(calculator.getTotalNumberOfNights()).toEqual(15)
  })

  it('two adults staying 15 nights in a garden room double bed during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(15, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(2640)
    expect(calculator.getTotalYVP()).toEqual(600)
    expect(calculator.getGrandTotal()).toEqual(3240)
    expect(calculator.getTotalNumberOfNights()).toEqual(15)
  })

  it('two adults staying 5 nights in a tent hut double during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(820)
    expect(calculator.getTotalYVP()).toEqual(320)
    expect(calculator.getGrandTotal()).toEqual(1140)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('four adults staying 5 nights in a dormitory during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 4,
      stays: [new RoomStay({
        roomId: ROOM_ID.DORMITORY,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(4 * 5 * 80)
    expect(calculator.getTotalYVP()).toEqual(4 * 5 * 32)
    expect(calculator.getGrandTotal()).toEqual(4 * 5 * 80 + 4 * 5 * 32)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult and one child staying in an oceanview room for three nights during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      children: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(661.5)
    expect(calculator.getTotalYVP()).toEqual(96)
    expect(calculator.getGrandTotal()).toEqual(757.5)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('two adults and one child staying in an oceanview room for three nights during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      children: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1102.5)
    expect(calculator.getTotalYVP()).toEqual(192)
    expect(calculator.getGrandTotal()).toEqual(1294.50)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })
  it('two adults and two children staying in a beachfront deluxe suite for three nights in WINTER_2017', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      children: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1431)
    expect(calculator.getTotalYVP()).toEqual(192)
    expect(calculator.getGrandTotal()).toEqual(1623)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('one adult staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 250,
        startDate: dates[SEASON.WINTER_2017].clone().add(3, 'days'),
        endDate: dates[SEASON.WINTER_2017].clone().add(7, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(2960)
    expect(calculator.getTotalYVP()).toEqual(128)
    expect(calculator.getTotalCourse()).toEqual(250)
    expect(calculator.getGrandTotal()).toEqual(3338)
    expect(calculator.getTotalNumberOfNights()).toEqual(10)
  })

  it('one adult staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 250,
        startDate: dates[SEASON.SUMMER_2017].clone().add(3, 'days'),
        endDate: dates[SEASON.SUMMER_2017].clone().add(7, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(2560 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(80)
    expect(calculator.getTotalCourse()).toEqual(250)
    expect(calculator.getGrandTotal()).toEqual(2560 * 0.85 + 80 + 250)
    expect(calculator.getTotalNumberOfNights()).toEqual(10)
  })

  // Story provided by Anne Voors:
  // Two best friends decide to ditch Atlantis because they hear about our Thai yoga Massage Workshop...THE Kam Thye Chow?!?
  // They are sharing a garden room with bath and staying at the ashram for a total of 7 nights.
  // The workshop is a course that is $295 and 3 days long. No prob ladies!
  it('two adults staying 7 nights sharing a garden room bath taking a 3 day course for $295 starting the day of their arrival during Winter 2017. The system\'s input for this case is individual calculations.', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_BATH_SHARING,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(7, 'days')
      })],
      courses: [new Course({
        tuition: 295,
        startDate: dates[SEASON.WINTER_2017].clone(),
        endDate: dates[SEASON.WINTER_2017].clone().add(2, 'days')
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(1326)
    expect(calculator.getTotalNumberOfNights()).toEqual(7)
  })

  it('one adult staying 12 nights sharing a beachfront deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1776)
    expect(calculator.getTotalYVP()).toEqual(384)
    expect(calculator.getGrandTotal()).toEqual(2160)
  })

  it('one adult staying 12 nights sharing a beachfront deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1536)
    expect(calculator.getTotalYVP()).toEqual(240)
    expect(calculator.getGrandTotal()).toEqual(1776)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(2, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(2, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(120 * 2 + 258 * 3 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(100)
    expect(calculator.getGrandTotal()).toEqual(120 * 2 + 258 * 3 * 0.85 + 100)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(4, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1890)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2178)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(112 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(4, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1794)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2082)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(93 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(93 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(5, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(5, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(120 * 2 + 258 * 3 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(100)
    expect(calculator.getGrandTotal()).toEqual(120 * 2 + 258 * 3 * 0.85 + 100)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(15, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(20, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1890)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2178)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(15, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(20, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(112 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone().add(20, 'days'),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(25, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1794)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2082)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during Summer 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: dates[SEASON.SUMMER_2017].clone(),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.SUMMER_2017].clone().add(20, 'days'),
        checkOutDate: dates[SEASON.SUMMER_2017].clone().add(25, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(93 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(93 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(3, 'days')
      })]
    })
    expect(calculator.getDailyRoomYVP()).toEqual({
      '11/01/2016': { room: 138 + 294, yvp: 32 * 2 },
      '11/02/2016': { room: 138 + 294, yvp: 32 * 2 },
      '11/03/2016': { room: 294, yvp: 32 }
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
  })

  // Story provided by Anne Voors:
  // A TTC graduate stays for 14 nights in a beach hut that they would like to share with another guest (stranger).
  // This graduate is taking Brahmaswaroop's "Dual path of yoga practice and Code writing" yoga course, which is 295 and 5 days long.
  // What will their folio balance be?!
  it('A TTC graduate staying 14 nights sharing a beach hut taking a 4 day course for $295 during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACH_HUT_SHARING,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(14, 'days'),
        roomDiscount: {type: DISCOUNT.PERCENT, value: 10},
        yvpDiscount: {type: DISCOUNT.PERCENT, value: 10}
      })],
      courses: [new Course({
        tuition: 295,
        startDate: dates[SEASON.WINTER_2017].clone(),
        endDate: dates[SEASON.WINTER_2017].clone().add(4, 'days'),
        discount: {type: DISCOUNT.PERCENT, value: 10}
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(1935.9)
  })
  
  // Story provided by Anne Voors:
  // A burnt out Wall Street worker has decided to vacay on "da islands".
  // She chooses to stay in a beachfront deluxe room for 10 nights,
  // but also signs up for two courses and pays in full upon arrival.
  // The first course is "Power of Playing Violin like a real Yogi" by beloved Iswara Chaitanya
  // and the second is "Taking Yoga to Work With You".
  // Each course is $295 each and the first one is 3 days while the second is 4 days.
  // Can this economic guru trade her briefcase for some mala beads?
  it('one adult staying in a beachfront deluxe for 10 nights, taking a 3 day course for $295 and a 4 day course for $295 during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 295,
        startDate: dates[SEASON.WINTER_2017].clone(),
        endDate: dates[SEASON.WINTER_2017].clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 5
        }
      }), new Course({
        tuition: 295,
        startDate: dates[SEASON.WINTER_2017].clone().add(4, 'days'),
        endDate: dates[SEASON.WINTER_2017].clone().add(8, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 5
        }
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(3552.50)
  })
  
  // Story provided by Anne Voors:
  // A young hippy is looking for a chance to learn some new things.
  // He is staying in his own tent for 25 nights and taking three courses.
  // All of which he was registered for before he arrived and paid in full upon arrival.
  // Essentials 1 is 3 days and $195, Essentials 2 is 4 days and $295, then Essentials 3 is $400 and 6 days.
  it('one adult staying in a tent for 25 nights taking a 3 day course for $195, a 4 day course for $295, and a 6 day course for $400 during Winter 2017', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.TENT_SPACE,
        checkInDate: dates[SEASON.WINTER_2017].clone(),
        checkOutDate: dates[SEASON.WINTER_2017].clone().add(25, 'days')
      })],
      courses: [new Course({
        tuition: 195,
        startDate: dates[SEASON.WINTER_2017].clone(),
        endDate: dates[SEASON.WINTER_2017].clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }), new Course({
        tuition: 295,
        startDate: dates[SEASON.WINTER_2017].clone().add(4, 'days'),
        endDate: dates[SEASON.WINTER_2017].clone().add(8, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }), new Course({
        tuition: 400,
        startDate: dates[SEASON.WINTER_2017].clone().add(9, 'days'),
        endDate: dates[SEASON.WINTER_2017].clone().add(15, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(2539)
    expect(calculator.getTotalNumberOfNights()).toEqual(25)
  })

  it('one adult comes for April 2017 TTC in a Tent Space', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new TTCStay({
        roomId: ROOM_ID.TENT_SPACE,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03'),
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(2400)
    expect(calculator.getTotalNumberOfNights()).toEqual(30)
  })

  it('one adult comes for April 2017 TTC in a Dormitory', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new TTCStay({
        roomId: ROOM_ID.DORMITORY,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03'),
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(3255)
    expect(calculator.getTotalNumberOfNights()).toEqual(30)
  })

  it('one adult comes for April 2017 TTC in a Tent Hut', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new TTCStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03'),
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(3490)
    expect(calculator.getTotalNumberOfNights()).toEqual(30)
  })

  it('one adult comes for April 2017 TTC in a Tent Hut with a %10 discount', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new TTCStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03'),
	grossDiscountPercent: 10
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(3490 * 0.9)
    expect(calculator.getTotalNumberOfNights()).toEqual(30)
  })

  it('one adult comes for April 2017 TTC in a Tent Hut', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new TTCStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03'),
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(3490)
    expect(calculator.getTotalNumberOfNights()).toEqual(30)
  })

  // Story provided by Anne Voors:
  // A guest arrives on March 26th and is planning on departing April 3rd 2017, staying in a beloved north tent hut.
  // While at the ashram, for obvious reasons, they fall in love with Sivananda yoga
  // and feel it is their duty to become a teacher to share this energy with others (WOW 😮)!!
  // They would like to join the April 2017 TTC. How much will their total be?
  it('one adult staying in a tent hut from March 26th, 2017 to April 3rd, 2017 and taking April TTC', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: createMoment('2017-03-26'),
        checkOutDate: createMoment('2017-04-03')
      }), new TTCStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: createMoment('2017-04-03'),
        checkOutDate: createMoment('2017-05-03')
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(4362-7*8)
    expect(calculator.getTotalNumberOfNights()).toEqual(38)
  })
})

