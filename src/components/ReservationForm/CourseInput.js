import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import { DateRangePicker } from 'react-dates'

import ClearIcon from 'material-ui/svg-icons/content/clear'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import { Row, Col } from 'react-flexbox-grid'

import DiscountInput from './DiscountInput'

class CourseInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: null
    }

    this.isOutsideRange = this.isOutsideRange.bind(this)
    this.handleDatesChange = this.handleDatesChange.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
    this.handleTuitionChange = this.handleTuitionChange.bind(this)
    this.handleDiscountChange = this.handleDiscountChange.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
  }

  isOutsideRange(date) {
    const seasons = this.props.data.seasons
    const courses = this.props.courses
    const index = this.props.index

    if (index === 0) {
      if (courses[index + 1]) {
        return date.isBefore(seasons[0].startDate, 'days') || date.isAfter(courses[index + 1].startDate, 'days')
      }
      return !date.isBetween(seasons[0].startDate, seasons[seasons.length - 1].endDate, 'days', '[]')
    }
    if (courses[index + 1]) {
      return date.isBefore(courses[index - 1].endDate, 'days') || date.isAfter(courses[index + 1].startDate, 'days')
    }
    return date.isBefore(courses[index - 1].endDate, 'days') || date.isAfter(seasons[seasons.length - 1].endDate, 'days')
  }

  handleDatesChange({ startDate, endDate }) {
    this.props.updateCourse({
      startDate: moment.isMoment(startDate) ? startDate.format('YYYY-MM-DD') : null,
      endDate: moment.isMoment(endDate) ? endDate.format('YYYY-MM-DD') : null,
    })
  }

  handleRemoveClick() {
    this.props.removeCourse()
  }

  handleTuitionChange(e) {
    this.props.updateCourse({ tuition: e.target.value })
  }

  handleDiscountChange(discount) {
    this.props.updateCourse({ discount })
  }

  handleFocusChange(focused) {
    this.setState({ focused })
  }


  render() {
    const { focused } = this.state
    const { course, index } = this.props
    const styles = {
      textField: {
        fontSize: '14px',
        width: '100px'
      },
      textSpan: {
        fontSize: '14px',
        lineHeight: '24px',
        margin: 'auto'
      }
    }

    return (
      <Row middle="xs">
        <Col xs={3}>
          <DateRangePicker
            startDate={moment(course.startDate)}
            endDate={moment(course.endDate)}
            startDatePlaceholderText={'Course start'}
            endDatePlaceholderText={'Course end'}
            focusedInput={focused}
            isOutsideRange={this.isOutsideRange}
            onDatesChange={this.handleDatesChange}
            onFocusChange={this.handleFocusChange}
          />
        </Col>
        <Col xs={3}>
          <span style={styles.textSpan}>$</span>
          <TextField
            id={"course_tuition_" + index}
            type="Number"
            floatingLabelText="Tuition"
            value={course.tuition}
            style={styles.textField}
            underlineShow={true}
            min={0}
            onChange={this.handleTuitionChange}
          />
        </Col>
        <Col xs={5}>
          <DiscountInput
            discount={course.discount}
            onChange={this.handleDiscountChange}
            allowedTypes={['PERCENT', 'FIXED']}
            buttonText="Discount Tuition"
          />
        </Col>
        <Col xs={1}>
          <IconButton onClick={this.handleRemoveClick} tooltip="Remove">
            <ClearIcon />
          </IconButton>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...state,
    ...ownProps
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updateCourse(diff) {
      dispatch({
        type: 'UPDATE_COURSE',
        payload: {
          index: ownProps.index,
          diff
        }
      })
    },
    removeCourse() {
      dispatch({
        type: 'REMOVE_COURSE',
        payload: {
          index: ownProps.index,
        }
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseInput)
