import React, { Component } from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'

import Popover from 'material-ui/Popover'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

class DiscountInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }

    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this)
  }

  handleTouchTap(event) {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose() {
    this.setState({
      open: false,
    })
  }

  handleTextFieldChange(e) {
    let value = Number(e.target.value)
    let type = this.props.discount.type
    this.props.onChange({ value, type })
  }

  handleRadioButtonChange(e, type) {
    let value = Number(this.props.discount.value)
    this.props.onChange({ value, type })    
  }

  render() {
    const label = [
      this.props.buttonText ? this.props.buttonText : 'Discount',
      ' (',
      this.props.discount.type === 'FIXED' ? '$' : null,
      this.props.discount.value,
      this.props.discount.type === 'PERCENT' ? '%' : null,
      ')'
    ].join('')
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
                  id="discount"
                  type="Number"
                  value={this.props.discount.value}
                  onChange={this.handleTextFieldChange}
                  fullWidth={true}
                  underlineShow={true}
                  min={0}
                />
              </Col>
              <Col xs={6}>
                <RadioButtonGroup
                  name="discountType"
                  onChange={this.handleRadioButtonChange}
                  defaultSelected={this.props.discount.type}
                  labelPosition="left"
                >
                  {this.props.allowedTypes.map((type, i) => 
                    <RadioButton
                      key={i}
                      value={type}
                      label={type.toLowerCase()}
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

export default DiscountInput

