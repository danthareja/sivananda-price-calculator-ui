import moment from './lib/moment'
import { ROOM_ID, DISCOUNT } from './data/constants'
import calculator from './calculator'

const winter = moment('2016-11-20').startOf('day').hour(12)
const summer = moment('2017-07-01').startOf('day').hour(12)

describe('stays with one person', function() {
  it('one person staying 3 nights in a ocean view deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 882)
    expect(rates).toHaveProperty('yvp', 96)
    expect(rates).toHaveProperty('total', 978)
  })


  it('one person staying 3 nights in a ocean view deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(3, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 774)
    expect(rates).toHaveProperty('yvp', 60)
    expect(rates).toHaveProperty('total', 834)
  })

  it('one person staying 4 nights in a garden room single during the winter', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(4, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 532)
    expect(rates).toHaveProperty('yvp', 128)
    expect(rates).toHaveProperty('total', 660)
  })


  it('one person staying 4 nights in a garden room single during the summer', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_SINGLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(4, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 464)
    expect(rates).toHaveProperty('yvp', 80)
    expect(rates).toHaveProperty('total', 544)
  })

  it('one person staying 8 nights in a garden room double bed during the winter', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(8, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1040)
    expect(rates).toHaveProperty('yvp', 256)
    expect(rates).toHaveProperty('total', 1296)
  })

  it('one person staying 8 nights in a garden room double bed during the summer', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(8, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 864)
    expect(rates).toHaveProperty('yvp', 160)
    expect(rates).toHaveProperty('total', 1024)
  })

  it('one person staying 12 nights in beachfront deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 3552)
    expect(rates).toHaveProperty('yvp', 384)
    expect(rates).toHaveProperty('total', 3936)
  })

  it('one person staying 12 nights in beachfront deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 3072)
    expect(rates).toHaveProperty('yvp', 240)
    expect(rates).toHaveProperty('total', 3312)
  })
})

describe('stays with multiple people', function() {
  it('two friends staying 5 nights in a beachfront deluxe during the winter', function() {
    const rates = calculator({
      adults: 2,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(5, 'days')
      }]
    })

    expect(rates).toHaveProperty('room', 1590)
    expect(rates).toHaveProperty('yvp', 320)
    expect(rates).toHaveProperty('total', 1910)
  })

  it('two friends staying 5 nights in a beachfront deluxe during the summer', function() {
    const rates = calculator({
      adults: 2,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(5, 'days')
      }]
    })

    expect(rates).toHaveProperty('room', 680 * 2)
    expect(rates).toHaveProperty('yvp', 100 * 2)
    expect(rates).toHaveProperty('total', 1560)
  })

  it('a couple staying 15 nights in a garden room double bed during the winter', function() {
    const rates = calculator({
      adults: 2,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(15, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 3030)
    expect(rates).toHaveProperty('yvp', 960)
    expect(rates).toHaveProperty('total', 3990)
  })

  it('a couple staying 15 nights in a garden room double bed during the summer', function() {
    const rates = calculator({
      adults: 2,
      stays: [{
        roomId: ROOM_ID.GARDEN_DOUBLE,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(15, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 2640)
    expect(rates).toHaveProperty('yvp', 600)
    expect(rates).toHaveProperty('total', 3240)
  })
})

describe('stays with courses', function() {
  it('one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the winter', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 2960)
    expect(rates).toHaveProperty('yvp', 128)
    expect(rates).toHaveProperty('course', 250)
    expect(rates).toHaveProperty('total', 3338)
  })

  it('one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the summer', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 2560)
    expect(rates).toHaveProperty('yvp', 80)
    expect(rates).toHaveProperty('course', 250)
    expect(rates).toHaveProperty('total', 2890)
  })

  // Two best friends decide to ditch Atlantis because they hear about our Thai yoga Massage Workshop...THE Kam Thye Chow?!?
  // They are sharing a garden room with bath and staying at the ashram for a total of 7 nights.
  // The workshop is a course that is $295 and 3 days long. No prob ladies!
  it('two friends staying 7 nights sharing a garden room bath taking a 3 day course for $295 starting the day of their arrival during the winter. The system\'s input for this case is individual calculations.', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.GARDEN_BATH_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(7, 'days')
      }],
      courses: [{
        tuition: 295,
        startDate: winter.clone(),
        endDate: winter.clone().add(2, 'days')
      }]
    })
    expect(rates).toHaveProperty('total', 1326)
  })
})

