import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

const ModalMovie = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleAnother: '',
    image: null,
    video: '',
    description: '',
    type: '',
    studio: '',
    dateAired: '',
    score: '',
    duration: '',
    quality: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        title: initialData.title || '',
        titleAnother: initialData.titleAnother || '',
        image: initialData.image || '',
        video: initialData.video || '',
        description: initialData.description || '',
        type: initialData.type || '',
        studio: initialData.studio || '',
        dateAired: initialData.dateAired || '',
        score: initialData.score || '',
        duration: initialData.duration || '',
        quality: initialData.quality || ''
      })
    } else {
      resetForm()
    }
  }, [initialData])

  const resetForm = () => {
    setFormData({
      title: '',
      titleAnother: '',
      image: '',
      video: '',
      description: '',
      type: '',
      studio: '',
      dateAired: '',
      score: '',
      duration: '',
      quality: ''
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = () => {
    onSubmit({ ...formData })
    onClose()
    resetForm()
    // console.log({ ...formData });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Cập nhật' : 'Tạo mới'}</DialogTitle>
      <DialogContent>
        {/* title  */}
        <div className="mt-5">
          <TextField
            label="Tên phim"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        {/* titleAnother  */}
        <div className="mt-5">
          <TextField
            label="Tên khác"
            name="titleAnother"
            fullWidth
            value={formData.titleAnother}
            onChange={handleChange}
            required
          />
        </div>
        {/* Video Link */}
        <div className="mt-5">
          <TextField
            label="Link video"
            name="video"
            fullWidth
            value={formData.video}
            onChange={handleChange}
          />
        </div>
        {/* Decription */}
        <div className="mt-5">
          <TextField
            label="Mô tả"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* type  */}
        <div className="mt-5">
          <TextField
            label="Kiểu"
            name="type"
            fullWidth
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        {/* studio  */}
        <div className="mt-5">
          <TextField
            label="Studio"
            name="studio"
            fullWidth
            value={formData.studio}
            onChange={handleChange}
            required
          />
        </div>
        {/* dateAired */}
        <div className="mt-5">
          <TextField
            label="Ngày công chiếu"
            name="dateAired"
            type="date"
            fullWidth
            value={formData.dateAired}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </div>
        {/* status  */}
        {/* <div className="mt-5">
          <TextField
            label="Status"
            name="status"
            fullWidth
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* score  */}
        <div className="mt-5">
          <TextField
            label="Điểm số"
            name="score"
            fullWidth
            value={formData.score}
            onChange={handleChange}
            required
          />
        </div>
        {/* Duration */}
        <div className="mt-5">
          <TextField
            label="Thời gian"
            name="duration"
            fullWidth
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="mt-5">
          <SelectMonth
            selected={formData.duration}
            setSelected={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
          />
        </div> */}
        {/* quality  */}
        <div className="mt-5">
          <TextField
            label="Chất lượng"
            name="quality"
            fullWidth
            value={formData.quality}
            onChange={handleChange}
            required
          />
        </div>
        {/* Image */}
        <div className="mt-5">
          {formData.image && typeof formData.image === 'string' && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-auto rounded-md"
            />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Huỷ
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? 'Cập nhật' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalMovie
