export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Để hiển thị giờ theo định dạng 24 giờ
    timeZone: 'Asia/Ho_Chi_Minh' // Đảm bảo giờ được hiển thị theo múi giờ Việt Nam
  }).replace(',', ''); // Loại bỏ dấu phẩy giữa ngày và giờ
}