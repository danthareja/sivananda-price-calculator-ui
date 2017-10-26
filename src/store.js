import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger';

import rootReducer from './reducers'

export const logger = createLogger()

const initialState = {}
const enhancers = []
const middleware = [
  logger
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