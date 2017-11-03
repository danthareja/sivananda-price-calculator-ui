import React from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'

import { Grid, Row, Col } from 'react-flexbox-grid'

function AppBar(props) {
  return (
    <Paper>
      <Grid fluid>
        <Row middle="xs">
          <Col xs={2}>
            <RaisedButton
              label="Add TTC Stay"
              onClick={() => props.addStay('TTC')}
              primary={true}
              fullWidth={true}
              disabled={props.adults + props.children > 1}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Add YVP Stay"
              onClick={() => props.addStay('ROOM')}
              primary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Remove Stay"
              onClick={props.removeStay}
              secondary={true}
              fullWidth={true}
              disabled={props.stays.length === 0}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Add Course"
              onClick={props.addCourse}
              primary={true}
              fullWidth={true}
              disabled={props.adults + props.children > 1}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Remove Course"
              onClick={props.removeCourse}
              secondary={true}
              fullWidth={true}
              disabled={props.courses.length === 0}
            />
          </Col>
        </Row>
      </Grid>
    </Paper>
  )
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    addStay(type) {
      dispatch({
        type: 'ADD_STAY',
        payload: { type }
      })
    },

    removeStay() {
      dispatch({
        type: 'REMOVE_STAY'
      })
    },

    addCourse() {
      dispatch({
        type: 'ADD_COURSE'
      })
    },

    removeCourse() {
      dispatch({
        type: 'REMOVE_COURSE'
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBar)
