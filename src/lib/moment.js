// A common module to consistently import the extended version of 'moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

export default extendMoment(Moment)