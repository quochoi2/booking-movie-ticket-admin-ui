import { requestApiJson } from "@/utils/requestApi";

const checkPaymentService = {
  checkQR: async (qrData) => await requestApiJson.post(`/qrcode/check-qrcode`, qrData)
}

export default checkPaymentService;