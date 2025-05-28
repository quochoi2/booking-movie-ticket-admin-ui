import { requestApiJson } from "@/utils/requestApi";

const dashboardService = {
  statisticToday: async () => await requestApiJson.get("/statistic/public/statistic-today"),

  statisticRenevue: async (type = 'month', year = 2025, month = 6) =>
    await requestApiJson.get(`/statistic/public/statistic-revenue-by-week-month-year?type=${type}&year=${year}&month=${month}`),

  getYears: async () => await requestApiJson.get("/statistic/public/statistic-order-by-year"),
};


export default dashboardService;