describe('stays with room sharing', function() {
  it('one person staying 12 nights sharing a beachfront deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(12, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1776)
    expect(rates).toHaveProperty('yvp', 384)
    expect(rates).toHaveProperty('total', 2160)
  })

  it('one person staying 12 nights sharing in beachfront deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT_SHARING,
        checkInDate: summer.clone(),
        checkOutDate: summer.clone().add(12, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1536)
    expect(rates).toHaveProperty('yvp', 240)
    expect(rates).toHaveProperty('total', 1776)
  })
})

describe('stays with room moves', function() {
  it('one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1158)
    expect(rates).toHaveProperty('yvp', 160)
    expect(rates).toHaveProperty('total', 1318)
  })

  it('one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1006)
    expect(rates).toHaveProperty('yvp', 100)
    expect(rates).toHaveProperty('total', 1106)
  })

  it('one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1890)
    expect(rates).toHaveProperty('yvp', 288)
    expect(rates).toHaveProperty('total', 2178)
  })

  it('one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1642)
    expect(rates).toHaveProperty('yvp', 180)
    expect(rates).toHaveProperty('total', 1822)
  })

  it('one person staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the winter', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1794)
    expect(rates).toHaveProperty('yvp', 288)
    expect(rates).toHaveProperty('total', 2082)
  })

  it('one person staying 4 nights sharing a garden room shared and 5 nights alone in a oceanview deluxe during the summer', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('room', 1582)
    expect(rates).toHaveProperty('yvp', 180)
    expect(rates).toHaveProperty('total', 1762)
  })
})

describe('stays with discounts', function() {
  // A TTC graduate stays for 14 nights in a beach hut that they would like to share with another guest (stranger).
  // This graduate is taking Brahmaswaroop's "Dual path of yoga practice and Code writing" yoga course, which is 295 and 5 days long.
  // What will their folio balance be?!
  // Note: TTC graduates get 10% off gross.
  it('A TTC graduate staying 14 nights sharing a beach hut taking a 4 day course for $295 during the winter', function() {
    const rates = calculator({
      adults: 1,
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
      grossDiscount: {
        type: DISCOUNT.PERCENT,
        value: 10
      }
    })
    expect(rates).toHaveProperty('total', 1935.9)
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
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('total', 3552.50)
  })

  // A young hippy is looking for a chance to learn some new things.
  // He is staying in his own tent for 25 nights and taking three courses.
  // All of which he was registered for before he arrived and paid in full upon arrival.
  // Essentials 1 is 3 days and $195, Essentials 2 is 4 days and $295, then Essentials 3 is $400 and 6 days.
  // Note: 3 courses signed up for upon arrival and paid for are 10% off each.
  // Note: Assuming at least 1 day between courses
  it('one person staying in a tent for 25 nights taking a 3 day course for $195, a 4 day course for $295, and a 6 day course for $400 during the winter', function() {
    const rates = calculator({
      adults: 1,
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
    expect(rates).toHaveProperty('total', 2539)
  })
})

describe('stays with TTC', function() {
  // A guest arrives on March 23rd and is planning on departing March 30th, staying in a beloved north tent hut.
  // While at the ashram, for obvious reasons, they fall in love with Sivananda yoga
  // and feel it is their duty to become a teacher to share this energy with others (WOW 😮)!!
  // They would like to join the TTC beginning March 31 and ending April 30.
  // How much will their total be? - Anne's calculation: $4,519.30

})

describe('stays with family', function() {
  it('one adult and one child staying in an oceanview room for three nights in winter', function() {
    const rates = calculator({
      adults: 1,
      children: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1323)
    expect(rates).toHaveProperty('yvp', 96)
    expect(rates).toHaveProperty('total', 1419)
  })

  it('two adults and one child staying in an oceanview room for three nights in winter', function() {
    const rates = calculator({
      adults: 2,
      children: 1,
      stays: [{
        roomId: ROOM_ID.OCEAN_VIEW,
        checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1102.5)
    expect(rates).toHaveProperty('yvp', 192)
    expect(rates).toHaveProperty('total', 1294.5)
  })
  it('two adults and two children staying in a beachfront deluxe suite for three nights in winter', function() {
    const rates = calculator({
      adults: 2,
      children: 2,
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
	checkInDate: winter.clone(),
        checkOutDate: winter.clone().add(3, 'days')
      }]
    })
    expect(rates).toHaveProperty('room', 1431)
    expect(rates).toHaveProperty('yvp', 192)
    expect(rates).toHaveProperty('total', 1623)
  })
})
