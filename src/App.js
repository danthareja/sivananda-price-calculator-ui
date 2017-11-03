import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'

import Menu from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'
import Popover from 'material-ui/Popover'
import Snackbar from 'material-ui/Snackbar'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import { DateRangePicker } from 'react-dates'
import './react-dates.css'

import SivanandaPriceCalculator from 'sivananda-price-calculator'

const VAT_RATE = 0.075
const ROOMS = SivanandaPriceCalculator.getRooms()
const TTC = _.map(SivanandaPriceCalculator.getTTC(), session => {
  return _.defaults({
    checkInDate: moment(session.checkInDate).startOf('day'),
    checkOutDate: moment(session.checkOutDate).startOf('day')
  }, session)
})
const SEASONS = _.map(SivanandaPriceCalculator.getSeasons(), season => {
  return _.defaults({
    startDate: moment(season.startDate).startOf('day'),
    endDate: moment(season.endDate).startOf('day')
  }, season)
})

const getTTCSession = (id) => {
  return TTC.find(session => session.id === id)
}

const getTTCRooms = (stay) => {
  const session = getTTCSession(stay.ttcId)
  return Object.keys(session.prices.rooms).map(id => ROOMS.find(room => room.id === id))
}

const filterRoomsByOccupancy = (occupancy) => {
  return ROOMS.filter(room => occupancy <= room.maxOccupancy)
};

