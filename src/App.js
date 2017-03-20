import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'

import Toggle from 'material-ui/Toggle'
import Snackbar from 'material-ui/Snackbar'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import { DateRangePicker } from 'react-dates'
import { START_DATE, END_DATE } from 'react-dates/constants'
import './react-dates.css'

import rooms from './data/rooms'
import calculator from './calculator'
import { ROOM_ID } from './data/constants'

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
      stays: [{
        roomId: ROOM_ID.BEACHFRONT,
        checkInDate: today.clone(),
        checkOutDate: today.clone().add(1, 'days')
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
      .map(stay => _.find(rooms, _.matchesProperty('id', stay.roomId)))
      .filter(room => guests > room.maxOccupancy)
      .map(_.property('label'))
      .uniq()
      .value()

    if (!_.isEmpty(invalidRooms)) {
      error.message = `${_.join(invalidRooms, ', and ')} cannot have more than ${this.state.guests} guests. Please change the room type or delete the stay before increasing guest count.`
      error.show = true
      guests = this.state.guests
    }

    if (!_.isEmpty(this.state.courses)) {
      error.message = 'Courses can only be added for a reservation with one guest. Please delete the courses before increasing guest count.'
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
        checkOutDate: latestCheckOutDate.clone().add(1, 'days')
      })
    })
  }

  updateStay(index, diff) {
    if (!_.isNil(diff.roomId)) {
      let stays = [
        ...this.state.stays.slice(0, index),
        _.assign({}, this.state.stays[index], diff),
        ...this.state.stays.slice(index + 1)
      ]
      
      return this.setState({ stays })
    }

    if (!_.isNil(diff.checkInDate)) {
      let stays = _.reduce(this.state.stays, (newStays, oldStay, i) => {
        // Do nothing for dates before the one being updated
        if (i < index) {
          return newStays.concat(_.clone(oldStay))
        }

        // Update the modified stay, checking for errors
        if (i === index) {
          return newStays.concat({
            roomId: oldStay.roomId,
            checkInDate: diff.checkInDate,
            checkOutDate: diff.checkOutDate
          })  
        }

        // Modify all future stays depending on what was updated
        if (i > index) {
          let oldCheckOutDate = oldStay.checkOutDate
          let oldStayLength = oldCheckOutDate ? oldCheckOutDate.diff(oldStay.checkInDate, 'days') : 1
          let newCheckInDate = newStays[i - 1].checkOutDate
          return newStays.concat({
            roomId: oldStay.roomId,
            checkInDate: newCheckInDate ? newCheckInDate.clone() : null,
            checkOutDate: newCheckInDate ? newCheckInDate.clone().add(oldStayLength, 'days') : null
          })
        }
      }, [])

      return this.setState({ stays })
    }
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
        endDate: checkInDate.clone().add(1, 'days')
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
    const availableRooms = _.filter(rooms, room => this.state.guests <= room.maxOccupancy)

    const styles = {
      snackbar: {
        container: { width: '100%'},
        body: { maxWidth: '100%', minWidth: '100%', padding: '0px', backgroundColor: '#d50000' },
        content: { textAlign: 'center' }
      },
      guests: {
        container: { height: '40px' },
        title: { fontSize: '16px' },
        textField: { fontSize: '14px' }
      }
    }

    return (
      <div>
        <Snackbar
          open={this.state.error.show}
          message={this.state.error.message}
          autoHideDuration={4000}
          onRequestClose={() => { this.setState({ error: { message: '', show: false } }) } }
          style={styles.snackbar.container}
          bodyStyle={styles.snackbar.body}
          contentStyle={styles.snackbar.content}
        />
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton label="Add stay" onClick={this.addStay} primary={true}/>
            <RaisedButton label="Remove stay" onClick={this.removeStay} disabled={_.size(this.state.stays) <= 1} primary={true}/>
            <RaisedButton label="Add course" onClick={this.addCourse} disabled={this.state.guests > 1} secondary={true}/>
            <RaisedButton label="Remove course" onClick={this.removeCourse} disabled={_.isEmpty(this.state.courses)} secondary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <Toolbar style={styles.guests.container}>
          <ToolbarGroup>
            <ToolbarTitle text="Guests" style={styles.guests.title}/>
            <TextField
              style={styles.guests.textField}
              id="guests"
              type="Number"
              value={this.state.guests}
              onChange={this.updateGuests}
            />
          </ToolbarGroup>
        </Toolbar>
        {this.state.stays.map((stay, i, stays) =>
          <StayInput
            key={i}
            index={i}
            stay={stay}
            availableRooms={availableRooms}
            isOutsideRange={(date) => i === 0 ? date.isBefore(today) : date.isBefore(stays[i - 1].checkOutDate)}
            onStayChange={this.updateStay}
          />
        )}
        {this.state.courses.map((course, i) =>
          <CourseInput
            key={i}
            index={i}
            course={course}
            onCourseChange={this.updateCourse}
          />
        )}
        <PriceTable
          guests={this.state.guests}
          stays={this.state.stays}
          courses={this.state.courses}
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
      toolbar: {
        height: '40px'
      },
      title: {
        fontSize: '16px'
      },
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
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup>
          <ToolbarTitle text="Stay" style={styles.title} />
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
          <SelectField
            value={stay.roomId}
            style={styles.selectField}
            onChange={(e, i, value) => onStayChange(index, { roomId: value })}
          >
          {_.map(availableRooms, (room) => <MenuItem key={room.id} value={room.id} primaryText={room.label} />)}
          </SelectField>
        </ToolbarGroup>
      </Toolbar>
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
    const { index, course, onCourseChange } = this.props
    const styles = {
      toolbar: {
        height: '40px'
      },
      title: {
        fontSize: '16px'
      },
      textField: {
        fontSize: '14px'
      }
    }

    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup>
          <ToolbarTitle text="Course" style={styles.title}/>
          <DateRangePicker
            startDate={course.startDate}
            endDate={course.endDate}
            startDatePlaceholderText={'Course start'}
            endDatePlaceholderText={'Course end'}
            focusedInput={this.state.focused}
            onDatesChange={({startDate, endDate}) => onCourseChange(index, { startDate, endDate })}
            onFocusChange={( focused ) => { this.setState({ focused }) }}
          />
          $<TextField
            id={"course_tuition_" + index}
            type="Number"
            value={course.tuition}
            style={styles.textField}
            onChange={(e) => onCourseChange(index, { tuition: _.max([0, parseInt(e.target.value, 10)]) })}
          />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

class PriceTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      includeVAT: false
    }
  }

  render() {
    const season = 'winter' // Hardcoded for now
    const {guests, stays, courses } = this.props
    const calculated = calculator({ guests, stays, courses, season })
    const rates = this.state.includeVAT ? calculated.ratesWithVAT : calculated.rates
    return (
      <Card>
        <CardHeader
          title={'Price Breakdown'}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <Toggle
            label="Include VAT"
            labelPosition="right"
            toggled={this.state.includeVAT}
            onToggle={(e, isChecked) => this.setState({ includeVAT: isChecked })}
          />
        </CardText>
        <CardText>
          <p>Room: ${rates.room.toFixed(2)}</p>
          <p>YVP: ${rates.yvp.toFixed(2)}</p>
          <p>Course: ${rates.course.toFixed(2)}</p>
          <p>Total: ${rates.total.toFixed(2)}</p>
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
