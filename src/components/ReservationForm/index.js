import React from 'react'
import { connect } from 'react-redux'

import { Grid, Row, Col } from 'react-flexbox-grid'

import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'

import CourseInput from './CourseInput'
import RoomStayInput from './RoomStayInput'
import TTCStayInput from './TTCStayInput'

import './react-dates.css'

function ReservationForm(props) {
  const styles = {
    adults: {
      textField: { fontSize: '14px' }
    },
    children: {
      textField: { fontSize: '14px' }
    }
  }

  return (
    <Paper>
      <Grid fluid>
        <Row middle="xs">
          <Col xs={3}>
            <TextField
              id="adults"
              style={styles.adults.textField}
              floatingLabelText="Number of adults"
              type="Number"
              value={props.adults}
              onChange={e => props.updateGuests(
                e.target.value,
                props.children
              )}
              min={1}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <TextField
              id="children"
              style={styles.children.textField}
              floatingLabelText="Number of children"
              type="Number"
              value={props.children}
              onChange={e => props.updateGuests(
                props.adults,
                e.target.value
              )}
              min={0}
              fullWidth={true}
            />
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={12}>
            {props.stays.map((stay, i, stays) =>
              stay.type === 'ROOM'
                ? <RoomStayInput
                    key={i}
                    index={i}
                    stay={stay}
                  />
                : <TTCStayInput
                    key={i}
                    index={i}
                    stay={stay}
                  />
            )}
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={12}>
            {props.courses.map((course, i) =>
              <CourseInput
                key={i}
                index={i}
                course={course}
              />
            )}
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
    updateGuests(adults, children) {
      dispatch({
        type: 'UPDATE_GUESTS',
        payload: { adults, children }
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationForm)
