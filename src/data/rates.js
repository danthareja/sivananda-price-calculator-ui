import _ from 'lodash'
import { ROOM_ID, SEASON } from './constants'

// Bahamas' Value Added Tax rate

const VAT = 0.075

// Yoga Vacation Program fee which depends on season

const YVP = {
  [SEASON.WINTER]: 32,
  [SEASON.SUMMER]: 20
}

// ** Add new room rates here.

// Room base rate per night per guest which depends on season, and number of guests
// Each room must include keys from 1 to maxOccupancy (defined in ./rooms.js)
//   ex. Two guests in a beachfront deluxe during the summer would each pay
//       ROOMS[ROOM_ID.BEACHFRONT][SEASON.SUMMER][2]

const ROOMS = {
  [ROOM_ID.BEACHFRONT]: {
    [SEASON.WINTER]: {
      1: [318, 296, 282, 272],
      2: [159, 148, 141, 136],
      3: [159, 148, 141, 136],
      4: [159, 148, 141, 136]
    },
    [SEASON.SUMMER]: {
      1: [272, 256, 242, 232],
      2: [136, 128, 121, 116],
      3: [136, 128, 121, 116],
      4: [136, 128, 121, 116]
    }
  },
  [ROOM_ID.OCEAN_VIEW]: {
    [SEASON.WINTER]: {
      1: [294, 274, 260, 250],
      2: [147, 137, 130, 125],
      3: [147, 137, 130, 125],
      4: [147, 137, 130, 125]
    },
    [SEASON.SUMMER]: {
      1: [272, 256, 242, 232],
      2: [136, 128, 121, 116],
      3: [136, 128, 121, 116],
      4: [136, 128, 121, 116]
    }
  },
  [ROOM_ID.BEACH_HUT]: {
    [SEASON.WINTER]: {
      1: [254, 238, 224, 216],
      2: [127, 119, 122, 108],
      3: [127, 119, 122, 108],
      4: [127, 119, 122, 108]
    },
    [SEASON.SUMMER]: {
      1: [218, 204, 194, 186],
      2: [109, 102, 97, 93],
      3: [109, 102, 97, 93],
      4: [109, 102, 97, 93]
    }
  },
  [ROOM_ID.BEACH_HUT_SHARING]:{
    [SEASON.WINTER]: {
      1: [127, 119, 122, 108]
    },
    [SEASON.SUMMER]: {
      1: [109, 102, 97, 93]
    }
  },
  [ROOM_ID.GARDEN_BATH]: {
    [SEASON.WINTER]: {
      1: [276, 258, 244, 234],
      2: [138, 129, 122, 117],
      3: [138, 129, 122, 117],
      4: [138, 129, 122, 117]
    },
    [SEASON.SUMMER]: {
      1: [242, 226, 214, 206],
      2: [121, 113, 107, 103],
      3: [121, 113, 107, 103],
      4: [121, 113, 107, 103]
    }
  },
  [ROOM_ID.GARDEN_BATH_SHARING]: {
    [SEASON.WINTER]: {
      1: [138, 129, 122, 117]
    },
    [SEASON.SUMMER]: {
      1: [121, 113, 107, 103]
    }
  },
  [ROOM_ID.GARDEN_DOUBLE]: {
    [SEASON.WINTER]: {
      1: [138, 130, 124, 118],
      2: [112, 106, 101, 97],
      3: [112, 106, 101, 97],
      4: [112, 106, 101, 97]
    },
    [SEASON.SUMMER]: {
      1: [116, 108, 103, 99],
      2: [99, 93, 88, 84],
      3: [99, 93, 88, 84],
      4: [99, 93, 88, 84]
    }
  },
  [ROOM_ID.GARDEN_SINGLE]:  {
    [SEASON.WINTER]: {
      1: [133, 125, 119, 113]
    },
    [SEASON.SUMMER]: {
      1: [116, 108, 103, 99]
    }
  },
  [ROOM_ID.GARDEN_SHARED]: {
    [SEASON.WINTER]: {
      1: [224, 212, 202, 194],
      2: [112, 106, 101, 97],
      3: [112, 106, 101, 97],
      4: [112, 106, 101, 97]
    },
    [SEASON.SUMMER]: {
      1: [198, 186, 176, 168],
      2: [99, 93, 88, 84],
      3: [99, 93, 88, 84],
      4: [99, 93, 88, 84]
    }
  },
  [ROOM_ID.GARDEN_SHARED_SHARING]: {
    [SEASON.WINTER]: {
      1: [112, 106, 101, 97]
    },
    [SEASON.SUMMER]: {
      1: [99, 93, 88, 84]
    }
  },
  [ROOM_ID.BED_IN_DORMITORY]: {
    [SEASON.WINTER]: {
      1: [80, 75, 71, 69]
    },
    [SEASON.SUMMER]: {
      1: [83, 77, 73, 70]
    }
  },
  [ROOM_ID.TENT_HUT]: {
    [SEASON.WINTER]: {
      1: [82, 77, 73, 70]
    }
  },
  [ROOM_ID.TENT_SPACE]: {
    [SEASON.WINTER]: {
      1: [69, 64, 61, 58]
    }
  },
  [ROOM_ID.NULL_ROOM]: {
    [SEASON.WINTER]: {
      1: [0, 0, 0, 0],
      2: [0, 0, 0, 0],
      3: [0, 0, 0, 0],
      4: [0, 0, 0, 0]
    },
    [SEASON.SUMMER]: {
      1: [0, 0, 0, 0],
      2: [0, 0, 0, 0],
      3: [0, 0, 0, 0],
      4: [0, 0, 0, 0]
    }
  }
}

export function getVATRate() {
  return VAT
}

export function addVAT (price) {
  if (!_.isNumber(price)) {
    return price
  }
  return price + (price * getVATRate())
}

export function getYVPRate(season) {
  if (!_.has(YVP, season)) {
    throw new Error(`No YVP rate for season: ${season}. Valid seasons are ${_.join(_.keys(YVP), ', ')}`)
  }
  return YVP[season]
}

export function getRoomRate(id, season, occupancy, nights) {
  if (!_.has(ROOMS, id)) {
    throw new Error(`No rates for roomId: "${id}". Valid roomIds are ${_.join(_.keys(ROOMS), ', ')}`)
  }

  if (!_.has(ROOMS[id], season)) {
    throw new Error(`roomId "${id}" does not have a rate for season: "${season}". Valid seasons are ${_.join(_.keys(ROOMS[id]), ', ')}`)
  }

  if (!_.has(ROOMS[id][season], occupancy)) {
    throw new Error(`roomId "${id}" cannot handle an occupancy of: "${occupancy}". Valid occupancies are ${_.join(_.keys(ROOMS[id][season]), ', ')}`)
  }

  if (!_.gt(nights, 0)) {
    throw new Error(`Number of nights must be an integer greater than 0`)
  }

  if (nights <= 6) { return ROOMS[id][season][occupancy][0] }
  if (nights <= 13) { return ROOMS[id][season][occupancy][1] }
  if (nights <= 20) { return ROOMS[id][season][occupancy][2] }
  if (nights >= 21) { return ROOMS[id][season][occupancy][3] }
}
