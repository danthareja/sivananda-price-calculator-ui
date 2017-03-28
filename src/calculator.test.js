import moment from './lib/moment'
import { ROOM_ID, DISCOUNT } from './data/constants'
import calculator from './calculator'

const winter = moment('2016-11-20').startOf('day').hour(12)
const summer = moment('2017-07-01').startOf('day').hour(12)

describe('stays with one person', function() {
  it('one person staying 3 nights in a ocean view deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(882)
    expect(withoutVAT.yvp).toEqual(96)
    expect(withoutVAT.total).toEqual(978)
    expect(withVAT.total).toEqual(1051.35)
  })


  it('one person staying 3 nights in a ocean view deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(3, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(774)
    expect(withoutVAT.yvp).toEqual(60)
    expect(withoutVAT.total).toEqual(834)
    expect(withVAT.total).toEqual(896.55)
  })

  it('one person staying 4 nights in a garden room single during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(532)
    expect(withoutVAT.yvp).toEqual(128)
    expect(withoutVAT.total).toEqual(660)
    expect(withVAT.total).toEqual(709.50)
  })


  it('one person staying 4 nights in a garden room single during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(464)
    expect(withoutVAT.yvp).toEqual(80)
    expect(withoutVAT.total).toEqual(544)
    expect(withVAT.total).toEqual(584.80)
  })

  it('one person staying 8 nights in a garden room double bed during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(8, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1040)
    expect(withoutVAT.yvp).toEqual(256)
    expect(withoutVAT.total).toEqual(1296)
    expect(withVAT.total).toEqual(1393.20)
  })

  it('one person staying 8 nights in a garden room double bed during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(8, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(864)
    expect(withoutVAT.yvp).toEqual(160)
    expect(withoutVAT.total).toEqual(1024)
    expect(withVAT.total).toEqual(1100.80)
  })

  it('one person staying 12 nights in beachfront deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(3552)
    expect(withoutVAT.yvp).toEqual(384)
    expect(withoutVAT.total).toEqual(3936)
    expect(withVAT.total).toEqual(4231.20)
  })

  it('one person staying 12 nights in beachfront deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(3072)
    expect(withoutVAT.yvp).toEqual(240)
    expect(withoutVAT.total).toEqual(3312)
    expect(withVAT.total).toEqual(3560.40)
  })
})

describe('stays with multiple people', function() {
  it('two friends staying 5 nights in a beachfront deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 2,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(5, 'days')
      }]
    })

    expect(withoutVAT.room).toEqual(1590)
    expect(withoutVAT.yvp).toEqual(320)
    expect(withoutVAT.total).toEqual(1910)
    expect(withVAT.total).toEqual(2053.25)
  })

  it('two friends staying 5 nights in a beachfront deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 2,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(5, 'days')
      }]
    })

    expect(withoutVAT.room).toEqual(680 * 2)
    expect(withoutVAT.yvp).toEqual(100 * 2)
    expect(withoutVAT.total).toEqual(1560)
    expect(withVAT.total).toEqual(1677)
  })

  it('a couple staying 15 nights in a garden room double bed during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 2,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(15, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(3030)
    expect(withoutVAT.yvp).toEqual(960)
    expect(withoutVAT.total).toEqual(3990)
    expect(withVAT.total).toEqual(4289.25)
  })

  it('a couple staying 15 nights in a garden room double bed during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 2,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(15, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(2640)
    expect(withoutVAT.yvp).toEqual(600)
    expect(withoutVAT.total).toEqual(3240)
    expect(withVAT.total).toEqual(3483)
  })
})

describe('stays with courses', function() {
  it('one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(10, 'days')
      }],
      courses: [{
        tuition: 250,
        startDate: winter.clone().add(3, 'days'),
        endDate: winter.clone().add(7, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(2960)
    expect(withoutVAT.yvp).toEqual(128)
    expect(withoutVAT.course).toEqual(250)
    expect(withoutVAT.total).toEqual(3338)
    expect(withVAT.total).toEqual(3588.35)
  })

  it('one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(10, 'days')
      }],
      courses: [{
        tuition: 250,
        startDate: summer.clone().add(3, 'days'),
        endDate: summer.clone().add(7, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(2560)
    expect(withoutVAT.yvp).toEqual(80)
    expect(withoutVAT.course).toEqual(250)
    expect(withoutVAT.total).toEqual(2890)
    expect(withVAT.total).toEqual(3106.75)
  })

  // Two best friends decide to ditch Atlantis because they hear about our Thai yoga Massage Workshop...THE Kam Thye Chow?!?
  // They are sharing a garden room with bath and staying at the ashram for a total of 7 nights.
  // The workshop is a course that is $295 and 3 days long. No prob ladies!
  it('two friends staying 7 nights sharing a garden room bath taking a 3 day course for $295 during the winter', function() {
    const { perGuestWithVAT, withVAT } = calculator({
      guests: 2,
      stays: [{
        roomId: ROOM_ID.GARDEN_BATH,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(7, 'days')
      }],
      courses: [{
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(3, 'days')
      }]
    })
    // Anne's calculations: $1,391.05 per person or $2,782.18 total
    expect(perGuestWithVAT.total).toEqual(1391.05)
    expect(withVAT.total).toEqual(2782.10)
  })

})

describe('stays with room sharing', function() {
  it('one person staying 12 nights sharing a beachfront deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1776)
    expect(withoutVAT.yvp).toEqual(384)
    expect(withoutVAT.total).toEqual(2160)
    expect(withVAT.total).toEqual(2322)
  })

  it('one person staying 12 nights sharing in beachfront deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1536)
    expect(withoutVAT.yvp).toEqual(240)
    expect(withoutVAT.total).toEqual(1776)
    expect(withVAT.total).toEqual(1909.20)
  })
})

