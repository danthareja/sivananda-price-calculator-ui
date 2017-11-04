import moment from 'moment'
import SivanandaPriceCalculator from 'sivananda-price-calculator'

const INITIAL_STATE = {
  error: '',
  adults: 1,
  children: 0,
  stays: [],
  courses: [],
  data: {
    rooms: SivanandaPriceCalculator.getRooms(),
    seasons: SivanandaPriceCalculator.getSeasons().map(season => {
      return Object.assign(season, {
        startDate: moment(season.startDate).startOf('day'),
        endDate: moment(season.endDate).startOf('day')
      })
    }),
    ttc: SivanandaPriceCalculator.getTTC().map(session => {
      return Object.assign(session, {
        checkInDate: moment(session.checkInDate).startOf('day'),
        checkOutDate: moment(session.checkOutDate).startOf('day'),
      })
    })
  }
}

export default function rootReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case 'UPDATE_GUESTS':
      return updateGuests(state, payload)
    case 'ADD_STAY':
      return addStay(state, payload)
    case 'UPDATE_STAY':
      return updateStay(state, payload)
    case 'REMOVE_STAY':
      return removeStay(state, payload)
    case 'ADD_COURSE':
      return addCourse(state, payload)
    case 'UPDATE_COURSE':
      return updateCourse(state, payload)
    case 'REMOVE_COURSE':
      return removeCourse(state, payload)
    case 'RESET_ERROR':
      return resetError(state, payload)
    default:
      return state
  }
}

function updateGuests(state, payload) {
  const { adults, children } = payload
  const guests = adults + children

  if (state.courses.length > 0) {
    return {
      ...state,
      error: 'Courses can only be added for a reservation with one adult. Please remove the courses before increasing guest count.',
    }
  }

  if (state.stays.filter(stay => stay.type === 'TTC') > 0 && guests > 1) {
    return {
      ...state,
      error: 'TTC stays can only be added for a reservation with one adult. Please remove the TTC stay before increasing guest count',
    }
  }

  const roomsOverOccupancy = state.stays
    .map(stay => state.data.rooms.find(room => stay.roomId === room.id))
    .filter(room => guests > room.maxOccupancy)
    .map(room => room.label)

  if (roomsOverOccupancy.length > 0) {
    return {
      ...state,
      error: `${roomsOverOccupancy.join(', ')} cannot have more than ${guests - 1} guests. Please change the room type or remove the stay before increasing guest count.`,
    }
  }

  return {
    ...state,
    adults: payload.adults,
    children: payload.children,
  }
}

function addStay(state, payload) {
  const { type } = payload;

  const previousStay = state.stays.length > 0
    ? state.stays[state.stays.length - 1]
    : null

  if (type === 'ROOM') {
    const previousCheckOutDate = previousStay
      ? previousStay.checkOutDate
      : moment().startOf('day')

    return {
      ...state,
      stays: state.stays.concat({
        type: type,
        roomId: 'BEACHFRONT',
        checkInDate: previousCheckOutDate,
        checkOutDate: previousCheckOutDate.clone().add(1, 'days'),
        roomDiscount: {
          type: 'PERCENT',
          value: 0
        },
        yvpDiscount: {
          type: 'PERCENT',
          value: 0
        }
      })
    }
  }

  if (type === 'TTC') {
    let session = state.data.ttc[0]

    // Try to find the closest session
    if (previousStay) {
      const nextSession = state.data.ttc.find(session => {
        return session.checkInDate.isAfter(previousStay.checkOutDate)
      })
      if (nextSession) {
        session = nextSession
      }
    }


    return {
      ...state,
      stays: state.stays.concat({
        type: type,
        ttcId: session.id,
        roomId: 'TENT_SPACE',
        checkInDate: session.checkInDate,
        checkOutDate: session.checkOutDate,
        roomDiscount: {
          type: 'PERCENT',
          value: 0
        },
        yvpDiscount: {
          type: 'PERCENT',
          value: 0
        }
      })
    }
  }

  return state
}

function updateStay(state, payload) {
  const { index, diff } = payload
  return {
    ...state,
    stays: [
      ...state.stays.slice(0, index),
      Object.assign({}, state.stays[index], diff),
      ...state.stays.slice(index + 1)
    ]
  }
}

function removeStay(state, payload) {
  const { index } = payload
  return {
    ...state,
    stays: [
      ...state.stays.slice(0, index),
      ...state.stays.slice(index + 1)
    ]
  }
}

function addCourse(state, payload) {
  const previousEndDate = state.courses.length > 0
    ? state.courses[state.courses.length - 1].endDate
    : state.stays.length > 0
      ? state.stays[0].checkInDate
      : moment().startOf('day')

  return {
    ...state,
    courses: state.courses.concat({
      tuition: 0,
      startDate: previousEndDate.clone(),
      endDate: previousEndDate.clone().add(1, 'days'),
      discount: {
        type: 'PERCENT',
        value: 0
      }
    })
  }
}

function updateCourse(state, payload) {
  const { index, diff } = payload
  return {
    ...state,
    courses: [
      ...state.courses.slice(0, index),
      Object.assign({}, state.courses[index], diff),
      ...state.courses.slice(index + 1)
    ]
  }
}

function removeCourse(state, payload) {
  const { index } = payload
  return {
    ...state,
    courses: [
      ...state.courses.slice(0, index),
      ...state.courses.slice(index + 1)
    ]
  }
}

function resetError(state) {
  return {
    ...state,
    error: '',
  }
}