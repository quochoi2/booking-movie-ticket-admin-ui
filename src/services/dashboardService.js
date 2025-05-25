import { requestApiJson } from "@/utils/requestApi";

const dashboardService = {
  statisticToday: async () => await requestApiJson.get("/statistic/public/statistic-today"),

  statisticRenevue: async (type, year, month) =>
    await requestApiJson.get(`/statistic/public/statistic-revenue-by-week-month-year?type=${type}&year=${year}&month=${month}`),

  getYears: async () => await requestApiJson.get("/statistic/public/statistic-order-by-year"),
};


export default dashboardService;