describe('stays with room moves', function() {
  it('one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(2, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(2, 'days'),
        checkOutDate: winter.clone().add(5, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1158)
    expect(withoutVAT.yvp).toEqual(160)
    expect(withoutVAT.total).toEqual(1318)
    expect(withVAT.total).toEqual(1416.85)
  })

  it('one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(2, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(2, 'days'),
        checkOutDate: summer.clone().add(5, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1006)
    expect(withoutVAT.yvp).toEqual(100)
    expect(withoutVAT.total).toEqual(1106)
    expect(withVAT.total).toEqual(1188.95)
  })

  it('one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(4, 'days'),
        checkOutDate: winter.clone().add(9, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1890)
    expect(withoutVAT.yvp).toEqual(288)
    expect(withoutVAT.total).toEqual(2178)
    expect(withVAT.total).toEqual(2341.35)
  })

  it('one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(4, 'days'),
        checkOutDate: summer.clone().add(9, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1642)
    expect(withoutVAT.yvp).toEqual(180)
    expect(withoutVAT.total).toEqual(1822)
    expect(withVAT.total).toEqual(1958.65)
  })

  it('one person staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the winter', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone().add(4, 'days'),
        checkOutDate: winter.clone().add(9, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1794)
    expect(withoutVAT.yvp).toEqual(288)
    expect(withoutVAT.total).toEqual(2082)
    expect(withVAT.total).toEqual(2238.15)
  })

  it('one person staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the summer', function() {
    const { withoutVAT, withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SHARED_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }, {
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone().add(4, 'days'),
        checkOutDate: summer.clone().add(9, 'days')
      }]
    })
    expect(withoutVAT.room).toEqual(1582)
    expect(withoutVAT.yvp).toEqual(180)
    expect(withoutVAT.total).toEqual(1762)
    expect(withVAT.total).toEqual(1894.15)
  })
})

describe('stays with discounts', function() {
  // A TTC graduate stays for 14 nights in a beach hut that they would like to share with another guest (stranger).
  // This graduate is taking Brahmaswaroop's "Dual path of yoga practice and Code writing" yoga course, which is 295 and 5 days long.
  // What will their folio balance be?!
  // Note: TTC graduates get 10% off gross.
  it('A TTC graduate staying 14 nights sharing a beach hut taking a 4 day course for $295 during the winter', function() {
    const { withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACH_HUT_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(14, 'days')
      }],
      courses: [{
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(4, 'days')
      }],
      discount: {
        type: DISCOUNT.PERCENT,
        value: 10
      }
    })
    // Anne's calculation: $2,081.10
    expect(withVAT.total).toEqual(2081.0925)
  })

  // A burnt out Wall Street worker has decided to vacay on "da islands".
  // She chooses to stay in a beachfront deluxe room for 10 nights,
  // but also signs up for two courses and pays in full upon arrival.
  // The first course is "Power of Playing Violin like a real Yogi" by beloved Iswara Chaitanya
  // and the second is "Taking Yoga to Work With You".
  // Each course is $295 each and the first one is 3 days while the second is 4 days.
  // Can this economic guru trade her briefcase for some mala beads?
  // Note: 2 courses signed up for upon arrival and paid are 5% off each.
  // Note: Assuming at least 1 day between courses
  it('one person staying in a beachfront deluxe for 10 nights, taking a 3 day course for $295 and a 4 day course for $295 during the winter', function() {
    const { withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(10, 'days')
      }],
      courses: [{
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 5
        }
      }, {
        tuition: 295,
        startDate: winter.clone().add(4, 'days'),
        endDate: winter.clone().add(8, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 5
        }
      }]
    })
    // Anne's calculations: $3,818.94
    expect(withVAT.total).toEqual(3818.9375)
  })

  // A young hippy is looking for a chance to learn some new things.
  // He is staying in his own tent for 25 nights and taking three courses.
  // All of which he was registered for before he arrived and paid in full upon arrival.
  // Essentials 1 is 3 days and $195, Essentials 2 is 4 days and $295, then Essentials 3 is $400 and 6 days.
  // Note: 3 courses signed up for upon arrival and paid for are 10% off each.
  // Note: Assuming at least 1 day between courses
  it('one person staying in a tent for 25 nights taking a 3 day course for $195, a 4 day course for $295, and a 6 day course for $400 during the winter', function() {
    const { withVAT } = calculator({
      guests: 1,
      stays: [{
        roomId: ROOM_ID.TENT_SPACE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(25, 'days')
      }],
      courses: [{
        tuition: 195,
        startDate: winter.clone(),
        endDate: winter.clone().add(3, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }, {
        tuition: 295,
        startDate: winter.clone().add(4, 'days'),
        endDate: winter.clone().add(8, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }, {
        tuition: 400,
        startDate: winter.clone().add(9, 'days'),
        endDate: winter.clone().add(15, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 10
        }
      }]
    })
    // Anne's calculations: $2,729.43
    expect(withVAT.total).toEqual(2729.425)
  })
})

describe('stays with TTC', function() {
  // A guest arrives on March 23rd and is planning on departing March 30th, staying in a beloved north tent hut.
  // While at the ashram, for obvious reasons, they fall in love with Sivananda yoga
  // and feel it is their duty to become a teacher to share this energy with others (WOW 😮)!!
  // They would like to join the TTC beginning March 31 and ending April 30.
  // How much will their total be? - Anne's calculation: $4,519.30

})