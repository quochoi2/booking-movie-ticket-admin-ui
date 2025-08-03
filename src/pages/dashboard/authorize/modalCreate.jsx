import React, { useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Typography
} from '@material-tailwind/react'
import AuthorizeService from '@/services/authorizeService'

const CreateEmployeeModal = ({ open, handleOpen }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    role: 'employee'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')

      // Validate
      if (!formData.email || !formData.username || !formData.password) {
        throw new Error('Vui lòng điền đầy đủ thông tin')
      }

      // Log dữ liệu sẽ gửi lên
      // console.group('Dữ liệu đang gửi lên server:');
      // console.log('Form Data:', formData);
      // console.log('Payload sẽ gửi:', {
      //   fullname: formData.fullname,
      //   email: formData.email,
      //   username: formData.username,
      //   password: formData.password, // Ẩn mật khẩu thực sự trong log
      //   role: formData.role
      // });
      // console.groupEnd();

      // Gọi API đăng ký
      const response = await AuthorizeService.registerEmployee(formData)

      console.log('Đăng ký thành công:', response.data)
      handleOpen(false)
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err)

      // Log chi tiết lỗi
      console.group('Chi tiết lỗi:')
      console.error('Error message:', err.message)
      if (err.response) {
        console.error('Response data:', err.response.data)
        console.error('Status code:', err.response.status)
      }
      console.groupEnd()

      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Tạo tài khoản nhân viên</DialogHeader>
      <DialogBody divider className="flex flex-col gap-4">
        {error && (
          <Typography color="red" className="mb-2">
            {error}
          </Typography>
        )}

        <Input
          label="Họ và tên"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Tên đăng nhập"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Select
          label="Vai trò"
          value={formData.role}
          onChange={handleRoleChange}
        >
          <Option value="employee">Nhân viên</Option>
          <Option value="admin">Quản lý</Option>
        </Select>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => handleOpen(false)}
          className="mr-1"
        >
          Hủy
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default CreateEmployeeModal
