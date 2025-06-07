import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr'; // Thêm dòng này
import checkPaymentService from '@/services/checkPaymentService';
import CinemaSelector from '@/components/CinemaSelector/CinemaSelector';

const QRScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  const [selectedCinema, setSelectedCinema] = useState(null);

  // Xử lý khi chọn rạp
  const handleCinemaSelect = (cinema, movie) => {
    setSelectedCinema(cinema);
    // Có thể làm gì đó với thông tin phim nếu cần
  };

  // Hàm hiển thị thông báo tạm thời
  const showTempMessage = (type, message) => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 3000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Lấy danh sách camera
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      showTempMessage('error', 'Không thể truy cập camera');
      console.error(err);
    }
  };

  // Bật camera
  const startScanner = async () => {
    try {
      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
      console.error(err);
      setIsScanning(false);
    }
  };

  // Tắt camera
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Hàm quét QR
  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const checkFrame = () => {
      if (!isScanning) return;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setScanResult(code.data);
          verifyQRCode(code.data);
          return;
        }
      }
      requestAnimationFrame(checkFrame);
    };
    
    checkFrame();
  };

  // Xác minh QR với backend
  const verifyQRCode = async (qrData) => {
    try {
      setIsScanning(false);
      
      // Tạo đúng format backend yêu cầu
      const requestData = {
        qrData: JSON.stringify({
          paymentId: qrData
        })
      };
    
      const response = await checkPaymentService.checkQR(requestData);
      // console.log('Phản hồi từ server:', response.data);

      if (response.data.success) {
        showTempMessage('success', `Xác minh thành công cho ${response.data.order.name}`);
      } else {
        showTempMessage('error', 'Mã QR không hợp lệ. Vui lòng thử lại.');
        setTimeout(() => setIsScanning(true), 5000);
      }
    } catch (err) {
      showTempMessage('error', 'Lỗi khi xác minh QR. Vui lòng thử lại.');
      console.error(err);
      setTimeout(() => setIsScanning(true), 5000);
    }
  };

  // Bật/tắt scanner
  const toggleScanner = () => {
    if (!isScanning) {
      getCameraDevices();
    }
    setIsScanning(!isScanning);
    setScanResult('');
    setError('');
  };

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning, selectedDevice]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Quét mã QR</h1>
      
      {/* Thêm component chọn rạp */}
      <CinemaSelector onCinemaSelect={handleCinemaSelect} />

      <div className="relative mb-4">
        <video
          ref={videoRef}
          className={`w-full h-64 object-cover rounded-lg border-2 ${isScanning ? 'border-green-500' : 'border-gray-300'}`}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isScanning && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <p className="text-white text-lg">Camera đang tắt</p>
          </div>
        )}
      </div>
      
      {cameraDevices.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chọn camera
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isScanning}
          >
            {cameraDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button
        onClick={toggleScanner}
        className={`w-full py-2 px-4 rounded-md font-medium ${isScanning 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {isScanning ? 'Dừng quét' : 'Bắt đầu quét'}
      </button>
      
      {/* Thông báo thành công */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md animate-fade-in">
          {success}
        </div>
      )}
      
      {/* Thông báo lỗi */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;