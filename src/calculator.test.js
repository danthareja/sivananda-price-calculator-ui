import moment from 'moment'
import calculator from './calculator'
import { ROOM_ID } from './data/constants'

test('during the winter, two friends staying 5 nights in a beachfront deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 2,
    stays: [{
      roomId: ROOM_ID.BEACHFRONT,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(5, 'days')
    }]
  })
  expect(rates.room).toEqual(1590)
  expect(rates.yvp).toEqual(320)
  expect(rates.total).toEqual(1910)
  expect(ratesWithVAT.total).toEqual(2053.25)
})

test('during the winter, one person staying 4 nights in a garden room single', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_SINGLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(4, 'days')
    }]
  })
  expect(rates.room).toEqual(532)
  expect(rates.yvp).toEqual(128)
  expect(rates.total).toEqual(660)
  expect(ratesWithVAT.total).toEqual(709.50)
})

test('during the winter, one person staying 3 nights in a ocean view deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 1,
    stays: [{
      roomId: ROOM_ID.OCEAN_VIEW,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(3, 'days')
    }]
  })
  expect(rates.room).toEqual(882)
  expect(rates.yvp).toEqual(96)
  expect(rates.total).toEqual(978)
  expect(ratesWithVAT.total).toEqual(1051.35)
})

test('during the winter, one person staying 8 nights in a garden room double bed', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 1,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(8, 'days')
    }]        
  })
  expect(rates.room).toEqual(1040)
  expect(rates.yvp).toEqual(256)
  expect(rates.total).toEqual(1296)
  expect(ratesWithVAT.total).toEqual(1393.20)
})

test('during the winter, a couple staying 15 nights in a garden room double bed', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 2,
    stays: [{
      roomId: ROOM_ID.GARDEN_DOUBLE,
      checkInDate: checkInDate.clone(),
      checkOutDate: checkInDate.clone().add(15, 'days')
    }]
  })
  expect(rates.room).toEqual(3030)
  expect(rates.yvp).toEqual(960)
  expect(rates.total).toEqual(3990)
  expect(ratesWithVAT.total).toEqual(4289.25)
})

test('during the winter, one person staying 10 nights in a beachfront deluxe, registered for a course from day 3-7 that has a tuition of $250', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
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
  expect(rates.room).toEqual(2960)
  expect(rates.yvp).toEqual(128)
  expect(rates.course).toEqual(250)
  expect(rates.total).toEqual(3338)
  expect(ratesWithVAT.total).toEqual(3588.35)
})

test('during the winter, one person staying 12 nights, alone in beachfront deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
    guests: 1,
    stays: [{
      roomId: ROOM_ID.BEACHFRONT,
      checkInDate: checkInDate,
      checkOutDate: checkInDate.clone().add(12, 'days')
    }]
  })
  expect(rates.total).toEqual(3936)
  expect(ratesWithVAT.total).toEqual(4231.20)
})

test('during the winter, one person staying 2 nights alone in a garden room double bed and 3 nights alone in a oceanview deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
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
  expect(rates.total).toEqual(1318)
  expect(ratesWithVAT.total).toEqual(1416.85)
})

test('during the winter, one person staying 4 nights alone in a garden room double bed and 5 nights alone in a oceanview deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
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
  expect(rates.total).toEqual(2178)
  expect(ratesWithVAT.total).toEqual(2341.35)
})

test('during the winter, one person staying 4 nights sharing a garden room and 5 nights alone in a oceanview deluxe', function() {
  const checkInDate = moment()
  const { rates, ratesWithVAT } = calculator({
    season: 'winter',
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
  expect(rates.total).toEqual(2082)
  expect(ratesWithVAT.total).toEqual(2238.15)
})
