import _ from 'lodash'
import { ROOM_ID } from './constants'

// ** Add new rooms here.

// id: A unique identifier.
// label: Display text for the UI.
//   A (sharing) prefix represents a reservation for a single bed
//   in a room that can be shared between multiple guests
// maxOccupancy: The maximum number of guests allowed.

const rooms = [
  {
    id: ROOM_ID.BEACHFRONT,
    label: 'Beachfront Deluxe Suite (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.BEACHFRONT_SHARING,
    label: 'Beachfront Deluxe Suite (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.OCEAN_VIEW,
    label: 'Ocean View Deluxe (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.OCEAN_VIEW_SHARING,
    label: 'Ocean View Deluxe (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.BEACH_HUT,
    label: 'Beach Hut (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.BEACH_HUT_SHARING,
    label: 'Beach Hut (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.GARDEN_BATH,
    label: 'Garden Room with Bath (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.GARDEN_BATH_SHARING,
    label: 'Garden Room with Bath (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.GARDEN_DOUBLE,
    label: 'Garden Room Double Bed (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.GARDEN_DOUBLE_SHARING,
    label: 'Garden Room Double Bed (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.GARDEN_SINGLE,
    label: 'Garden Room Single',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.GARDEN_SHARED,
    label: 'Garden Room Shared (whole)',
    maxOccupancy: 4
  },
  {
    id: ROOM_ID.GARDEN_SHARED_SHARING,
    label: 'Garden Room Shared (sharing)',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.BED_IN_DORMITORY,
    label: 'Bed in Dormitory',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.TENT_HUT,
    label: 'Tent Hut',
    maxOccupancy: 2
  },
  {
    id: ROOM_ID.TENT_SPACE,
    label: 'Tent Space',
    maxOccupancy: 1
  },
  {
    id: ROOM_ID.NULL_ROOM,
    label: 'No Room (only yvp)',
    maxOccupancy: 4
  }
]

export function getRoomById(id) {
  const room =  _.find(rooms, _.matchesProperty('id', id))

  if (!room) {
    throw new Error(`Could not find a room with id: ${id}`)
  }

  return room
}

export function filterRoomsByOccupancy(occupancy) {
  return _.filter(rooms, room => occupancy <= room.maxOccupancy)
}

