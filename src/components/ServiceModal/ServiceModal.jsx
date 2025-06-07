import { useState, useEffect } from 'react';
import checkPaymentService from '@/services/checkPaymentService';
import { useOrder } from '@/context/orderContext';
import CheckoutModal from '../CheckoutModal/CheckoutModal';

const ServiceModal = ({ onClose, onConfirm }) => {
  const [foods, setFoods] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { order, updateOrder } = useOrder();

  // checkout moda l
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await checkPaymentService.getFoods();
        setFoods(response.data.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const toggleServiceSelection = (food) => {
    setSelectedServices(prev => {
      const existingItem = prev.find(item => item.id === food.id);
      
      if (existingItem) {
        // Nếu đã có thì tăng số lượng
        return prev.map(item => 
          item.id === food.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Nếu chưa có thì thêm mới với quantity = 1
        return [...prev, { ...food, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (foodId) => {
    setSelectedServices(prev => {
      const existingItem = prev.find(item => item.id === foodId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.id === foodId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        // Nếu quantity = 1 thì xóa khỏi danh sách
        return prev.filter(item => item.id !== foodId);
      }
    });
  };

  const calculateServiceTotal = () => {
    return selectedServices.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleConfirm = () => {
    // Cập nhật vào context
    updateOrder({
      services: selectedServices,
      totalServicePrice: calculateServiceTotal(),
      totalPrice: order.totalSeatPrice + calculateServiceTotal()
    });
    
    setShowCheckoutModal(true);  
  };

  const handleFinalConfirm = () => {
    setShowCheckoutModal(false);
    onConfirm();
    onClose();
  };


  if (showCheckoutModal) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      >
        <CheckoutModal onConfirm={handleFinalConfirm} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div className="bg-gray-800 text-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Dịch vụ</h2>
            <button 
              onClick={onClose}
              className="cursor-pointer user-select-none text-gray-400 hover:text-white text-2xl"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {foods.map(food => (
                  <div 
                    key={food.id} 
                    className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition"
                  >
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <p className="text-gray-300 mb-2">{food.price.toLocaleString()}đ</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => decreaseQuantity(food.id)}
                          className="cursor-pointer user-select-none px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
                          disabled={!selectedServices.some(s => s.id === food.id)}
                        >
                          -
                        </button>
                        <span>
                          {selectedServices.find(s => s.id === food.id)?.quantity || 0}
                        </span>
                        <button 
                          onClick={() => toggleServiceSelection(food)}
                          className="cursor-pointer user-select-none px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected services */}
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">Dịch vụ đã chọn:</h4>
                {selectedServices.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {selectedServices.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="font-bold text-lg mt-2">
                      Tổng dịch vụ: {calculateServiceTotal().toLocaleString()}đ
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Chưa chọn dịch vụ nào</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="cursor-pointer user-select-none px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirm}
                  className="cursor-pointer user-select-none px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                >
                  Tiếp tục
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;