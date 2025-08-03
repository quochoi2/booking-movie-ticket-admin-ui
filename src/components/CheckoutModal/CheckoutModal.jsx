import { useState } from 'react'
import { useOrder } from '@/context/orderContext'
import checkPaymentService from '@/services/checkPaymentService'

const CheckoutModal = ({ onConfirm }) => {
  const { order } = useOrder()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setPaymentError(null)

      // Chuẩn bị dữ liệu gửi lên API
      const paymentData = {
        movieId: order.movieId,
        cinemaId: order.cinemaId,
        showtimeId: order.showtimeId,
        seats: order.seats.map((seat) => ({
          id: seat.id,
          price: seat.price,
          type: seat.type
        })),
        services: order.services.map((service) => ({
          id: service.id,
          price: service.price,
          quantity: service.quantity
        })),
        totalPrice: order.totalPrice,
        showtime: order.showtime,
        date: order.date,
        cinema: order.cinema,
        title: order.title
      }

      // Gọi API thanh toán
      const response = await checkPaymentService.directPayment(paymentData)

      // Xử lý kết quả
      if (response.data.success) {
        alert('Xác nhận thành công!')
        onConfirm()
      } else {
        setPaymentError(response.data.message || 'Thanh toán không thành công')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError('Đã có lỗi xảy ra khi thanh toán')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-gray-800 text-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">Xác nhận đơn hàng</h2>

      {/* Container chính có thể cuộn */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {/* Thông tin phim */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">
            Thông tin vé
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Phim:</span>{' '}
              {order.title || 'Chưa chọn'}
            </p>
            <p>
              <span className="font-medium">Rạp:</span>{' '}
              {order.cinema || 'Chưa chọn'}
            </p>
            <p>
              <span className="font-medium">Ngày:</span>{' '}
              {order.date || 'Chưa chọn'}
            </p>
            <p>
              <span className="font-medium">Suất chiếu:</span>{' '}
              {order.showtime || 'Chưa chọn'}
            </p>
          </div>
        </div>

        {/* Ghế đã chọn */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">
            Ghế đã chọn
          </h3>
          {order.seats?.length > 0 ? (
            <>
              <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                {order.seats.map((seat) => (
                  <div key={seat.id} className="flex justify-between">
                    <span>
                      {seat.name} (
                      {seat.type === 'vip'
                        ? 'VIP'
                        : seat.type === 'couple'
                          ? 'Cặp'
                          : 'Thường'}
                      )
                      {seat.type === 'couple' && (
                        <span className="text-xs ml-1">(2 chỗ)</span>
                      )}
                    </span>
                    <span>{seat.price.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <div className="font-medium pt-2 border-t border-gray-600">
                Tổng ghế: {order.totalSeatPrice?.toLocaleString()}đ
              </div>
            </>
          ) : (
            <p className="text-gray-400">Chưa chọn ghế</p>
          )}
        </div>

        {/* Dịch vụ */}
        <div className="mb-6">
          {order.services?.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">
                Dịch vụ
              </h3>
              <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                {order.services.map((service) => (
                  <div key={service.id} className="flex justify-between">
                    <span>
                      {service.name} x {service.quantity}
                    </span>
                    <span>
                      {(service.price * service.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-medium pt-2 border-t border-gray-600">
                Tổng dịch vụ: {order.totalServicePrice?.toLocaleString()}đ
              </div>
            </>
          ) : (
            <p className="text-gray-400"></p>
          )}
        </div>
      </div>

      {/* Tổng cộng và nút xác nhận (luôn hiển thị ở dưới) */}
      <div className="mt-auto">
        {paymentError && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-center">
            {paymentError}
          </div>
        )}

        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{order.totalPrice?.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="flex justify-center">
          <button
            onClick={handlePayment}
            className={`px-6 py-3 rounded-lg font-medium text-lg w-full ${
              isProcessing || order.seats?.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}
            disabled={isProcessing || order.seats?.length === 0}
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal
