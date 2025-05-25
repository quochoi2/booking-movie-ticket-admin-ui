import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import cinemaService from "@/services/cinemaService";
import { SearchButton } from "@/components/button";
import { useDebounce } from "@/hooks/use-debound";
import { CircularProgress, Pagination } from "@mui/material";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import ModalCinema from "./modal";

const CinemaPage = () => {
  const [cinema, setCinema] = useState([]);
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
    cinemaService.getAll(query, page, pagination.pageSize)
      .then((res) => {
        setCinema(res.data);
        setPagination({
          totalItems: res.pagination.totalItems,
          currentPage: res.pagination.currentPage,
          pageSize: res.pagination.pageSize,
          totalPages: res.pagination.totalPages,
        });
      })
      .catch((err) => console.error("Error fetching cinema:", err));
  };
  
  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
   
  // create, update, delete
  const handleCreateOrUpdate = async (data) => {
    setLoading(true);
    try {
      let updatedCinema;
      if (data.id) {
        updatedCinema = await cinemaService.update(data);
      } else {
        updatedCinema = await cinemaService.create(data);
      }
      fetch(debouncedSearch, pagination.currentPage);
    } catch (err) {
      console.error("Error creating/updating cinema:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    if (window.confirm("Are you sure you want to delete this cinema?")) {
      try {
        await cinemaService.delete(data);
        fetch(debouncedSearch, pagination.currentPage);
      } catch (err) {
        console.error("Error deleting cinema:", err);
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
            Danh sách Rạp Chiếu
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["#", "tên", "địa chỉ", "hành động"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-sm font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cinema.map((obj, key) => {
                const className = `py-3 px-5 ${key === cinema.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={obj.id}>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {obj?.id || 'No Data'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {obj?.name || 'No Data'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {obj?.address || 'No Data'}
                      </Typography>
                    </td>
                    <td className={className} style={{ display: 'flex' }}>
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
      <ModalCinema
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editData}
      />
    </div>
  );
}
 
export default CinemaPage;