const getRoomById = (id) => {
  const room =  _.find(ROOMS, _.matchesProperty('id', id))
  if (!room) {
    throw new Error(`Could not find a room with id: ${id}`)
  }
  return room
};


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: {
        message: '',
        show: false
      },
      adults: 1,
      children: 0,
      stays: [],
      courses: []
    }

    this.updateGuests = this.updateGuests.bind(this)

    this.addStay = this.addStay.bind(this)
    this.updateStay = this.updateStay.bind(this)
    this.removeStay = this.removeStay.bind(this)

    this.addCourse = this.addCourse.bind(this)
    this.updateCourse = this.updateCourse.bind(this)
    this.removeCourse = this.removeCourse.bind(this)
  }

  updateGuests(adults, children) {
    let error = { message: '', show: false }
    let totalGuests = adults + children

    if (!_.isEmpty(this.state.courses)) {
      error.message = 'Courses can only be added for a reservation with one adult. Please remove the courses before increasing guest count.'
      error.show = true
      adults = this.state.adults
      children = this.state.children
      return this.setState({ error, adults, children })
    }

    let ttcStays = _.filter(this.state.stays, stay => stay.type === 'TTC')

    if (!_.isEmpty(ttcStays) && adults + children > 1) {
      error.message = 'TTC stays can only be added for a reservation with one adult. Please remove the TTC stay before increasing guest count'
      error.show = true
      adults = this.state.adults
      children = this.state.children
      return this.setState({ error, adults, children })
    }

    let invalidRooms = _(this.state.stays)
      .map(stay => getRoomById(stay.roomId))
      .filter(room => totalGuests > room.maxOccupancy)
      .map(_.property('label'))
      .uniq()
      .value()

    if (!_.isEmpty(invalidRooms)) {
      error.message = `${_.join(invalidRooms, ', and ')} cannot have more than ${totalGuests - 1} guests. Please change the room type or remove the stay before increasing guest count.`
      error.show = true
      adults = this.state.adults
      children = this.state.children
      return this.setState({ error, adults, children })
    }

    return this.setState({ error, adults, children })
  }

  addStay(type) {
    if (type === 'ROOM') {
      const previousCheckOutDate = _.size(this.state.stays) > 0
        ? _.last(this.state.stays).checkOutDate
        : moment().startOf('day')

      return this.setState({
        stays: _.concat(this.state.stays, {
          type: type,
          roomId: 'BEACHFRONT',
          checkInDate: previousCheckOutDate,
          checkOutDate: previousCheckOutDate.clone().add(1, 'days'),
          roomDiscount: {
            type: 'PERCENT',
            value: 0
          },
          yvpDiscount: {
            type: 'PERCENT',
            value: 0
          }
        })
      })
    }
    if (type === 'TTC') {
      let session = TTC[0]

      // Try to find the closest session
      if (_.size(this.state.stays) > 0) {
        const nextSession = _.find(TTC, session => session.checkInDate.isAfter(_.last(this.state.stays).checkOutDate))
        if (nextSession) {
          session = nextSession
        }
      }


      return this.setState({
        stays: _.concat(this.state.stays, {
          type: type,
          ttcId: session.id,
          roomId: 'TENT_SPACE',
          checkInDate: session.checkInDate,
          checkOutDate: session.checkOutDate,
          roomDiscount: {
            type: 'PERCENT',
            value: 0
          },
          yvpDiscount: {
            type: 'PERCENT',
            value: 0
          }
        })
      })
    }
  }

  updateStay(index, diff) {
    let stays = [
      ...this.state.stays.slice(0, index),
      _.assign({}, this.state.stays[index], diff),
      ...this.state.stays.slice(index + 1)
    ]
    
    this.setState({ stays })
  }

  removeStay(index) {
    this.setState({
      stays: _.initial(this.state.stays)
    })
  }

  addCourse() {
    const previousEndDate = !_.isEmpty(this.state.courses)
      ? _.last(this.state.courses).endDate
      : !_.isEmpty(this.state.stays)
        ? _.first(this.state.stays).checkInDate
        : moment().startOf('day')

    this.setState({
      courses: _.concat(this.state.courses, {
        tuition: 0,
        startDate: previousEndDate.clone(),
        endDate: previousEndDate.clone().add(1, 'days'),
        discount: {
          type: 'PERCENT',
          value: 0
        }
      })
    })
  }

  updateCourse(index, diff) {
    this.setState({
      courses: [
        ...this.state.courses.slice(0, index),
        _.assign({}, this.state.courses[index], diff),
        ...this.state.courses.slice(index + 1)
      ]
    })
  }

  removeCourse(index) {
    this.setState({
      courses: _.initial(this.state.courses)
    })
  }

  render() {
    const styles = {
      snackbar: {
        container: { width: '100%'},
        body: { maxWidth: '100%', minWidth: '100%', padding: '0px', backgroundColor: '#d50000' },
        content: { textAlign: 'center' }
      },
      adults: {
        textField: { fontSize: '14px' }
      },
      children: {
        textField: { fontSize: '14px' }
      }
    }

    const isInvalidStayDate = (date, i) => {
      const { stays } = this.state
      if (i === 0) {
        if (stays[i+1]) {
          return date.isBefore(_.first(SEASONS).startDate, 'days') || date.isAfter(stays[i+1].checkInDate, 'days')
        }
        return !date.isBetween(_.first(SEASONS).startDate, _.last(SEASONS).endDate, 'days', '[]')
      }
      if (stays[i+1]) {
        return date.isBefore(stays[i-1].checkOutDate, 'days') || date.isAfter(stays[i+1].checkInDate, 'days')
      }
      return date.isBefore(stays[i-1].checkOutDate, 'days') || date.isAfter(_.last(SEASONS).endDate, 'days')
    }

    const isInvalidCourseDate = (date, i) => {
      const { courses } = this.state
      if (i === 0) {
        if (courses[i+1]) {
          return date.isBefore(_.first(SEASONS).startDate, 'days') || date.isAfter(courses[i+1].startDate, 'days')
        }
        return !date.isBetween(_.first(SEASONS).startDate, _.last(SEASONS).endDate, 'days', '[]')
      }
      if (courses[i+1]) {
        return date.isBefore(courses[i-1].endDate, 'days') || date.isAfter(courses[i+1].startDate, 'days')
      }
      return date.isBefore(courses[i-1].endDate, 'days') || date.isAfter(_.last(SEASONS).endDate, 'days')
    }

    return (
      <div>
      <Paper>
      <Grid fluid>
        <Row>
          <div style={{marginTop: '14px'}}></div>
        </Row>
        <Row middle="xs">
          <Col xs={2}>
            <RaisedButton
              label="Add TTC Stay"
              primary={true}
              fullWidth={true}
              onClick={() => this.addStay('TTC')}
              disabled={this.state.adults + this.state.children > 1}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Add YVP Stay"
              onClick={() => this.addStay('ROOM')}
              primary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Remove Stay"
              onClick={this.removeStay}
              disabled={_.isEmpty(this.state.stays)}
              secondary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Add Course"
              onClick={this.addCourse}
              disabled={this.state.adults + this.state.children > 1}
              primary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Remove Course"
              onClick={this.removeCourse}
              disabled={_.isEmpty(this.state.courses)}
              secondary={true}
              fullWidth={true}
            />
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={3}>
            <TextField
              id="adults"
              style={styles.adults.textField}
              floatingLabelText="Number of adults"
              type="Number"
              value={this.state.adults}
              onChange={e => this.updateGuests(
                _.max([1, Number(e.target.value)]),
                this.state.children
              )}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <TextField
              id="children"
              style={styles.children.textField}
              floatingLabelText="Number of children"
              type="Number"
              value={this.state.children}
              onChange={e => this.updateGuests(
                this.state.adults,
                _.max([0, Number(e.target.value)])
              )}
              fullWidth={true}
            />
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={12}>
            {this.state.stays.map((stay, i, stays) =>
              stay.type === 'ROOM'
                ? <RoomStayInput
                    key={i}
                    index={i}
                    stay={stay}
                    availableRooms={filterRoomsByOccupancy(this.state.adults + this.state.children)}
                    isOutsideRange={(date) => isInvalidStayDate(date, i)}
                    onStayChange={this.updateStay}
                  />
                : <TTCStayInput
                    key={i}
                    index={i}
                    stay={stay}
                    availableRooms={getTTCRooms(stay)}
                    onStayChange={this.updateStay}
                  />
            )}
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={12}>
            {this.state.courses.map((course, i) =>
              <CourseInput
                key={i}
                index={i}
                course={course}
                isOutsideRange={(date) => isInvalidCourseDate(date, i)}
                onCourseChange={this.updateCourse}
              />
            )}
          </Col>
        </Row>
      </Grid>
      </Paper>
      <PriceTable
        adults={this.state.adults}
        children={this.state.children}
        stays={this.state.stays}
        courses={this.state.courses}
      />
      <Snackbar
        open={this.state.error.show}
        message={this.state.error.message}
        onRequestClose={() => { this.setState({ error: { message: '', show: false } }) } }
        style={styles.snackbar.container}
        bodyStyle={styles.snackbar.body}
        contentStyle={styles.snackbar.content}
      />
      </div>
    )
  }
}

class RoomStayInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: null
    }
  }

  render() {
    const { index, stay, availableRooms, isOutsideRange, onStayChange } = this.props

    const styles = {
      selectField: {
        fontSize: '14px'
      }
    }

    return (
      <Row middle="xs">
        <Col xs={3}>
          <DateRangePicker
            disabled={stay.type==='TTC'}
            startDate={stay.checkInDate}
            endDate={stay.checkOutDate}
            startDatePlaceholderText="Check in"
            endDatePlaceholderText="Check out"
            focusedInput={this.state.focused}
            isOutsideRange={isOutsideRange}
            onDatesChange={({ startDate, endDate }) => onStayChange(index, {
              checkInDate: startDate ? startDate.startOf('day') : null,
              checkOutDate: endDate ? endDate.startOf('day') : null
            })}
            onFocusChange={focused => this.setState({ focused })}
          />
        </Col>
        <Col xs={3}>
          <SelectField
            value={stay.roomId}
            style={styles.selectField}
            floatingLabelText="Room"
            underlineShow={true}
            fullWidth={true}
            onChange={(e, i, value) => onStayChange(index, { roomId: value })}
          >
          {_.map(availableRooms, (room) => <MenuItem key={room.id} value={room.id} primaryText={room.label} />)}
          </SelectField>
        </Col>
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount Room"
            discount={stay.roomDiscount}
            onChange={roomDiscount => onStayChange(index, { roomDiscount })}
            allowedTypes={['PERCENT']}
          />
        </Col>
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount YVP"
            discount={stay.yvpDiscount}
            onChange={yvpDiscount => onStayChange(index, { yvpDiscount })}
            allowedTypes={['PERCENT']}
          />
        </Col>
      </Row>
    )
  }
}

class TTCStayInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: null
    }
  }

  render() {
    const { index, stay, availableRooms, onStayChange } = this.props
    const session = getTTCSession(stay.ttcId)

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
          onChange={(e, i, label) => {
            const session = TTC.find(session => session.label === label)
            onStayChange(index, {
              ttcId: session.id,
              roomId: session.prices.rooms[stay.roomId] ? stay.roomId : 'TENT_SPACE',
              checkInDate: session.checkInDate,
              checkOutDate: session.checkInDate,
            })
          }}
        >
          {_.map(TTC, (session) => <MenuItem key={session.id} value={session.label} primaryText={session.label} />)}
        </SelectField>
        </Col>
        <Col xs={3}>
          <SelectField
            value={stay.roomId}
            style={styles.selectField}
            floatingLabelText="Room"
            underlineShow={true}
            fullWidth={true}
            onChange={(e, i, roomId) => onStayChange(index, { roomId: roomId })}
          >
            {_.map(availableRooms, (room) => <MenuItem key={room.id} value={room.id} primaryText={room.label} />)}
          </SelectField>
        </Col>
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount Room"
            discount={stay.roomDiscount}
            onChange={roomDiscount => onStayChange(index, { roomDiscount })}
            allowedTypes={['PERCENT']}
          />
        </Col>
        <Col xs={3}>
          <DiscountInput
            buttonText="Discount YVP"
            discount={stay.yvpDiscount}
            onChange={yvpDiscount => onStayChange(index, { yvpDiscount })}
            allowedTypes={['PERCENT']}
          />
        </Col>
      </Row>
    )
  }
}

class CourseInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: null
    }
  }

  render() {
    const { index, course, isOutsideRange, onCourseChange } = this.props
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
            startDate={course.startDate}
            endDate={course.endDate}
            startDatePlaceholderText={'Course start'}
            endDatePlaceholderText={'Course end'}
            focusedInput={this.state.focused}
            isOutsideRange={isOutsideRange}
            onDatesChange={({startDate, endDate}) => onCourseChange(index, {
              startDate: startDate ? startDate.startOf('day') : null,
              endDate: endDate ? endDate.startOf('day') : null,
            })}
            onFocusChange={( focused ) => { this.setState({ focused }) }}
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
            onChange={(e) => onCourseChange(index, { tuition: _.max([0, Number(e.target.value)]) })}
          />
        </Col>
        <Col xs={6}>
          <DiscountInput
            buttonText="Discount Course"
            discount={course.discount}
            onChange={discount => onCourseChange(index, { discount })}
            allowedTypes={['PERCENT', 'FIXED']}
          />
        </Col>
      </Row>
    )
  }
}

class DiscountInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  handleTouchTap = (event) => {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  handleTextFieldChange = (e) => {
    let value = _.max([0, Number(e.target.value)])
    let type = this.props.discount.type
    this.props.onChange({ value, type })
  }

  handleRadioButtonChange = (e, type) => {
    let value = this.props.discount.value
    this.props.onChange({ value, type })    
  }

  render() {
    let label = _.join([
      this.props.buttonText ? this.props.buttonText : 'Discount',
      ' (',
      this.props.discount.type === 'FIXED' ? '$' : null,
      this.props.discount.value,
      this.props.discount.type === 'PERCENT' ? '%' : null,
      ')'
    ], '')

    return (
      <div>
        <RaisedButton
          disabled={this.props.disabled}
          onTouchTap={this.handleTouchTap}
          label={label}
          fullWidth={true}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Grid fluid>
            <Row>
              <Col xs={6}>
                <TextField
                  id={"discount"}
                  type="Number"
                  value={this.props.discount.value}
                  onChange={this.handleTextFieldChange}
                  fullWidth={true}
                  underlineShow={true}
                />
              </Col>
              <Col xs={6}>
                <RadioButtonGroup
                  name="discountType"
                  onChange={this.handleRadioButtonChange}
                  defaultSelected={this.props.discount.type}
                  labelPosition="left"
                >
                  {_.map(this.props.allowedTypes, (type, i) => 
                    <RadioButton
                      key={i}
                      value={type}
                      label={_.toLower(type)}
                    />
                  )}

                </RadioButtonGroup>
              </Col>
            </Row>
          </Grid>
        </Popover>
      </div>
    );
  }
}

class PriceTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      includeVAT: false
    }
  }

  maybeAddVAT = (value) => {
    if (!this.state.includeVAT || !_.isNumber(value)) {
      return value
    }
    return value + value * VAT_RATE
  }

  render() {
    const calculator = new SivanandaPriceCalculator({
      adults: this.props.adults,
      children: this.props.children,
      stays: this.props.stays.map(stay => _.defaults({
        checkInDate: moment.isMoment(stay.checkInDate) ? stay.checkInDate.format('YYYY-MM-DD') : stay.checkInDate,
        checkOutDate: moment.isMoment(stay.checkOutDate) ? stay.checkOutDate.format('YYYY-MM-DD') : stay.checkOutDate
      }, stay)),
      courses: this.props.courses.map(course => _.defaults({
        startDate: course.startDate.format('YYYY-MM-DD'),
        endDate: course.endDate.format('YYYY-MM-DD'),
      }, course))
    })
    const styles = {
      toggleContainer: {
        maxWidth: 250
      },
      rate: {
        margin: '5px 0px'
      }
    }
    return (
      <Card initiallyExpanded={true}>
        <CardHeader
          title={`Price Breakdown for ${calculator.getTotalNumberOfNights()} night(s)`}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <div style={styles.toggleContainer}>
                  <Toggle
                    label="Toggle to include VAT"
                    defaultToggled={this.state.includeVAT}
                    onToggle={(e, includeVAT) => this.setState({ includeVAT })}
                  />
                </div>
                <div>
                  <div style={styles.rate}>Room: ${this.maybeAddVAT(calculator.getTotalRoom()).toFixed(2)}</div>
                  <div style={styles.rate}>YVP: ${this.maybeAddVAT(calculator.getTotalYVP()).toFixed(2)}</div>
                  <div style={styles.rate}>Course: ${this.maybeAddVAT(calculator.getTotalCourse()).toFixed(2)}</div>
                  <div style={styles.rate}><strong>Total: ${this.maybeAddVAT(calculator.getGrandTotal()).toFixed(2)}</strong></div>
                </div>
              </Col>
            </Row>
          </Grid>
        </CardText>
        <CardText expandable={true}>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Room</TableHeaderColumn>
                <TableHeaderColumn>YVP</TableHeaderColumn>
                <TableHeaderColumn>Total</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {_.map(calculator.getDailyRoomYVP(), (day) => (
                <TableRow key={day.date}>
                  <TableRowColumn>{day.date}</TableRowColumn>
                  <DiscountedTableRowColumn
                    subtotal={this.maybeAddVAT(day.room.subtotal)}
                    discount={this.maybeAddVAT(day.room.discount)}
                    total={this.maybeAddVAT(day.room.total)}
                  />
                  <DiscountedTableRowColumn
                    subtotal={this.maybeAddVAT(day.yvp.subtotal)}
                    discount={this.maybeAddVAT(day.yvp.discount)}
                    total={this.maybeAddVAT(day.yvp.total)}
                  />
                  <TableRowColumn>${this.maybeAddVAT(day.total).toFixed(2)}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    )
  } 
}

function DiscountedTableRowColumn({ subtotal, discount, total }) {
  if (!discount) {
    return <TableRowColumn>${total.toFixed(2)}</TableRowColumn>
  }
  return (
    <TableRowColumn>
      <span style={{ textDecoration: 'line-through' }}>${subtotal.toFixed(2)}</span>
      <span> </span>
      <span style={{ fontStyle: 'italic' }}>(-${discount.toFixed(2)})</span>
      <span> </span>
      <span>${total.toFixed(2)}</span>
    </TableRowColumn>
  )
}

