// Add tests for:
// 2. Winter -> Summer transition
// 3. Discounts

import moment from './lib/moment'
import { ROOM_ID } from './data/constants'
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
