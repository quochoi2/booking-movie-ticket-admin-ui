import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { SearchButton } from "@/components/button";
import { useDebounce } from "@/hooks/use-debound";
import { CircularProgress, Pagination } from "@mui/material";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import movieService from "@/services/movieService";
import ModalMovie from "./modal";
import { formatDate } from "@/utils/formatDate";

const MoviePage = () => {
  const [movie, setMovie] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(debouncedSearch, 1);
  }, [debouncedSearch]);
  
  useEffect(() => {
    fetch(search, pagination.currentPage);
  }, [pagination.currentPage]);
  
  const fetch = (query = '', page = 1) => {
    movieService.getAll(query, page, pagination.pageSize)
      .then((res) => {
        setMovie(res.data);
        setPagination({
          totalItems: res.pagination.totalItems,
          currentPage: res.pagination.currentPage,
          pageSize: res.pagination.pageSize,
          totalPages: res.pagination.totalPages,
        });
      })
      .catch((err) => console.error("Error fetching movie:", err));
  };
  
  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
   

  // create, update, delete
  const handleCreateOrUpdate = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('titleAnother', data.titleAnother);
      formData.append('video', data.video);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('studio', data.studio);
      formData.append('dateAired', data.dateAired);
      // formData.append('status', data.status);
      formData.append('score', data.score);
      formData.append('duration', data.duration);
      formData.append('quality', data.quality);
      if (data.image) {
        formData.append('image', data.image);
      }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      let updatedMovie;
      if (data.id) {
        updatedMovie = await movieService.update(data.id, formData);
      } else {
        updatedMovie = await movieService.create(formData);
      }
      fetch(debouncedSearch, pagination.currentPage);
    } catch (err) {
      console.error("Error creating/updating movie:", err);
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (data) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieService.delete(data);
        fetch(debouncedSearch, pagination.currentPage);
      } catch (err) {
        console.error("Error deleting movie:", err);
      }
    }
  };
  
  const openCreateModal = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEditModal = (data) => {
    setEditData(data);
    setModalOpen(true);
  };

  return ( 
    <div className="relative mt-12 mb-8 flex flex-col gap-12">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress color="inherit" />
        </div>
      )}      
      <div className="absolute -top-[95px] flex justify-end right-[255px]">
        <div className="flex justify-between gap-3">
          <div>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={openCreateModal}
            >
              <PlusCircleIcon className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
          </div>
          <div>
            <SearchButton onSearch={setSearch} />
          </div>
        </div>
      </div>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h5" color="white">
            Danh sách Phim
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["tên", "mô tả", "kiểu", "studio", "ngày công chiếu", "tình trạng", "điểm số", "thời gian", "chất lượng", "hành động"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left w-[250px]"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movie.map((obj, key) => {
                const className = `py-3 px-5 ${
                  key === movie.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={obj.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4 w-[200px]">
                        <Avatar src={obj.image} alt={obj.publicId} size="sm" variant="rounded" />
                        <div>
                          <Typography
                            className="font-semibold leading-[18px]"
                            title={obj?.title}
                          >
                            {obj?.title?.length > 30 ? `${obj?.title?.substring(0, 30)}...` : obj?.title || 'No title'}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {obj?.titleAnother}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[200px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600"
                          title={obj?.description}
                        >
                          {obj?.description?.length > 85 ? `${obj?.description?.substring(0, 85)}...` : obj?.description || 'No description'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.type || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.studio || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.dateAired ? formatDate(obj.dateAired) : ""}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.status === 0 ? 'Airved' : 'Airving'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.score || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.duration || 'N/A'} minus
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[80px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.quality || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className} style={{ display: 'flex', alignItems: 'center', height: '92px' }}>
                      <IconButton variant="text" color="blue-gray" onClick={() => openEditModal(obj)}>
                        <PencilIcon className="h-5 w-5 text-blue-gray-500" />
                      </IconButton>
                      <IconButton variant="text" color="blue-gray" onClick={() => handleDelete(obj)}>
                        <TrashIcon className="h-5 w-5 text-blue-gray-500" />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Fixed Pagination */}
          <div className="sticky  bottom-0 left-0 w-full bg-white z-10">
            <div className="flex justify-end w-full pt-5 pr-5">
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                color="primary"
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <ModalMovie
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editData}
      />
    </div>
  );
}
 
export default MoviePage;