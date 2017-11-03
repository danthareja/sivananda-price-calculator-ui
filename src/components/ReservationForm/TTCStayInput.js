import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import { Row, Col } from 'react-flexbox-grid'

import DiscountInput from './DiscountInput'

class TTCStayInput extends Component {
  constructor(props) {
    super(props)

    this.getTTCSession = this.getTTCSession.bind(this)
    this.getAvailableRooms = this.getAvailableRooms.bind(this)
    this.handleSessionChange = this.handleSessionChange.bind(this)
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this)
    this.handleRoomDiscountChange = this.handleRoomDiscountChange.bind(this)
    this.handleYVPDiscountChange = this.handleYVPDiscountChange.bind(this)
  }

  getTTCSession() {
    return this.props.data.ttc.find(session => session.id === this.props.stay.ttcId)
  }

  getAvailableRooms() {
    const session = this.getTTCSession()
    return Object.keys(session.prices.rooms).map(roomId => this.props.data.rooms.find(room => room.id === roomId))
  }

  handleSessionChange(e, i, label) {
    const session = this.props.data.ttc.find(session => session.label === label)

    this.props.updateStay({
      ttcId: session.id,
      roomId: this.props.stay.roomId ? this.props.stay.roomId : 'TENT_SPACE',
      checkInDate: session.checkInDate,
      checkOutDate: session.checkInDate,
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

  render() {
    const { stay } = this.props
    const session = this.getTTCSession()

    console.log(this.getAvailableRooms())

    const styles = {
      selectField: {
        fontSize: '14px'
      }
    }

    return (
      <Row middle="xs">
        <Col xs={3}>
          <SelectField
            value={session.label}
            style={styles.selectField}
            floatingLabelText="Session"
            underlineShow={true}
            fullWidth={true}
            onChange={this.handleSessionChange}
          >
            {this.props.data.ttc.map(session =>
              <MenuItem key={session.id} value={session.label} primaryText={session.label} />
            )}
          </SelectField>
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
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount YVP"
            discount={stay.yvpDiscount}
            onChange={this.handleYVPDiscountChange}
            allowedTypes={['PERCENT']}
          />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TTCStayInput)
