import _ from 'lodash'
import React, { Component } from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'

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

import moment from './lib/moment'
import ReservationCalculator, { Course, RoomStay, TTCStay, SeasonPrice } from './calculator'
import { getRoomById, filterRoomsByOccupancy } from './data/rooms'
import { ROOM_ID, DISCOUNT } from './data/constants'

// react-dates formats all dates as noon and consistency is good
const today = moment().startOf('day').hour(12)

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
      grossDiscount: {
        type: DISCOUNT.PERCENT,
        value: 0
      },
      stays: [{
        type: 'RoomStay',
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: today.clone(),
        checkOutDate: today.clone().add(1, 'days'),
        roomDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        },
        yvpDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        }
      }],
      courses: []
    }

    this.updateGuests = this.updateGuests.bind(this)

    this.addTTC = this.addTTC.bind(this)

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
    }

    if (!_.isEmpty(this.state.courses)) {
      error.message = 'Courses can only be added for a reservation with one guest. Please remove the courses before increasing guest count.'
      error.show = true
      adults = this.state.adults
      children = this.state.children
    }

    this.setState({ error, adults, children })
  }

  addTTC() {
    const stay = TTCStay.getDates()[0]
    this.setState({
      stays: _.concat(this.state.stays, {
        type: 'TTCStay',
        roomId: stay.roomId,
        checkInDate: stay.checkInDate,
        checkOutDate: stay.checkOutDate,
        roomDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        },
        yvpDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        }
      })
    })
  }

  addStay() {
    const latestCheckOutDate = _.size(this.state.stays) > 0
      ? _.last(this.state.stays).checkOutDate
      : today

    this.setState({
      stays: _.concat(this.state.stays, {
        type: 'RoomStay',
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: latestCheckOutDate.clone(),
        checkOutDate: latestCheckOutDate.clone().add(1, 'days'),
        roomDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        },
        yvpDiscount: {
          type: DISCOUNT.PERCENT,
          value: 0
        }
      })
    })
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
    const checkInDate = _.first(this.state.stays).checkInDate
    this.setState({
      courses: _.concat(this.state.courses, {
        tuition: 0,
        startDate: checkInDate.clone(),
        endDate: checkInDate.clone().add(1, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
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
              onClick={this.addTTC}
              primary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Add YVP Stay"
              onClick={this.addStay}
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
              disabled={this.state.adults + this.state.children > 1 || _.isEmpty(this.state.stays)}
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
          <Col xs={6}>
            <DiscountInput
              buttonText="Discount Subtotal"
              discount={this.state.grossDiscount}
              onChange={grossDiscount => this.setState({ grossDiscount })}
              allowedTypes={[DISCOUNT.PERCENT, DISCOUNT.FIXED]}
            />
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={12}>
            {this.state.stays.map((stay, i, stays) =>
              <StayInput
                key={i}
                index={i}
                stay={stay}
                availableRooms={filterRoomsByOccupancy(this.state.adults + this.state.children)}
                isOutsideRange={(date) => !SeasonPrice.getSeasonFromDate(date)}
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
                isOutsideRange={(date) => !SeasonPrice.getSeasonFromDate(date)}
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
        grossDiscount={this.state.grossDiscount}
      />
      <Snackbar
        open={this.state.error.show}
        message={this.state.error.message}
        autoHideDuration={4000}
        onRequestClose={() => { this.setState({ error: { message: '', show: false } }) } }
        style={styles.snackbar.container}
        bodyStyle={styles.snackbar.body}
        contentStyle={styles.snackbar.content}
      />
      </div>
    )
  }
}

class StayInput extends Component {
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
            disabled={stay.type==='TTCStay'}
            startDate={stay.checkInDate}
            endDate={stay.checkOutDate}
            startDatePlaceholderText="Check in"
            endDatePlaceholderText="Check out"
            focusedInput={this.state.focused}
            isOutsideRange={isOutsideRange}
            onDatesChange={({ startDate, endDate }) => onStayChange(index, { checkInDate: startDate, checkOutDate: endDate })}
            onFocusChange={focused => this.setState({ focused })}
          />
        </Col>
        <Col xs={3}>
          <SelectField
            disabled={stay.type==='TTCStay'}
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
            disabled={stay.type==='TTCStay'}
            buttonText="Discount Room"
            discount={stay.roomDiscount}
            onChange={roomDiscount => onStayChange(index, { roomDiscount })}
            allowedTypes={[DISCOUNT.PERCENT]}
          />
        </Col>
        <Col xs={3}>
          <DiscountInput
            disabled={stay.type==='TTCStay'}
            buttonText="Discount YVP"
            discount={stay.yvpDiscount}
            onChange={yvpDiscount => onStayChange(index, { yvpDiscount })}
            allowedTypes={[DISCOUNT.PERCENT]}
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
            onDatesChange={({startDate, endDate}) => onCourseChange(index, { startDate, endDate })}
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
            allowedTypes={[DISCOUNT.PERCENT, DISCOUNT.FIXED]}
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
    // This prevents ghost click.
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
      this.props.discount.type === DISCOUNT.FIXED ? '$' : null,
      this.props.discount.value,
      this.props.discount.type === DISCOUNT.PERCENT ? '%' : null,
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

  maybeIncludeVAT = (value) => {
    if (!this.state.includeVAT || !_.isNumber(value)) {
      return value
    }
    return value + value * ReservationCalculator.VAT
  }

  render() {
    const calculator = new ReservationCalculator({
      adults: this.props.adults,
      children: this.props.children,
      stays: _.map(this.props.stays, stay => {
        if (stay.type === 'RoomStay') {
          return new RoomStay(stay)
        }
        if (stay.type === 'TTCStay') {
          return new TTCStay(stay)
        }
      }),
      courses: _.map(this.props.courses, course => new Course(course)),
      grossDiscount: this.props.grossDiscount
    })
    const rates = {
      dailyRoomYVP: this.maybeIncludeVAT(calculator.getDailyRoomYVP()),
      room: this.maybeIncludeVAT(calculator.getTotalRoom()),
      yvp: this.maybeIncludeVAT(calculator.getTotalYVP()),
      course: this.maybeIncludeVAT(calculator.getTotalCourse()),
      subtotal: this.maybeIncludeVAT(calculator.getSubtotal()),
      discount: this.maybeIncludeVAT(calculator.getGrossDiscount()),
      total: this.maybeIncludeVAT(calculator.getGrandTotal())
    }
    const styles = {
      toggleContainer: {
        maxWidth: 250
      },
      rate: {
        margin: '5px 0px'
      }
    }
    
    return (
      <Card>
        <CardHeader
          title={'Price Breakdown'}
          subtitle={'(daily rates do not include subtotal discount)'}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <div style={styles.toggleContainer}>
                  <Toggle
                    label="Include VAT"
                    defaultToggled={this.state.includeVAT}
                    onToggle={(e, includeVAT) => this.setState({ includeVAT })}
                  />
                </div>
                <div>
                  <div style={styles.rate}>Room: ${rates.room.toFixed(2)}</div>
                  <div style={styles.rate}>YVP: ${rates.yvp.toFixed(2)}</div>
                  <div style={styles.rate}>Course: ${rates.course.toFixed(2)}</div>
                  <div style={styles.rate}>Subtotal: ${rates.subtotal.toFixed(2)}</div>
                  <div style={styles.rate}><i>Discount: -${rates.discount.toFixed(2)}</i></div>
                  <div style={styles.rate}><strong>Total: ${rates.total.toFixed(2)}</strong></div>
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
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {_.map(rates.dailyRoomYVP, (rate, date) => (
                <TableRow key={date}>
                  <TableRowColumn>{date}</TableRowColumn>
                  <TableRowColumn>${rate.room.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>${rate.yvp.toFixed(2)}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    )
  } 
}
