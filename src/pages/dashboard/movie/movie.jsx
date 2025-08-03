import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Avatar
} from '@material-tailwind/react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SearchButton } from '@/components/button'
import { useDebounce } from '@/hooks/use-debound'
import { CircularProgress, Pagination } from '@mui/material'
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/solid'
import movieService from '@/services/movieService'
import ModalMovie from './modal'
import { formatDate } from '@/utils/formatDate'

const MoviePage = () => {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 5 })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 1000)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  // Query for fetching movies
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['movies', { search: debouncedSearch, ...pagination }],
    queryFn: () =>
      movieService.getAll(
        debouncedSearch,
        pagination.currentPage,
        pagination.pageSize
      ),
    keepPreviousData: true,
    select: (data) => ({ data: data.data, pagination: data.pagination })
  })

  // Mutation for create/update
  const createOrUpdateMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('titleAnother', data.titleAnother)
      formData.append('video', data.video)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('studio', data.studio)
      formData.append('dateAired', data.dateAired)
      formData.append('score', data.score)
      formData.append('duration', data.duration)
      formData.append('quality', data.quality)
      if (data.image && typeof data.image !== 'string') {
        formData.append('image', data.image)
      }

      return data.id
        ? movieService.update(data.id, formData)
        : movieService.create(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['movies'])
      setModalOpen(false)
    }
  })

  // Mutation for delete
  const deleteMutation = useMutation({
    mutationFn: (data) => movieService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies'])
    }
  })

  const handlePageChange = (_, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleDelete = async (data) => {
    if (window.confirm('Bạn chắc chắn muốn xóa phim này?')) {
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
            Danh sách Phim
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  'tên',
                  'mô tả',
                  'kiểu',
                  'studio',
                  'ngày công chiếu',
                  'tình trạng',
                  'điểm số',
                  'thời gian',
                  'chất lượng',
                  'hành động'
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
              {moviesData?.data.map((movie, index) => {
                const className = `py-3 px-5 ${
                  index === moviesData.data.length - 1
                    ? ''
                    : 'border-b border-blue-gray-50'
                }`

                return (
                  <tr key={movie.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4 w-[200px]">
                        <Avatar
                          src={movie.image}
                          alt={movie.publicId}
                          size="sm"
                          variant="rounded"
                        />
                        <div>
                          <Typography
                            className="font-semibold leading-[18px]"
                            title={movie?.title}
                          >
                            {movie?.title?.length > 30
                              ? `${movie?.title?.substring(0, 30)}...`
                              : movie?.title || 'No title'}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {movie?.titleAnother}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[200px]">
                        <Typography
                          className="text-sm font-semibold text-blue-gray-600"
                          title={movie?.description}
                        >
                          {movie?.description?.length > 85
                            ? `${movie?.description?.substring(0, 85)}...`
                            : movie?.description || 'No description'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.type || 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.studio || 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.dateAired ? formatDate(movie.dateAired) : 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.status === 0 ? 'Đã công chiếu' : 'Sắp ra mắt'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.score || 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.duration ? `${movie.duration} phút` : 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {movie?.quality || 'N/A'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          onClick={() => openEditModal(movie)}
                        >
                          <PencilIcon className="h-5 w-5 text-blue-gray-500" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          onClick={() => handleDelete(movie)}
                        >
                          <TrashIcon className="h-5 w-5 text-blue-gray-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="sticky bottom-0 left-0 w-full bg-white z-10">
            <div className="flex justify-end w-full pt-5 pr-5">
              <Pagination
                count={moviesData?.pagination.totalPages || 1}
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
        onSubmit={createOrUpdateMutation.mutate}
        initialData={editData}
        isLoading={createOrUpdateMutation.isLoading}
      />
    </div>
  )
}

export default MoviePage
