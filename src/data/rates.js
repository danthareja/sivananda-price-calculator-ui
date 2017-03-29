import _ from 'lodash'
import { ROOM_ID, SEASON, DISCOUNT } from './constants'

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
      alone: [318, 296, 282, 272],
      sharing: [159, 148, 141, 136],
    },
    [SEASON.SUMMER]: {
      alone: [272, 256, 242, 232],
      sharing: [136, 128, 121, 116],
    }
  },
  [ROOM_ID.BEACHFRONT_SHARING]: {
    [SEASON.WINTER]: {
      alone: [159, 148, 141, 136]
    },
    [SEASON.SUMMER]: {
      alone: [136, 128, 121, 116]
    }
  },
  [ROOM_ID.OCEAN_VIEW]: {
    [SEASON.WINTER]: {
      alone: [294, 274, 260, 250],
      sharing: [147, 137, 130, 125],
    },
    [SEASON.SUMMER]: {
      alone: [258, 242, 228, 218],
      sharing: [129, 121, 114, 109],
    }
  },
  [ROOM_ID.OCEAN_VIEW_SHARING]: {
    [SEASON.WINTER]: {
      alone: [147, 137, 130, 125]
    },
    [SEASON.SUMMER]: {
      alone: [129, 121, 114, 109]
    }
  },
  [ROOM_ID.BEACH_HUT]: {
    [SEASON.WINTER]: {
      alone: [254, 238, 224, 216],
      sharing: [127, 119, 112, 108],
    },
    [SEASON.SUMMER]: {
      alone: [218, 204, 194, 186],
      sharing: [109, 102, 97, 93],
    }
  },
  [ROOM_ID.BEACH_HUT_SHARING]:{
    [SEASON.WINTER]: {
      alone: [127, 119, 112, 108]
    },
    [SEASON.SUMMER]: {
      alone: [109, 102, 97, 93]
    }
  },
  [ROOM_ID.GARDEN_BATH]: {
    [SEASON.WINTER]: {
      alone: [276, 258, 244, 234],
      sharing: [138, 129, 122, 117],
    },
    [SEASON.SUMMER]: {
      alone: [242, 226, 214, 206],
      sharing: [121, 113, 107, 103],
    }
  },
  [ROOM_ID.GARDEN_BATH_SHARING]: {
    [SEASON.WINTER]: {
      alone: [138, 129, 122, 117]
    },
    [SEASON.SUMMER]: {
      alone: [121, 113, 107, 103]
    }
  },
  [ROOM_ID.GARDEN_DOUBLE]: {
    [SEASON.WINTER]: {
      alone: [138, 130, 124, 118],
      sharing: [112, 106, 101, 97],
    },
    [SEASON.SUMMER]: {
      alone: [116, 108, 103, 99],
      sharing: [99, 93, 88, 84],
    }
  },
  [ROOM_ID.GARDEN_SINGLE]:  {
    [SEASON.WINTER]: {
      alone: [133, 125, 119, 113]
    },
    [SEASON.SUMMER]: {
      alone: [116, 108, 103, 99]
    }
  },
  [ROOM_ID.GARDEN_SHARED]: {
    [SEASON.WINTER]: {
      alone: [224, 212, 202, 194],
      sharing: [112, 106, 101, 97],
    },
    [SEASON.SUMMER]: {
      alone: [198, 186, 176, 168],
      sharing: [99, 93, 88, 84],
    }
  },
  [ROOM_ID.GARDEN_SHARED_SHARING]: {
    [SEASON.WINTER]: {
      alone: [112, 106, 101, 97]
    },
    [SEASON.SUMMER]: {
      alone: [99, 93, 88, 84]
    }
  },
  [ROOM_ID.BED_IN_DORMITORY]: {
    [SEASON.WINTER]: {
      alone: [80, 75, 71, 69]
    },
    [SEASON.SUMMER]: {
      alone: [83, 77, 73, 70]
    }
  },
  [ROOM_ID.TENT_HUT]: {
    [SEASON.WINTER]: {
      alone: [82, 77, 73, 70]
    }
  },
  [ROOM_ID.TENT_SPACE]: {
    [SEASON.WINTER]: {
      alone: [69, 64, 61, 58]
    }
  },
  [ROOM_ID.NULL_ROOM]: {
    [SEASON.WINTER]: {
      alone: [0, 0, 0, 0],
      sharing: [0, 0, 0, 0],
    },
    [SEASON.SUMMER]: {
      alone: [0, 0, 0, 0],
      sharing: [0, 0, 0, 0],
    }
  }
}

export function addVAT (price) {
  if (!_.isNumber(price)) {
    throw new Error(`Expected "${price}" to be a number`)
  }
  return price + ( price * VAT )
}

export function calculateDiscount(price, discount) {
  if (!_.isObject(discount)) {
    return 0
  }
  switch (discount.type) {
    case DISCOUNT.PERCENT:
      return price * (discount.value / 100)
    case DISCOUNT.FIXED:
      return discount.value
    default:
      return 0
  }
}

export function applyDiscount(price, discount) {
  if (!_.isObject(discount)) {
    return price
  }
  return price - calculateDiscount(price, discount)
}

export function getYVPRate(season) {
  if (!_.has(YVP, season)) {
    throw new Error(`No YVP rate for season: ${season}. Valid seasons are ${_.join(_.keys(YVP), ', ')}`)
  }
  return YVP[season]
}

export function getRoomRate(id, season, isAloneInRoom, nights) {
  if (!_.has(ROOMS, id)) {
    throw new Error(`No rates for roomId: "${id}". Valid roomIds are ${_.join(_.keys(ROOMS), ', ')}`)
  }

  if (!_.has(ROOMS[id], season)) {
    throw new Error(`roomId "${id}" does not have a rate for season: "${season}". Valid seasons are ${_.join(_.keys(ROOMS[id]), ', ')}`)
  }

  if (!_.gt(nights, 0)) {
    throw new Error(`Number of nights must be an integer greater than 0`)
  }

  if (nights <= 6) { return ROOMS[id][season][isAloneInRoom ? 'alone' : 'sharing'][0] }
  if (nights <= 13) { return ROOMS[id][season][isAloneInRoom ? 'alone' : 'sharing'][1] }
  if (nights <= 20) { return ROOMS[id][season][isAloneInRoom ? 'alone' : 'sharing'][2] }
  if (nights >= 21) { return ROOMS[id][season][isAloneInRoom ? 'alone' : 'sharing'][3] }
}
