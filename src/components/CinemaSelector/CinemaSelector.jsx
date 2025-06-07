import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Divider
} from '@mui/material';
import checkPaymentService from '@/services/checkPaymentService';
import SeatModal from '../SeatModal/SeatModal';
import { useOrder } from '@/context/orderContext';

// Hàm định dạng thời gian
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const CinemaSelector = ({ onCinemaSelect }) => {
  const { updateOrder } = useOrder();

  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);

  // seats
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Lấy danh sách rạp
  const fetchCinemas = async () => {
    try {
      setLoadingCinemas(true);
      const response = await checkPaymentService.getCinemas();
      // console.log('cinema', response.data)
      setCinemas(response.data.data);
      setLoadingCinemas(false);
    } catch (err) {
      console.error('Lỗi khi tải rạp:', err);
      setLoadingCinemas(false);
    }
  };

  // Lấy danh sách phim theo rạp
  const fetchMoviesByCinema = async (cinemaId) => {
    try {
      setLoadingMovies(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await checkPaymentService.getMoviesByCinemaId(cinemaId, today);
      setMovies(response.data.data.movies);
      setLoadingMovies(false);
    } catch (err) {
      console.error('Lỗi khi tải phim:', err);
      setLoadingMovies(false);
    }
  };

  // Mở modal chọn rạp
  const openCinemaModal = async () => {
    if (cinemas.length === 0) {
      await fetchCinemas();
    }
    setIsCinemaModalOpen(true);
  };

  // Chọn rạp và mở modal phim
  const selectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setIsCinemaModalOpen(false);
    fetchMoviesByCinema(cinema.id);
    setIsMovieModalOpen(true);

    // Cập nhật thông tin rạp vào order context
    updateOrder({
      cinema: cinema.name,
      cinemaId: cinema.id
    });
  };

  // Chọn phim (nếu cần)
  const selectMovie = (movie) => {
    if (onCinemaSelect) {
      onCinemaSelect(selectedCinema, movie);
    }
    // setIsMovieModalOpen(false);

    // updateOrder({
    //   title: movie.title,
    //   movieId: movie.id
    // });
  };

  const handleShowtimeClick = (movie, showtime) => {
    // Cập nhật thông tin phim và suất chiếu vào order context
    updateOrder({
      title: movie.title,
      movieId: movie.id,
      showtime: `${formatTime(showtime.timeStart)} - ${formatTime(showtime.timeEnd)}`,
      showtimeId: showtime.id,
      date: new Date(showtime.timeStart).toLocaleDateString('vi-VN')
    });
    
    setSelectedShowtime(showtime);
    setIsSeatModalOpen(true);
  };

  return (
    <Box mb={4}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={openCinemaModal}
        sx={{ py: 2 }}
      >
        {selectedCinema ? `Rạp: ${selectedCinema.name}` : 'Chọn rạp'}
      </Button>

      {/* Modal chọn rạp */}
      <Dialog
        open={isCinemaModalOpen}
        onClose={() => setIsCinemaModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chọn rạp phim</DialogTitle>
        <DialogContent dividers>
          {loadingCinemas ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {cinemas.map(cinema => (
                <ListItem
                  button
                  key={cinema.id}
                  onClick={() => selectCinema(cinema)}
                >
                  <ListItemText
                    primary={cinema.name}
                    secondary={cinema.address}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCinemaModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Modal danh sách phim */}
      <Dialog
        open={isMovieModalOpen}
        onClose={() => setIsMovieModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Phim đang chiếu tại: {selectedCinema?.name}
        </DialogTitle>
        <DialogContent dividers>
          {loadingMovies ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {movies.length === 0 ? (
                <Typography variant="body1" align="center" py={4}>
                  Không có phim nào đang chiếu
                </Typography>
              ) : (
                movies.map(movie => (
                  <Box key={movie.id}>
                    <ListItem
                      button
                      onClick={() => selectMovie(movie)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={movie.image}
                          alt={movie.title}
                          variant="rounded"
                          sx={{ width: 56, height: 80, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={movie.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              display="block"
                            >
                              ({movie.duration}) phút
                            </Typography>
                            <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {movie.Showtimes
                                ?.slice()
                                .sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart))
                                .map(showtime => {
                                  const formatTime = (dateString) => {
                                    const date = new Date(dateString);
                                    return date.toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false
                                    });
                                  };

                                  return (
                                    <Box 
                                      key={showtime.id}
                                      onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                                    >
                                      <Chip
                                        label={`${formatTime(showtime.timeStart)} - ${formatTime(showtime.timeEnd)}`}
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShowtimeClick(movie, showtime);
                                        }}
                                        sx={{
                                          fontSize: '0.75rem',
                                          backgroundColor: '#e3f2fd',
                                          cursor: 'pointer',
                                          '&:hover': {
                                            backgroundColor: '#bbdefb',
                                          }
                                        }}
                                      />
                                    </Box>
                                  );
                                })}
                            </Box>
                          </>
                        }
                      />
                      </ListItem>

                      {/* Di chuyển modal ghế ra ngoài ListItem */}
                      {isSeatModalOpen && selectedShowtime && (
                        <SeatModal
                          cinemaId={selectedCinema?.id}
                          showtimeId={selectedShowtime.id}
                          onClose={() => setIsSeatModalOpen(false)}
                        />
                      )}
                    <Divider />
                  </Box>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMovieModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CinemaSelector;