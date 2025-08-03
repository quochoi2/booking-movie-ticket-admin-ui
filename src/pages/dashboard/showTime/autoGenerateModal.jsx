import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Box
} from '@mui/material'
import movieService from '@/services/movieService'
import cinemaService from '@/services/cinemaService'
import { TrashIcon } from '@heroicons/react/24/solid'

const AutoGenerateModal = ({ open, handleOpen, onSubmit }) => {
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaIds: [],
    startDate: '',
    endDate: '',
    timeSlots: []
  })
  const [movies, setMovies] = useState([])
  const [cinemas, setCinemas] = useState([])

  useEffect(() => {
    if (open) {
      movieService
        .getAll('', 1, 100)
        .then((res) => {
          // console.log("Movies fetched:", res);
          setMovies(res.data)
        })
        .catch((err) => {
          console.error('Error fetching movies:', err)
        })

      cinemaService
        .getAll('', 1, 100)
        .then((res) => {
          // console.log("Cinemas fetched:", res);
          setCinemas(res.data)
        })
        .catch((err) => {
          console.error('Error fetching cinemas:', err)
        })
    }
  }, [open])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...formData.timeSlots]
    newTimeSlots[index] = value
    setFormData((prev) => ({ ...prev, timeSlots: newTimeSlots }))
  }

  const addTimeSlot = () => {
    setFormData((prev) => ({ ...prev, timeSlots: [...prev.timeSlots, ''] }))
  }

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onClose={handleOpen} fullWidth maxWidth="md">
      <DialogTitle>Tự động tạo lịch chiếu</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Chọn phim */}
          <FormControl fullWidth>
            <InputLabel>Chọn phim</InputLabel>
            <Select
              value={formData.movieId}
              onChange={(e) => handleChange('movieId', e.target.value)}
              label="Chọn phim"
            >
              {movies.map((movie) => (
                <MenuItem key={movie.id} value={movie.id}>
                  {movie.title} ({movie.duration} phút)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Chọn rạp */}
          <FormControl fullWidth>
            <InputLabel>Chọn rạp</InputLabel>
            <Select
              multiple
              value={formData.cinemaIds}
              onChange={(e) => handleChange('cinemaIds', e.target.value)}
              label="Chọn rạp"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={cinemas.find((c) => c.id === value)?.name || value}
                    />
                  ))}
                </Box>
              )}
            >
              {cinemas.map((cinema) => (
                <MenuItem key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Ngày bắt đầu/kết thúc */}
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Ngày bắt đầu"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Ngày kết thúc"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Khung giờ */}
          <Box>
            <Box mb={1} fontWeight="bold">
              Khung giờ chiếu
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {formData.timeSlots.map((slot, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  width="180px"
                >
                  <TextField
                    type="time"
                    value={slot}
                    onChange={(e) =>
                      handleTimeSlotChange(index, e.target.value)
                    }
                    fullWidth
                  />
                  <IconButton
                    onClick={() => removeTimeSlot(index)}
                    color="error"
                    size="small"
                  >
                    <TrashIcon className="h-5 w-5 text-blue-gray-500" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Button variant="outlined" onClick={addTimeSlot} sx={{ mt: 2 }}>
              Thêm khung giờ
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen} color="secondary">
          Hủy
        </Button>
        <Button
          onClick={async () => {
            await onSubmit(formData)
            // console.log(formData);
            setFormData({
              movieId: '',
              cinemaIds: [],
              startDate: '',
              endDate: '',
              timeSlots: []
            })
            handleOpen()
          }}
          color="primary"
        >
          Tạo lịch tự động
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AutoGenerateModal
