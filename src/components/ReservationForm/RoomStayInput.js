import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import { DateRangePicker } from 'react-dates'

import ClearIcon from 'material-ui/svg-icons/content/clear'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import { Row, Col } from 'react-flexbox-grid'

import DiscountInput from './DiscountInput'

class RoomStayInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: null
    }

    this.getAvailableRooms = this.getAvailableRooms.bind(this)
    this.isOutsideRange = this.isOutsideRange.bind(this)
    this.handleDatesChange = this.handleDatesChange.bind(this)
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this)
    this.handleRoomDiscountChange = this.handleRoomDiscountChange.bind(this)
    this.handleYVPDiscountChange = this.handleYVPDiscountChange.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
  }

  getAvailableRooms() {
    return this.props.data.rooms.filter(room => {
      return this.props.adults + this.props.children < room.maxOccupancy
    })
  }

  isOutsideRange(date) {
    const seasons = this.props.data.seasons
    const stays = this.props.stays
    const index = this.props.index

    if (index === 0) {
      if (stays[index + 1]) {
        return date.isBefore(seasons[0].startDate, 'days') || date.isAfter(stays[index + 1].checkInDate, 'days')
      }
      return !date.isBetween(seasons[0].startDate, seasons[seasons.length - 1].endDate, 'days', '[]')
    }
    if (stays[index + 1]) {
      return date.isBefore(stays[index - 1].checkOutDate, 'days') || date.isAfter(stays[index + 1].checkInDate, 'days')
    }
    return date.isBefore(stays[index - 1].checkOutDate, 'days') || date.isAfter(seasons[seasons.length - 1].endDate, 'days')
  }

  handleDatesChange({ startDate, endDate }) {
    this.props.updateStay({
      checkInDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      checkOutDate: endDate ? endDate.format('YYYY-MM-DD') : null
    })
  }

  handleRoomIdChange(e, i, roomId) {
    this.props.updateStay({ roomId })
  }


  handleRoomDiscountChange(roomDiscount) {
    this.props.updateStay({ roomDiscount })
  }

  handleYVPDiscountChange(yvpDiscount) {
    this.props.updateStay({ yvpDiscount })
  }

  handleRemoveClick() {
    this.props.removeStay()
  }

  handleFocusChange(focused) {
    this.setState({ focused })
  }

  render() {
    const { focused } = this.state;
    const { stay } = this.props

    const styles = {
      selectField: {
        fontSize: '14px'
      }
    }

    return (
      <Row middle="xs">
        <Col xs={3}>
          <DateRangePicker
            startDate={moment(stay.checkInDate)}
            endDate={moment(stay.checkOutDate)}
            startDatePlaceholderText="Check in"
            endDatePlaceholderText="Check out"
            focusedInput={focused}
            isOutsideRange={this.isOutsideRange}
            onDatesChange={this.handleDatesChange}
            onFocusChange={this.handleFocusChange}
          />
        </Col>
        <Col xs={3}>
          <SelectField
            value={stay.roomId}
            style={styles.selectField}
            floatingLabelText="Room"
            underlineShow={true}
            fullWidth={true}
            onChange={this.handleRoomIdChange}
          >
          {this.getAvailableRooms().map(room =>
            <MenuItem key={room.id} value={room.id} primaryText={room.label} />
          )}
          </SelectField>
        </Col>
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount Room"
            discount={stay.roomDiscount}
            onChange={this.handleRoomDiscountChange}
            allowedTypes={['PERCENT']}
          />
        </Col>
        <Col xs={2}>
          <DiscountInput
            buttonText="Discount YVP"
            discount={stay.yvpDiscount}
            onChange={this.handleYVPDiscountChange}
            allowedTypes={['PERCENT']}
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
    updateStay(diff) {
      dispatch({
        type: 'UPDATE_STAY',
        payload: {
          index: ownProps.index,
          diff
        }
      })
    },
    removeStay() {
      dispatch({
        type: 'REMOVE_STAY',
        payload: {
          index: ownProps.index,
        }
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomStayInput)
