// Stay focused....
//   1. Add discounts
//   2. Add TTC
//   3. Write tests

import _ from 'lodash'
import React, { Component } from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'

import Paper from 'material-ui/Paper'
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
import { START_DATE, END_DATE } from 'react-dates/constants'
import './react-dates.css'

import moment from './lib/moment'
import { getRoomById, filterRoomsByOccupancy } from './data/rooms'
import { isWithinSeasonRange } from './data/seasons'
import calculator from './calculator'
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
      guests: 1,
      discount: {
        type: DISCOUNT.PERCENT,
        value: 0
      },
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: today.clone(),
        checkOutDate: today.clone().add(1, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 0
        }
      }],
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

  updateGuests(e) {
    let error = { message: '', show: false }
    let guests = _.max([1, parseInt(e.target.value, 10)])
    
    let invalidRooms = _(this.state.stays)
      .map(stay => getRoomById(stay.roomId))
      .filter(room => guests > room.maxOccupancy)
      .map(_.property('label'))
      .uniq()
      .value()

    if (!_.isEmpty(invalidRooms)) {
      error.message = `${_.join(invalidRooms, ', and ')} cannot have more than ${this.state.guests} guests. Please change the room type or remove the stay before increasing guest count.`
      error.show = true
      guests = this.state.guests
    }

    if (!_.isEmpty(this.state.courses)) {
      error.message = 'Courses can only be added for a reservation with one guest. Please remove the courses before increasing guest count.'
      error.show = true
      guests = this.state.guests
    }

    this.setState({ error, guests })
  }

  addStay() {
    const latestCheckOutDate = _.last(this.state.stays).checkOutDate
    this.setState({
      stays: _.concat(this.state.stays, {
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: latestCheckOutDate.clone(),
        checkOutDate: latestCheckOutDate.clone().add(1, 'days'),
        discount: {
          type: DISCOUNT.PERCENT,
          value: 0
        }
      })
    })
  }

  updateStay(index, diff) {
    // Updating any stay state that does not include a change in dates
    if (_.isNil(diff.checkInDate)) {
      let stays = [
        ...this.state.stays.slice(0, index),
        _.assign({}, this.state.stays[index], diff),
        ...this.state.stays.slice(index + 1)
      ]
      
      this.setState({ stays })
      return
    }

    // Updating a stay's dates is kind of tricky
    // because we want to keep all the dates continuous
    let stays = _.reduce(this.state.stays, (newStays, oldStay, i) => {
      // Do nothing for dates before the one being updated
      if (i < index) {
        return newStays.concat(_.clone(oldStay))
      }

      // Update the modified stay, checking for errors
      if (i === index) {
        return newStays.concat({
          roomId: oldStay.roomId,
          discount: oldStay.discount,
          checkInDate: diff.checkInDate,
          checkOutDate: diff.checkOutDate,
        })  
      }

      // Modify all future stays depending on what was updated
      if (i > index) {
        let oldCheckOutDate = oldStay.checkOutDate
        let oldStayLength = oldCheckOutDate ? oldCheckOutDate.diff(oldStay.checkInDate, 'days') : 1
        let newCheckInDate = newStays[i - 1].checkOutDate
        return newStays.concat({
          roomId: oldStay.roomId,
          discount: oldStay.discount,
          checkInDate: newCheckInDate ? newCheckInDate.clone() : null,
          checkOutDate: newCheckInDate ? newCheckInDate.clone().add(oldStayLength, 'days') : null
        })
      }
    }, [])

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
      guests: {
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
          <Col xs={3}>
            <RaisedButton
              label="Add Stay"
              onClick={this.addStay}
              primary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Remove Stay"
              onClick={this.removeStay}
              disabled={_.size(this.state.stays) <= 1}
              secondary={true}
              fullWidth={true}
            />
          </Col>
          <Col xs={3}>
            <RaisedButton
              label="Add Course"
              onClick={this.addCourse}
              disabled={_.size(this.state.guests) > 1}
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
          <Col xs={6}>
            <TextField
              id="guests"
              style={styles.guests.textField}
              floatingLabelText="Number of guests"
              type="Number"
              value={this.state.guests}
              onChange={this.updateGuests}
              fullWidth={true}
            />
          </Col>
          <Col xs={6}>
            <DiscountInput
              buttonText="Gross Discount"
              discount={this.state.discount}
              onChange={discount => this.setState({ discount })}
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
                availableRooms={filterRoomsByOccupancy(this.state.guests)}
                isOutsideRange={(date) => i === 0 ? !isWithinSeasonRange(date) : date.isBefore(stays[i - 1].checkOutDate)}
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
                isOutsideRange={(date) => !isWithinSeasonRange(date)}
                onCourseChange={this.updateCourse}
              />
            )}
          </Col>
        </Row>
      </Grid>
      </Paper>
      <PriceTable
        guests={this.state.guests}
        stays={this.state.stays}
        courses={this.state.courses}
        discount={this.state.discount}
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

    const onFocusChange = (focused) => {
      // For the first date, let users change whatever
      if (index === 0) {
        return this.setState({ focused })
      }

      // For other dates, only let them change the end date
      // Avoiding changes to the start date makes enforcing continuous easier
      if (_.isNull(stay.checkInDate)) {
        return this.setState({ focused })
      }

      if (focused === START_DATE || focused === END_DATE) {
        return this.setState({ focused: END_DATE }) 
      }

      return this.setState({ focused })
    }

    return (
      <Row middle="xs">
        <Col xs={4}>
          <DateRangePicker
            startDate={stay.checkInDate}
            endDate={stay.checkOutDate}
            startDatePlaceholderText="Check in"
            endDatePlaceholderText="Check out"
            focusedInput={this.state.focused}
            isOutsideRange={isOutsideRange}
            onDatesChange={({ startDate, endDate }) => onStayChange(index, { checkInDate: startDate, checkOutDate: endDate })}
            onFocusChange={onFocusChange}
          />
        </Col>
        <Col xs={4}>
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
        <Col xs={4}>
          <DiscountInput
            discount={stay.discount}
            onChange={discount => onStayChange(index, { discount })}
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
        <Col xs={4}>
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
        <Col xs={4}>
          <span style={styles.textSpan}>$</span>
          <TextField
            id={"course_tuition_" + index}
            type="Number"
            floatingLabelText="Tuition"
            value={course.tuition}
            style={styles.textField}
            underlineShow={true}
            onChange={(e) => onCourseChange(index, { tuition: _.max([0, parseInt(e.target.value, 10)]) })}
          />
        </Col>
        <Col xs={4}>
          <DiscountInput
            discount={course.discount}
            onChange={discount => onCourseChange(index, { discount })}
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
    let value = _.max([0, parseInt(e.target.value, 10)])
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
                  <RadioButton
                    value={DISCOUNT.PERCENT}
                    label="Percent"
                  />
                  <RadioButton
                    value={DISCOUNT.FIXED}
                    label="Fixed"
                  />
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
      rateOption: 'withoutVAT'
    }
  }

  render() {
    const rates = calculator(this.props)[this.state.rateOption]
    
    const styles = {
      rate: {
        margin: '5px 0px'
      }
    }
    
    return (
      <Card>
        <CardHeader
          title={'Price Breakdown'}
          subtitle={'(daily rates do not include gross discount)'}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <Grid fluid>
          <Row>
          <Col xs>
            <div>
              <div style={styles.rate}>Room: ${rates.room.toFixed(2)}</div>
              <div style={styles.rate}>YVP: ${rates.yvp.toFixed(2)}</div>
              <div style={styles.rate}>Course: ${rates.course.toFixed(2)}</div>
              <div style={styles.rate}><i>Subtotal: ${rates.subtotal.toFixed(2)}</i></div>
              <div style={styles.rate}>Discount: -${rates.discount.toFixed(2)}</div>
              <div style={styles.rate}><strong>Total: ${rates.total.toFixed(2)}</strong></div>
            </div>
          </Col>
          <Col xs>
            <RadioButtonGroup
              name="rateOption"
              onChange={(e, rateOption) => this.setState({ rateOption })}
              defaultSelected="withoutVAT"
              labelPosition="left"
            >
              <RadioButton
                value="withoutVAT"
                label="Total"
              />
              <RadioButton
                value="withVAT"
                label="Total +VAT"
              />
              <RadioButton
                value="perGuestWithoutVAT"
                label="Total per guest"
                disabled={this.props.guests === 1}
              />
              <RadioButton
                value="perGuestWithVAT"
                label="Total per guest +VAT"
                disabled={this.props.guests === 1}
              />
            </RadioButtonGroup>
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
              {_.map(rates.perDay, (rate, i) => (
                <TableRow key={i}>
                  <TableRowColumn>{rate.date.format('MM/DD/YYYY')}</TableRowColumn>
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
