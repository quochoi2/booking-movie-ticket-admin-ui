import { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    title: '',
    showtime: '',
    date: '',
    cinema: '',
    seats: [],
    totalSeatPrice: 0,
    services: [],
    totalServicePrice: 0,
    totalPrice: 0,
    movieId: null,
    cinemaId: null,
    showtimeId: null
  })

  // Tự động log khi order thay đổi
  useEffect(() => {
    console.log('Order updated:', order)
  }, [order])

  const updateOrder = (newData) => {
    setOrder((prev) => {
      const updatedOrder = { ...prev, ...newData }

      // Tính toán lại tổng tiền nếu có thay đổi về ghế hoặc dịch vụ
      if (newData.seats || newData.services) {
        updatedOrder.totalSeatPrice = updatedOrder.seats.reduce(
          (sum, seat) => sum + seat.price,
          0
        )
        updatedOrder.totalServicePrice = updatedOrder.services.reduce(
          (sum, service) => sum + service.price * service.quantity,
          0
        )
        updatedOrder.totalPrice =
          updatedOrder.totalSeatPrice + updatedOrder.totalServicePrice
      }

      return updatedOrder
    })
  }

  const resetOrder = () => {
    setOrder({
      title: '',
      showtime: '',
      date: '',
      cinema: '',
      seats: [],
      totalSeatPrice: 0,
      services: [],
      totalServicePrice: 0,
      totalPrice: 0,
      movieId: null,
      cinemaId: null,
      showtimeId: null
    })
  }

  return (
    <OrderContext.Provider value={{ order, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
