import { useState, useEffect } from 'react'
import checkPaymentService from '@/services/checkPaymentService'
import ServiceModal from '../ServiceModal/ServiceModal'
import { useOrder } from '@/context/orderContext'

const SeatModal = ({ cinemaId, showtimeId, onClose }) => {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // open service modal
  const [showServiceModal, setShowServiceModal] = useState(false)

  // save seats into order
  const { updateOrder } = useOrder()

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true)
        const response = await checkPaymentService.getSeats(
          cinemaId,
          showtimeId
        )
        console.log(response.data.data)
        setSeats(response.data.data)
        setError(null)
      } catch (err) {
        setError('Không thể tải danh sách ghế. Vui lòng thử lại.')
        console.error('Error fetching seats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (cinemaId) {
      fetchSeats()
    }
  }, [cinemaId])

  const toggleSeatSelection = (seat) => {
    if (seat.isBooked) return

    setSelectedSeats((prev) => {
      const currentCount = prev.reduce(
        (total, s) => total + (s.type === 'couple' ? 2 : 1),
        0
      )

      // Nếu ghế đã được chọn thì bỏ chọn
      if (prev.some((s) => s.id === seat.id)) {
        return prev.filter((s) => s.id !== seat.id)
      }
      // Kiểm tra nếu thêm ghế này sẽ vượt quá giới hạn
      else if (currentCount + (seat.type === 'couple' ? 2 : 1) > 10) {
        alert(`Bạn chỉ được chọn tối đa ${10} chỗ ngồi`)
        return prev
      }
      // Thêm ghế vào danh sách đã chọn
      else {
        return [...prev, seat]
      }
    })
  }

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  }

  const handleAddSeats = () => {
    // Chuẩn bị dữ liệu ghế để lưu vào Context
    const seatData = selectedSeats.map((seat) => ({
      id: seat.id,
      name: seat.name,
      price: seat.price,
      type: seat.type
    }))

    // Cập nhật vào Context
    updateOrder({
      seats: seatData,
      totalSeatPrice: calculateTotal(),
      totalPrice: calculateTotal()
    })

    setShowServiceModal(true)
  }

  const handleServiceConfirm = () => {
    setShowServiceModal(false)
    onClose() // Đóng SeatModal khi xác nhận từ ServiceModal
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      }}
    >
      <div className="bg-gray-800 text-white rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold" style={{ fontSize: '28px' }}>
              Danh sách ghế
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <>
              {/* Screen */}
              <div className="mb-8">
                <div className="bg-gray-700 h-12 w-full rounded-t-lg flex items-center justify-center mb-2">
                  <span className="text-lg font-semibold">MÀN HÌNH</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              </div>

              {/* Seat map */}
              <div className="mb-8">
                {/* Group seats by row */}
                {Object.entries(
                  seats.reduce((rows, seat) => {
                    const row = seat.name.match(/^([A-Z]+)/)[0] // Extract row letter (A, B, C...)
                    if (!rows[row]) rows[row] = []
                    rows[row].push(seat)
                    return rows
                  }, {})
                ).map(([row, rowSeats]) => {
                  // Check if this row has couple seats
                  const hasCoupleSeats = rowSeats.some(
                    (seat) => seat.type === 'couple'
                  )

                  return (
                    <div key={row} className="mb-4">
                      <div
                        className={`grid gap-2 ${hasCoupleSeats ? 'grid-cols-10' : 'grid-cols-10'}`}
                      >
                        {rowSeats.map((seat) => (
                          <div
                            key={seat.id}
                            style={{ userSelect: 'none' }}
                            onClick={() => toggleSeatSelection(seat)}
                            className={`flex items-center justify-center h-10 rounded-md cursor-pointer transition-all
                              ${
                                seat.isBooked
                                  ? 'bg-gray-600 cursor-not-allowed'
                                  : selectedSeats.some((s) => s.id === seat.id)
                                    ? 'bg-green-500'
                                    : seat.type === 'vip'
                                      ? 'bg-red-500'
                                      : seat.type === 'couple'
                                        ? 'bg-pink-500'
                                        : 'bg-blue-500'
                              }
                              ${seat.type === 'couple' ? 'col-span-2' : ''}
                            `}
                          >
                            {seat.name}
                            {seat.type === 'couple' && (
                              <span className="text-xs ml-1"></span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                  <span>Ghế thường</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                  <span>Ghế VIP</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-pink-500 rounded mr-2"></div>
                  <span>Ghế cặp</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-600 rounded mr-2"></div>
                  <span>Đã đặt</span>
                </div>
              </div>

              {/* Selected seats and total */}
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">Ghế đã chọn:</h4>
                {selectedSeats.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat.id}
                          className={`px-3 py-1 rounded flex items-center ${
                            seat.type === 'vip'
                              ? 'bg-red-500'
                              : seat.type === 'couple'
                                ? 'bg-pink-500'
                                : 'bg-blue-500'
                          }`}
                        >
                          {seat.name}
                          <span className="ml-1 text-sm">
                            (
                            {seat.type === 'vip'
                              ? 'VIP'
                              : seat.type === 'couple'
                                ? 'Cặp'
                                : 'Thường'}
                            )
                          </span>
                          <span className="ml-2 font-medium">
                            {seat.price.toLocaleString()}đ
                            {seat.type === 'couple' && (
                              <span className="text-xs ml-1">(2 chỗ)</span>
                            )}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg">
                        Ước tính: {calculateTotal().toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-300">
                        {selectedSeats.filter((s) => s.type === 'couple')
                          .length > 0 && (
                          <span>
                            (Đã bao gồm{' '}
                            {
                              selectedSeats.filter((s) => s.type === 'couple')
                                .length
                            }{' '}
                            ghế cặp)
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Chưa chọn ghế nào</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddSeats}
                  disabled={selectedSeats.length === 0}
                  className={`cursor-pointer px-4 py-2 rounded transition
                    ${selectedSeats.length > 0 ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-500 cursor-not-allowed'}
                  `}
                >
                  Tiếp tục
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showServiceModal && (
        <ServiceModal
          onClose={() => {
            setShowServiceModal(false)
          }}
          onConfirm={handleServiceConfirm}
        />
      )}
    </div>
  )
}

export default SeatModal
