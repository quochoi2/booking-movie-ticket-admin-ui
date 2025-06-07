import { requestApiJson } from "@/utils/requestApi";

const checkPaymentService = {
  checkQR: async (qrData) => await requestApiJson.post(`/qrcode/check-qrcode`, qrData),

  getMoviesByCinemaId: async (cinemaId, date) => await requestApiJson.get(`/movie/public/cinema/${cinemaId}?date=${date}`),

  getCinemas: async () => await requestApiJson.get(`/cinema/search?page=1&pageSize=10`),

  getSeats: async (cinemaId, showtimeId) => await requestApiJson.get(`/seat/public/by-cinema/${cinemaId}?showtimeId=${showtimeId}`),

  getFoods: async () => await requestApiJson.get(`/food/public/search`),

  directPayment: async (data) => await requestApiJson.post(`qrcode/direct-payment`, data),
}

export default checkPaymentService;