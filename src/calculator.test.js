import { createMoment } from './lib/moment'
import { ROOM_ID, DISCOUNT } from './data/constants'
import ReservationCalculator, { Course, RoomStay, TTCStay } from './calculator'

const winter = createMoment('2016-11-20')
const summer = createMoment('2017-07-01')

describe('one adult', function() {
  it('one adult staying 3 nights in a ocean view deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(882)
    expect(calculator.getTotalYVP()).toEqual(96)
    expect(calculator.getGrandTotal()).toEqual(978)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('one adult staying 3 nights in a ocean view deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(774 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(60)
    expect(calculator.getGrandTotal()).toEqual(774 * 0.85 + 60)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('one adult staying 4 nights in a garden room single during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(532)
    expect(calculator.getTotalYVP()).toEqual(128)
    expect(calculator.getGrandTotal()).toEqual(660)
    expect(calculator.getTotalNumberOfNights()).toEqual(4)
  })

  it('one adult staying 4 nights in a garden room single during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(116 * 4)
    expect(calculator.getTotalYVP()).toEqual(80)
    expect(calculator.getGrandTotal()).toEqual(116 * 4 + 80)
    expect(calculator.getTotalNumberOfNights()).toEqual(4)
  })

  it('one adult staying 8 nights in a garden room double bed during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1040)
    expect(calculator.getTotalYVP()).toEqual(256)
    expect(calculator.getGrandTotal()).toEqual(1296)
    expect(calculator.getTotalNumberOfNights()).toEqual(8)
  })

  it('one adult staying 8 nights in a garden room double bed during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 8)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(112*8+ 160)
    expect(calculator.getTotalNumberOfNights()).toEqual(8)
  })

  it('one adult staying 12 nights in beachfront deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3552)
    expect(calculator.getTotalYVP()).toEqual(384)
    expect(calculator.getGrandTotal()).toEqual(3936)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })

  it('one adult staying 12 nights in beachfront deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3072 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(240)
    expect(calculator.getGrandTotal()).toEqual(3072 * 0.85 + 240)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })

  it('one adult staying 3 nights in a dormitory during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.DORMITORY,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(80 * 3)
    expect(calculator.getTotalYVP()).toEqual(32 * 3)
    expect(calculator.getGrandTotal()).toEqual(80 * 3 + 32 * 3)
  })
})

describe('multiple adults', function() {
  it('two adults staying 5 nights in a beachfront deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1590)
    expect(calculator.getTotalYVP()).toEqual(320)
    expect(calculator.getGrandTotal()).toEqual(1910)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('two adults staying 5 nights in a beachfront deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1360)
    expect(calculator.getTotalYVP()).toEqual(200)
    expect(calculator.getGrandTotal()).toEqual(1560)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('two adults staying 15 nights in a garden room double bed during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(15, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(3030)
    expect(calculator.getTotalYVP()).toEqual(960)
    expect(calculator.getGrandTotal()).toEqual(3990)
    expect(calculator.getTotalNumberOfNights()).toEqual(15)
  })

  it('two adults staying 15 nights in a garden room double bed during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(15, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(2640)
    expect(calculator.getTotalYVP()).toEqual(600)
    expect(calculator.getGrandTotal()).toEqual(3240)
    expect(calculator.getTotalNumberOfNights()).toEqual(15)
  })

  it('two adults staying 5 nights in a tent hut double during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.TENT_HUT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(820)
    expect(calculator.getTotalYVP()).toEqual(320)
    expect(calculator.getGrandTotal()).toEqual(1140)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('four adults staying 5 nights in a dormitory during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 4,
      stays: [new RoomStay({
        roomId: ROOM_ID.DORMITORY,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(4 * 5 * 80)
    expect(calculator.getTotalYVP()).toEqual(4 * 5 * 32)
    expect(calculator.getGrandTotal()).toEqual(4 * 5 * 80 + 4 * 5 * 32)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })
})

describe('adults and children', function() {
  it('one adult and one child staying in an oceanview room for three nights in winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      children: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(661.5)
    expect(calculator.getTotalYVP()).toEqual(96)
    expect(calculator.getGrandTotal()).toEqual(757.5)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })

  it('two adults and one child staying in an oceanview room for three nights in winter', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      children: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1102.5)
    expect(calculator.getTotalYVP()).toEqual(192)
    expect(calculator.getGrandTotal()).toEqual(1294.50)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })
  it('two adults and two children staying in a beachfront deluxe suite for three nights in winter', function() {
    const calculator = new ReservationCalculator({
      adults: 2,
      children: 2,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1431)
    expect(calculator.getTotalYVP()).toEqual(192)
    expect(calculator.getGrandTotal()).toEqual(1623)
    expect(calculator.getTotalNumberOfNights()).toEqual(3)
  })
})


describe('courses', function() {
  it('one adult staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 250,
        startDate: winter.clone().add(3, 'days'),
        endDate: winter.clone().add(7, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(2960)
    expect(calculator.getTotalYVP()).toEqual(128)
    expect(calculator.getTotalCourse()).toEqual(250)
    expect(calculator.getGrandTotal()).toEqual(3338)
    expect(calculator.getTotalNumberOfNights()).toEqual(10)
  })

  it('one adult staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 250,
        startDate: summer.clone().add(3, 'days'),
        endDate: summer.clone().add(7, 'days')
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
  it('two adults staying 7 nights sharing a garden room bath taking a 3 day course for $295 starting the day of their arrival during the winter. The system\'s input for this case is individual calculations.', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_BATH_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(7, 'days')
      })],
      courses: [new Course({
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(2, 'days')
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(1326)
    expect(calculator.getTotalNumberOfNights()).toEqual(7)
  })
})

describe('room sharing', function() {
  it('one adult staying 12 nights sharing a beachfront deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1776)
    expect(calculator.getTotalYVP()).toEqual(384)
    expect(calculator.getGrandTotal()).toEqual(2160)
  })

  it('one adult staying 12 nights sharing a beachfront deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1536)
    expect(calculator.getTotalYVP()).toEqual(240)
    expect(calculator.getGrandTotal()).toEqual(1776)
    expect(calculator.getTotalNumberOfNights()).toEqual(12)
  })
})

