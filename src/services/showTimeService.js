import { requestApiJson } from "@/utils/requestApi";

const showTimeService = {
  getAll: async (search, page, pageSize = 5) => {
    return await requestApiJson.get(`/show-time/search?search=${search}&page=${page}&pageSize=${pageSize}`)
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

  create: async (data) => {
    return await requestApiJson.post('/show-time', data)
      .then(res => {
        if (!res) {
          console.error('Creating failed');
          return;
        }
        return res;
      }).catch(err => {
        console.error('Error Creating:', err);
        throw err;
      });
  },

  update: async (id, data) => {
    return await requestApiJson.put('/show-time/' + id, data)
      .then(res => {
        if (!res) {
          console.error('Updating failed');
          return;
        }
        return res;
      }).catch(err => {
        console.error('Error Updating:', err);
        throw err;
      });
  },

  delete: async (data) => {
    return await requestApiJson.delete('/show-time/' + data.id)
      .then(res => {
        if (!res) {
          console.error('Deleting failed');
          return;
        }
        return res;
      }).catch(err => {
        console.error('Error Deleting:', err);
        throw err;
      });
  },
}

export default showTimeService;