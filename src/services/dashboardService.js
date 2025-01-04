import { requestApiJson } from "@/utils/requestApi";

const dashboardService = {
  getRevenueAndTicketAndUserToday: async () => {
    return await requestApiJson.get(`/statistic/today`)
      .then(res => {
        if (!res) {
          console.error('Fetching failed: No data');
          return;
        }
        return res.data;
      })
      .catch(err => {
        console.error('Error Fetching:', err);
        throw err;
      });
  },

  statisticByWeek: async (data) => {
    return await requestApiJson.post('statistic/week', data)
      .then(res => {
        if (!res) {
          console.error('Fetching failed: No data');
          return;
        }
        return res.data;
      })
      .catch(err => {
        console.error('Error Fetching by Week:', err);
        throw err;
      });
  },

  statisticByMonth: async (data) => {
    return await requestApiJson.post('statistic/month', data)
      .then(res => {
        if (!res) {
          console.error('Fetching failed: No data');
          return;
        }
        return res.data;
      })
      .catch(err => {
        console.error('Error Fetching by Month:', err);
        throw err;
      });
  },

  statisticByYear: async (data) => {
    return await requestApiJson.post('statistic/year', data)
      .then(res => {
        if (!res) {
          console.error('Fetching failed: No data');
          return;
        }
        return res.data;
      })
      .catch(err => {
        console.error('Error Fetching by Year:', err);
        throw err;
      });
  },
}

export default dashboardService;