// baseRateByOccupancy is the room's price per night per guest,
// which may change depending on the total number of guests in the room
// historically, these are called "single occupancy" and "double occupancy" rates
//   ex. Two guests staying in a beachfront deluxe would each pay baseRateByOccupancy[2]
//   ex. Three guests staying in a ocean view deluxe would each pay baseRateByOccupancy[3]

// A (sharing) room is a single bed booked in a room that can hold more than one person

import { ROOM_ID } from './constants'

export default [
  {
    id: ROOM_ID.BEACHFRONT,
    label: 'Beachfront Deluxe Suite',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [318, 296, 282, 272],
        2: [159, 148, 141, 136],
        3: [159, 148, 141, 136],
        4: [159, 148, 141, 136]
      }
    }
  },
  {
    id: ROOM_ID.OCEAN_VIEW,
    label: 'Ocean View Deluxe',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [294, 274, 260, 250],
        2: [147, 137, 130, 125],
        3: [147, 137, 130, 125],
        4: [147, 137, 130, 125]
      }
    }
  },
  {
    id: ROOM_ID.BEACH_HUT,
    label: 'Beach Hut',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [254, 238, 224, 216],
        2: [127, 119, 122, 108],
        3: [127, 119, 122, 108],
        4: [127, 119, 122, 108]
      }
    }
  },
  {
    id: ROOM_ID.BEACH_HUT_SHARING,
    label: 'Beach Hut (sharing)',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [127, 119, 122, 108]
      }
    }
  },
  {
    id: ROOM_ID.GARDEN_BATH,
    label: 'Garden Room with Bath',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [276, 258, 244, 234],
        2: [138, 129, 122, 117],
        3: [138, 129, 122, 117],
        4: [138, 129, 122, 117]
      }
   }
  },
  {
    id: ROOM_ID.GARDEN_BATH_SHARING,
    label: 'Garden Room with Bath (sharing)',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [138, 129, 122, 117]
      }
   }
  },
  {
    id: ROOM_ID.GARDEN_DOUBLE,
    label: 'Garden Room Double Bed',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [138, 130, 124, 118],
        2: [112, 106, 101, 97],
        3: [112, 106, 101, 97],
        4: [112, 106, 101, 97]
      }
    }
  },
  {
    id: ROOM_ID.GARDEN_SINGLE,
    label: 'Garden Room Single',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [133, 125, 119, 113]
      }
    }
  },
  {
    id: ROOM_ID.GARDEN_SHARED,
    label: 'Garden Room Shared (alone)',
    maxOccupancy: 4,
    baseRateByOccupancy: {
      winter: {
        1: [224, 212, 202, 194],
        2: [112, 106, 101, 97],
        3: [112, 106, 101, 97],
        4: [112, 106, 101, 97]
      }
    }
  },
  {
    id: ROOM_ID.GARDEN_SHARED_SHARING,
    label: 'Garden Room Shared (sharing)',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [112, 106, 101, 97]
      }
    }
  },
  {
    id: ROOM_ID.BED_IN_DORMITORY,
    label: 'Bed in Dormitory',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [80, 75, 71, 69],
      }
    }
  },
  {
    id: ROOM_ID.TENT_HUT,
    label: 'Tent Hut',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [82, 77, 73, 70],
      }
    }
  },
  {
    id: ROOM_ID.TENT_SPACE,
    label: 'Tent Space',
    maxOccupancy: 1,
    baseRateByOccupancy: {
      winter: {
        1: [69, 64, 61, 58],
      }
    }
  }
]

