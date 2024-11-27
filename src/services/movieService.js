import { requestApi } from "@/utils/requestApi";

const movieService = {
  getAll: async (search, page, pageSize = 5) => {
    return await requestApi.get(`/movie/search?search=${search}&page=${page}&pageSize=${pageSize}`)
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
    return await requestApi.post('/movie', data)
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
    return await requestApi.put('/movie/' + id, data)
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
    return await requestApi.delete('/movie/' + data.id)
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

export default movieService;