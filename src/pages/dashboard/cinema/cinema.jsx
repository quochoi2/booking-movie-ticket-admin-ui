import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton
} from '@material-tailwind/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SearchButton } from '@/components/button'
import { useDebounce } from '@/hooks/use-debound'
import { CircularProgress, Pagination } from '@mui/material'
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/solid'
import ModalCinema from './modal'
import cinemaService from '@/services/cinemaService'

const CinemaPage = () => {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 5 })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 1000)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  // Query để lấy danh sách rạp
  const { data: cinemaData, isLoading } = useQuery({
    queryKey: ['cinemas', { search: debouncedSearch, ...pagination }],
    queryFn: () =>
      cinemaService.getAll(
        debouncedSearch,
        pagination.currentPage,
        pagination.pageSize
      ),
    keepPreviousData: true
  })

  // Mutation cho create/update
  const createOrUpdateMutation = useMutation({
    mutationFn: (data) =>
      data.id ? cinemaService.update(data) : cinemaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cinemas'])
      setModalOpen(false)
    }
  })

  // Mutation cho delete
  const deleteMutation = useMutation({
    mutationFn: (data) => cinemaService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cinemas'])
    }
  })

  const handlePageChange = (_, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleDelete = async (data) => {
    if (window.confirm('Bạn chắc chắn muốn xóa rạp này?')) {
      await deleteMutation.mutateAsync(data)
    }
  }

  const openCreateModal = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const openEditModal = (data) => {
    setEditData(data)
    setModalOpen(true)
  }

  return (
    <div className="relative mt-12 mb-8 flex flex-col gap-12">
      {(isLoading ||
        createOrUpdateMutation.isLoading ||
        deleteMutation.isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress color="inherit" />
        </div>
      )}

      <div className="absolute -top-[95px] flex justify-end right-[255px]">
        <div className="flex justify-between gap-3">
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={openCreateModal}
          >
            <PlusCircleIcon className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <SearchButton onSearch={setSearch} />
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
                {['#', 'tên', 'địa chỉ', 'hành động'].map((el) => (
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
              {cinemaData?.data.map((obj, key) => (
                <tr key={obj.id}>
                  <td
                    className={`py-3 px-5 ${key === cinemaData.data.length - 1 ? '' : 'border-b border-blue-gray-50'}`}
                  >
                    <Typography className="text-sm font-semibold text-blue-gray-600">
                      {obj.id}
                    </Typography>
                  </td>
                  <td
                    className={`py-3 px-5 ${key === cinemaData.data.length - 1 ? '' : 'border-b border-blue-gray-50'}`}
                  >
                    <Typography className="text-sm font-semibold text-blue-gray-600">
                      {obj.name}
                    </Typography>
                  </td>
                  <td
                    className={`py-3 px-5 ${key === cinemaData.data.length - 1 ? '' : 'border-b border-blue-gray-50'}`}
                  >
                    <Typography className="text-sm font-semibold text-blue-gray-600">
                      {obj.address}
                    </Typography>
                  </td>
                  <td
                    className={`py-3 px-5 ${key === cinemaData.data.length - 1 ? '' : 'border-b border-blue-gray-50'}`}
                  >
                    <div className="flex gap-2">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => openEditModal(obj)}
                      >
                        <PencilIcon className="h-5 w-5 text-blue-gray-500" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => handleDelete(obj)}
                      >
                        <TrashIcon className="h-5 w-5 text-blue-gray-500" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sticky bottom-0 left-0 w-full bg-white z-10">
            <div className="flex justify-end w-full pt-5 pr-5">
              <Pagination
                count={cinemaData?.pagination.totalPages || 1}
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
        onSubmit={createOrUpdateMutation.mutate}
        initialData={editData}
        isLoading={createOrUpdateMutation.isLoading}
      />
    </div>
  )
}

export default CinemaPage
