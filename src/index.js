import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import SivanandaPriceCalculator from 'sivananda-price-calculator'

import App from './components/App'
import createStore from './store'
import './index.css'

// Needed for Materialize UI's onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const store = createStore({
  ui: {
    error: {
      message: '',
      show: false
    },
    guests: {
      adults: 1,
      children: 0
    },
    stays: [],
    courses: []
  },
  data: {
    rooms: SivanandaPriceCalculator.getRooms(),
    seasons: _.map(SivanandaPriceCalculator.getSeasons(), season => {
      return _.defaults({
        startDate: moment(season.startDate).startOf('day'),
        endDate: moment(season.endDate).startOf('day')
      }, season)
    }),
    ttc: _.flatMap(SivanandaPriceCalculator.getTTC(), session =>
      _.map(session.prices.rooms, (price, roomId) => {
        return {
          roomId: roomId,
          label: session.label,
          checkInDate: moment(session.checkInDate).startOf('day'),
          checkOutDate: moment(session.checkOutDate).startOf('day')
        }
      })
    )
  }
})

ReactDOM.render(
  <MuiThemeProvider>
    <App/>
  </MuiThemeProvider>,
  document.getElementById('root')
)
