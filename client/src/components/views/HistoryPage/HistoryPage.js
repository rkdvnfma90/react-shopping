import React from 'react'

// redux에 히스토리 정보가 있기 때문에 따로 axios를 사용할 필요가 없다.
function HistoryPage({ user }) {
  return (
    <div style={{ width: '80%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>History</h1>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th>Payment Id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date of Purchase</th>
          </tr>
        </thead>

        <tbody>
          {user.userData &&
            user.userData.history &&
            user.userData.history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.dateOfPurchase}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryPage
