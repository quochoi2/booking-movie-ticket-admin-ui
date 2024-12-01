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

export const formatDateToInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
