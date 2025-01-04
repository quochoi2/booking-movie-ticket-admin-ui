import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { SearchButton } from "@/components/button";
import { useDebounce } from "@/hooks/use-debound";
import { CircularProgress, Pagination } from "@mui/material";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { formatDate } from "@/utils/formatDate";
import showTimeService from "@/services/showTimeService";
import ModalShowTime from "./modal";

const ShowTimePage = () => {
  const [showTime, setShowTime] = useState([]);
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
    showTimeService.getAll(query, page, pagination.pageSize)
      .then((res) => {
        setShowTime(res.data);
        setPagination({
          totalItems: res.pagination.totalItems,
          currentPage: res.pagination.currentPage,
          pageSize: res.pagination.pageSize,
          totalPages: res.pagination.totalPages,
        });
      })
      .catch((err) => console.error("Error fetching show time:", err));
  };
  
  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
   

  // create, update, delete
  const handleCreateOrUpdate = async (data) => {
    setLoading(true);
    try {
      let updatedShowTime;
      if (data.id) {
        updatedShowTime = await showTimeService.update(data);
      } else {
        updatedShowTime = await showTimeService.create(data);
      }
      fetch(debouncedSearch, pagination.currentPage);
    } catch (err) {
      console.error("Error creating/updating show time:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    if (window.confirm("Are you sure you want to delete this show time?")) {
      try {
        await showTimeService.delete(data);
        fetch(debouncedSearch, pagination.currentPage);
      } catch (err) {
        console.error("Error deleting show time:", err);
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

  // filter time >
  const filterShowTime = (data) => {
    const now = new Date();
    return data.filter((show) => new Date(show.timeEnd) > now);
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
            Show Time Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["movie", "cinema", "time start", "time end", "actions"].map((el) => (
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
              {showTime.map((obj, key) => {
                const className = `py-3 px-5 ${key === showTime.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={obj.id}>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography 
                          className="text-sm font-semibold text-blue-gray-600 truncate"
                          title={obj?.movie?.title || 'N/A'}
                        >
                          {obj?.movie?.title || 'N/A'}                        
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography 
                          className="text-sm font-semibold text-blue-gray-600 truncate"
                          title={obj?.cinema?.name || 'N/A'}
                        >
                          {obj?.cinema?.name || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.timeStart ? formatDate(obj.timeStart) : ""}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.timeEnd ? formatDate(obj.timeEnd) : ""}
                        </Typography>
                      </div>
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
      <ModalShowTime
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editData}
      />
    </div>
  );
}
 
export default ShowTimePage;