describe('room moves', function() {
  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(2, 'days'),
        checkOutDate: winter.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(2, 'days'),
        checkOutDate: summer.clone().add(5, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(120 * 2 + 258 * 3 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(100)
    expect(calculator.getGrandTotal()).toEqual(120 * 2 + 258 * 3 * 0.85 + 100)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(4, 'days'),
        checkOutDate: winter.clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1890)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2178)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(4, 'days'),
        checkOutDate: summer.clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(112 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(4, 'days'),
        checkOutDate: winter.clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1794)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2082)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(4, 'days'),
        checkOutDate: summer.clone().add(9, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(93 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(93 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })
})

describe('non-continuous room moves', function() {
  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(5, 'days'),
        checkOutDate: winter.clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(5, 'days'),
        checkOutDate: summer.clone().add(8, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(120 * 2 + 258 * 3 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(100)
    expect(calculator.getGrandTotal()).toEqual(120 * 2 + 258 * 3 * 0.85 + 100)
    expect(calculator.getTotalNumberOfNights()).toEqual(5)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(15, 'days'),
        checkOutDate: winter.clone().add(20, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1890)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2178)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(15, 'days'),
        checkOutDate: summer.clone().add(20, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(112 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(112 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(20, 'days'),
        checkOutDate: winter.clone().add(25, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(1794)
    expect(calculator.getTotalYVP()).toEqual(288)
    expect(calculator.getGrandTotal()).toEqual(2082)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })

  it('one adult staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the summer', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(20, 'days'),
        checkOutDate: summer.clone().add(25, 'days')
      })]
    })
    expect(calculator.getTotalRoom()).toEqual(93 * 4 + 242 * 5 * 0.85)
    expect(calculator.getTotalYVP()).toEqual(180)
    expect(calculator.getGrandTotal()).toEqual(93 * 4 + 242 * 5 * 0.85 + 180)
    expect(calculator.getTotalNumberOfNights()).toEqual(9)
  })
})

describe('duplicate dates', function() {
  it('one adult staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(2, 'days')
      }), new RoomStay({
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      })]
    })
    expect(calculator.getDailyRoomYVP()).toEqual({
      '11/20/2016': { room: 138 + 294, yvp: 32 * 2 },
      '11/21/2016': { room: 138 + 294, yvp: 32 * 2 },
      '11/22/2016': { room: 294, yvp: 32 }
    })
    expect(calculator.getTotalRoom()).toEqual(1158)
    expect(calculator.getTotalYVP()).toEqual(160)
    expect(calculator.getGrandTotal()).toEqual(1318)
  })
})

describe('discounts', function() {
  // Story provided by Anne Voors:
  // A TTC graduate stays for 14 nights in a beach hut that they would like to share with another guest (stranger).
  // This graduate is taking Brahmaswaroop's "Dual path of yoga practice and Code writing" yoga course, which is 295 and 5 days long.
  // What will their folio balance be?!
  it('A TTC graduate staying 14 nights sharing a beach hut taking a 4 day course for $295 during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACH_HUT_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(14, 'days'),
        roomDiscount: {type: DISCOUNT.PERCENT, value: 10},
        yvpDiscount: {type: DISCOUNT.PERCENT, value: 10}
      })],
      courses: [new Course({
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(4, 'days'),
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
  it('one adult staying in a beachfront deluxe for 10 nights, taking a 3 day course for $295 and a 4 day course for $295 during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(10, 'days')
      })],
      courses: [new Course({
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 5
        }
      }), new Course({
        tuition: 295,
        startDate: winter.clone().add(4, 'days'),
        endDate: winter.clone().add(8, 'days'),
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
  it('one adult staying in a tent for 25 nights taking a 3 day course for $195, a 4 day course for $295, and a 6 day course for $400 during the winter', function() {
    const calculator = new ReservationCalculator({
      adults: 1,
      stays: [new RoomStay({
        roomId: ROOM_ID.TENT_SPACE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(25, 'days')
      })],
      courses: [new Course({
        tuition: 195,
        startDate: winter.clone(),
        endDate: winter.clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }), new Course({
        tuition: 295,
        startDate: winter.clone().add(4, 'days'),
        endDate: winter.clone().add(8, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }), new Course({
        tuition: 400,
        startDate: winter.clone().add(9, 'days'),
        endDate: winter.clone().add(15, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      })]
    })
    expect(calculator.getGrandTotal()).toEqual(2539)
    expect(calculator.getTotalNumberOfNights()).toEqual(25)
  })
})

describe('TTC', function() {
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

