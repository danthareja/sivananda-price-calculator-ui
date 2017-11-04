import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

import { Grid, Row, Col } from 'react-flexbox-grid'

import SivanandaPriceCalculator from 'sivananda-price-calculator'

class ReservationPriceTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      includeVAT: false
    }
  }

  maybeAddVAT = (value) => {
    if (!this.state.includeVAT || typeof value !== 'number') {
      return value
    }
    return value + value * 0.075
  }

  render() {
    const calculator = new SivanandaPriceCalculator(this.props)
    const styles = {
      toggleContainer: {
        maxWidth: 250
      },
      rate: {
        margin: '5px 0px'
      }
    }
    return (
      <Paper>
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
                {calculator.getDailyRoomYVP().map(day => (
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
      </Paper>
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

function mapStateToProps(state) {
  return {
    adults: state.adults,
    children: state.children,
    stays: state.stays,
    courses: state.courses
  }
}

export default connect(mapStateToProps)(ReservationPriceTable)