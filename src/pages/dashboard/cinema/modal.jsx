import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

const ModalCinema = ({ open, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({ name: '', address: '' })
  const [errors, setErrors] = useState({ name: false, address: false })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || ''
      })
    } else {
      resetForm()
    }
  }, [initialData, open])

  const resetForm = () => {
    setFormData({ name: '', address: '' })
    setErrors({ name: false, address: false })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const validate = () => {
    const newErrors = {
      name: !formData.name.trim(),
      address: !formData.address.trim()
    }
    setErrors(newErrors)
    return !newErrors.name && !newErrors.address
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({ id: initialData?.id, ...formData })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Cập nhật' : 'Tạo mới'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên rạp"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name && 'Yêu cầu nhập tên rạp.'}
        />
        <TextField
          label="Địa chỉ"
          name="address"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          helperText={errors.address && 'Yêu cầu nhập địa chỉ.'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isLoading}>
          Huỷ
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : initialData ? 'Cập nhật' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCinema
