import qs from 'qs'
import SivanandaPriceCalculator from 'sivananda-price-calculator'

import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger';

import urlHashSync from './enhancers'
import rootReducer from './reducers'

const hash = qs.parse(location.href.split('#')[1])

const initialState = {
  error: '',
  adults: Number(hash.adults) || 1,
  children: Number(hash.children) || 0,
  stays: hash.stays || [],
  courses: hash.courses || [],
  data: {
    rooms: SivanandaPriceCalculator.getRooms(),
    seasons: SivanandaPriceCalculator.getSeasons(),
    ttc: SivanandaPriceCalculator.getTTC()
  },
}

const enhancers = [
  urlHashSync({
    adults: {
      selector: state => state.adults
    },
    children: {
      selector: state => state.children
    },
    stays: {
      selector: state => state.stays
    },
    courses: {
      selector: state => state.courses
    }
  })
]

const middleware = [
  createLogger()
]

if (process.env.NODE_ENV === 'development') {
  if (typeof window.devToolsExtension === 'function') {
    enhancers.push(window.devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store