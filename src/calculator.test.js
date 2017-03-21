import moment from './lib/moment'
import { ROOM_ID } from './data/constants'
import calculator from './calculator'

it('two friends staying 5 nights in a beachfront deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 2,
    stays: [{
      roomId: ROOM_ID.BEACHFRONT,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(5, 'days')
    }]
  })

  expect(withoutVAT.room).toEqual(1590)
  expect(withoutVAT.yvp).toEqual(320)
  expect(withoutVAT.total).toEqual(1910)
  expect(withVAT.total).toEqual(2053.25)
})

it('one person staying 4 nights in a garden room single during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_SINGLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(4, 'days')
    }]
  })
  expect(withoutVAT.room).toEqual(532)
  expect(withoutVAT.yvp).toEqual(128)
  expect(withoutVAT.total).toEqual(660)
  expect(withVAT.total).toEqual(709.50)
})

it('one person staying 3 nights in a ocean view deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.OCEAN_VIEW,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(3, 'days')
    }]
  })
  expect(withoutVAT.room).toEqual(882)
  expect(withoutVAT.yvp).toEqual(96)
  expect(withoutVAT.total).toEqual(978)
  expect(withVAT.total).toEqual(1051.35)
})

it('one person staying 8 nights in a garden room double bed during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(8, 'days')
    }]
  })
  expect(withoutVAT.room).toEqual(1040)
  expect(withoutVAT.yvp).toEqual(256)
  expect(withoutVAT.total).toEqual(1296)
  expect(withVAT.total).toEqual(1393.20)
})

it('a couple staying 15 nights in a garden room double bed during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 2,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(15, 'days')
    }]
  })
  expect(withoutVAT.room).toEqual(3030)
  expect(withoutVAT.yvp).toEqual(960)
  expect(withoutVAT.total).toEqual(3990)
  expect(withVAT.total).toEqual(4289.25)
})

it('one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250 during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.BEACHFRONT,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(10, 'days')
    }],
    courses: [{
      tuition: 250,
      startDate: checkInDate.clone().add(3, 'days'),
      endDate: checkInDate.clone().add(7, 'days')
    }]
  })
  expect(withoutVAT.room).toEqual(2960)
  expect(withoutVAT.yvp).toEqual(128)
  expect(withoutVAT.course).toEqual(250)
  expect(withoutVAT.total).toEqual(3338)
  expect(withVAT.total).toEqual(3588.35)
})

it('one person staying 12 nights, alone in beachfront deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.BEACHFRONT,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(12, 'days')
    }]
  })
  expect(withoutVAT.total).toEqual(3936)
  expect(withVAT.total).toEqual(4231.20)
})

it('one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(2, 'days')
    }, {
      roomId: ROOM_ID.OCEAN_VIEW,
      checkInDate: checkInDate.clone().add(2, 'days'),
      checkOutDate: checkInDate.clone().add(5, 'days')
    }]
  })
  expect(withoutVAT.total).toEqual(1318)
  expect(withVAT.total).toEqual(1416.85)
})

it('one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(4, 'days')
    }, {
      roomId: ROOM_ID.OCEAN_VIEW,
      checkInDate: checkInDate.clone().add(4, 'days'),
      checkOutDate: checkInDate.clone().add(9, 'days')
    }]
  })
  expect(withoutVAT.total).toEqual(2178)
  expect(withVAT.total).toEqual(2341.35)
})

it('one person staying 4 nights sharing a garden room and 5 nights alone in a oceanview deluxe during the winter', function() {
  const checkInDate = moment()
  const { withoutVAT, withVAT } = calculator({
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_SHARED_SHARING,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(4, 'days')
    }, {
      roomId: ROOM_ID.OCEAN_VIEW,
      checkInDate: checkInDate.clone().add(4, 'days'),
      checkOutDate: checkInDate.clone().add(9, 'days')
    }]
  })
  expect(withoutVAT.total).toEqual(2082)
  expect(withVAT.total).toEqual(2238.15)
})
