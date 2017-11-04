import React from 'react'

import ReservationForm from './ReservationForm'
import ReservationPriceTable from './ReservationPriceTable'
import ErrorMessage from './ErrorMessage'

export default function App() {
  return (
    <div>
      <ReservationForm />
      <ReservationPriceTable />
      <ErrorMessage />
    </div>
  )
}
