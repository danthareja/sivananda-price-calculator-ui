import React from 'react'

import AppBar from './AppBar'
import ReservationForm from './ReservationForm'
import ReservationPriceTable from './ReservationPriceTable'
import ErrorMessage from './ErrorMessage'

export default function App() {
  return (
    <div>
      <AppBar />
      <ReservationForm />
      <ReservationPriceTable />
      <ErrorMessage />
    </div>
  )
}
