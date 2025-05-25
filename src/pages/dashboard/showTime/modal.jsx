import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import movieService from "@/services/movieService";
import cinemaService from "@/services/cinemaService";
import { formatDateToInput } from "@/utils/formatDate";

const parseInputToDate = (input) => {
  if (!input) return null;
  return new Date(input);
};

const ModalShowTime = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    timeStart: "",
    movieId: "",
    cinemaId: "",
  });  
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        timeStart: initialData.timeStart ? formatDateToInput(initialData.timeStart) : "",
        movieId: initialData.movieId || "",
        cinemaId: initialData.cinemaId || "",
      });
    } else {
      setFormData({ timeStart: "", movieId: "", cinemaId: "" });
    }
  }, [initialData]);

  useEffect(() => {
    setLoading(true);
    Promise.all([movieService.getAll(), cinemaService.getAll()])
      .then(([moviesRes, cinemasRes]) => {
        // console.log(moviesRes.data);
        const filteredMovies = (moviesRes.data || []).filter(movie => movie.status === 0);
        setMovies(filteredMovies);
        setCinemas(cinemasRes.data || []);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.timeStart || !formData.movieId || !formData.cinemaId) {
      alert(`All fields are required`);
      return;
    }
    const dataToSubmit = {
      ...formData,
      id: initialData?.id,
      timeStart: parseInputToDate(formData.timeStart),
    };

    // console.log(dataToSubmit);
    await onSubmit(dataToSubmit);
    onClose();
    setFormData({ timeStart: "", movieId: "", cinemaId: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit ShowTime" : "Create ShowTime"}</DialogTitle>
      <DialogContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TextField
              label="Thời gian chiếu"
              type="datetime-local"
              name="timeStart"
              value={formData.timeStart}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="movie-select-label">Phim chiếu</InputLabel>
              <Select
                labelId="movie-select-label"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
              >
                {movies.length > 0 ? movies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  )) : (
                    <MenuItem>Không tìm thấy phim chiếu</MenuItem>
                  )}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="cinema-select-label">Rạp chiếu</InputLabel>
              <Select
                labelId="cinema-select-label"
                name="cinemaId"
                value={formData.cinemaId}
                onChange={handleChange}
              >
                {cinemas.length > 0 ? cinemas.map((cinema) => (
                  <MenuItem key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </MenuItem>
                )) : (
                  <MenuItem>Không tìm thấy rạp chiếu</MenuItem>
                )}
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Huỷ
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? "Cập nhật" : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalShowTime;
