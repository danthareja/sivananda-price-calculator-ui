import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './App'
import './index.css'

// Needed for Materialize UI's onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

// Wrapper for Materialize UI
/// http://www.material-ui.com/#/get-started/usage
const Wrapper = () =>  (
  <MuiThemeProvider>
    <App/>
  </MuiThemeProvider>
)

ReactDOM.render(
  <Wrapper/>,
  document.getElementById('root')
)
