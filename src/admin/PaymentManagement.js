import React from 'react'
import Sidebar from '../components/Sidebar'

const PaymentManagement = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Prices</h1>
      </div>
    </div>
  )
}

export default PaymentManagement