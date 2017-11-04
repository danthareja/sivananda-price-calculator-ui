import React from 'react'
import { connect } from 'react-redux'

import Snackbar from 'material-ui/Snackbar'

function ErrorMessage (props) {
  const styles = {
    container: { width: '100%'},
    body: { maxWidth: '100%', minWidth: '100%', padding: '0px', backgroundColor: '#d50000' },
    content: { textAlign: 'center' }
  }

  return (
    <Snackbar
      open={Boolean(props.error)}
      message={props.error}
      onRequestClose={props.resetError}
      style={styles.container}
      bodyStyle={styles.body}
      contentStyle={styles.content}
    />
  )
}

function mapStateToProps(state) {
  return {
    error: state.error
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetError() {
      dispatch({
        type: 'RESET_ERROR'
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorMessage)