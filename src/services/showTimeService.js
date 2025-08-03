import { requestApiJson } from '@/utils/requestApi'

const showTimeService = {
  getAll: async (search, page, pageSize = 5) => {
    return await requestApiJson
      .get(
        `/show-time/search?search=${search}&page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        if (!res) {
          console.error('Fetching failed: No data')
          return
        }
        return res.data
      })
      .catch((err) => {
        console.error('Error Fetching:', err)
        throw err
      })
  },

  create: async (data) => {
    try {
      const res = await requestApiJson.post('/show-time/create', data)
      return res.data
    } catch (err) {
      if (err.response?.data) {
        return err.response.data
      }
      return {
        code: -1,
        message: 'Lỗi hệ thống khi tạo lịch chiếu'
      }
    }
  },

  update: async (data) => {
    try {
      const res = await requestApiJson.put('/show-time/update/' + data.id, data)
      return res.data
    } catch (err) {
      if (err.response?.data) {
        return err.response.data
      }
      return {
        code: -1,
        message: 'Lỗi hệ thống khi tạo lịch chiếu'
      }
    }
  },

  delete: async (data) => {
    try {
      const res = await requestApiJson.delete('/show-time/delete/' + data.id)
      return res.data
    } catch (err) {
      if (err.response?.data) {
        return err.response.data
      }
      return {
        code: -1,
        message: err.message || 'Lỗi hệ thống'
      }
    }
  },

  autoGenerate: async (data) => {
    try {
      const res = await requestApiJson.post('/show-time/create-auto', data)
      return res.data
    } catch (err) {
      if (err.response?.data) {
        return err.response.data
      }
      return {
        code: -1,
        message: 'Lỗi hệ thống khi tạo lịch chiếu'
      }
    }
  }
}

export default showTimeService
