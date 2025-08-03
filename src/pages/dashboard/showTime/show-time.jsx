import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Avatar
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { SearchButton } from '@/components/button'
import { useDebounce } from '@/hooks/use-debound'
import { CircularProgress, Pagination } from '@mui/material'
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  FolderPlusIcon
} from '@heroicons/react/24/solid'
import { formatDateShowtime } from '@/utils/formatDate'
import showTimeService from '@/services/showTimeService'
import ModalShowTime from './modal'
import { message } from 'antd'
import AutoGenerateModal from './autoGenerateModal'

const ShowTimePage = () => {
  const [showTime, setShowTime] = useState([])
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
    totalPages: 1
  })

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 1000)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)

  // auto generate
  const [autoGenerateModalOpen, setAutoGenerateModalOpen] = useState(false)

  useEffect(() => {
    fetch(debouncedSearch, 1)
  }, [debouncedSearch])

  useEffect(() => {
    fetch(search, pagination.currentPage)
  }, [pagination.currentPage])

  const fetch = (query = '', page = 1) => {
    showTimeService
      .getAll(query, page, pagination.pageSize)
      .then((res) => {
        // console.log(res);
        setShowTime(res.data)
        setPagination({
          totalItems: res.pagination.totalItems,
          currentPage: res.pagination.currentPage,
          pageSize: res.pagination.pageSize,
          totalPages: res.pagination.totalPages
        })
      })
      .catch((err) => console.error('Error fetching show time:', err))
  }

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  // create, update, delete
  const handleCreateOrUpdate = async (data) => {
    setLoading(true)
    try {
      let response
      if (data.id) {
        response = await showTimeService.update(data)
      } else {
        response = await showTimeService.create(data)
      }

      // Xử lý khi thành công
      if (response?.code === 0) {
        message.success(response.message)
        fetch(debouncedSearch, pagination.currentPage)
      } else if (response?.message && response?.conflictingSchedule) {
        message.error(
          response?.message +
            ` và thời gian trùng với: ${response?.conflictingSchedule.start} đến ${response?.conflictingSchedule.end}` ||
            'Đã có lịch chiếu trùng',
          5
        )
      } else {
        message.error(response.message || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error('Error:', err)
      message.error(err.message || 'Lỗi hệ thống')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (data) => {
    try {
      const response = await showTimeService.delete(data)

      if (response.code === 0) {
        message.success(response.message || 'Xóa thành công!')
        fetch(debouncedSearch, pagination.currentPage)
      } else {
        message.error(response.message || 'Không thể xóa!')
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa lịch chiếu')
    }
  }

  const openCreateModal = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const openEditModal = (data) => {
    // console.log(data);
    setEditData(data)
    setModalOpen(true)
  }

  // auto generate
  const openAutoGenerateModal = () => {
    setAutoGenerateModalOpen(true)
  }

  const handleAutoGenerateSubmit = async (data) => {
    try {
      // Chuyển đổi cinemaIds từ string sang number nếu cần
      const formattedData = {
        ...data,
        cinemaIds: data.cinemaIds.map((id) => Number(id))
      }

      const result = await showTimeService.autoGenerate(formattedData)

      if (result.code === 0) {
        message.success(
          `Tạo thành công ${result.data.created.length} lịch chiếu`
        )
        // Refresh danh sách
        fetch(debouncedSearch, pagination.currentPage)

        // Hiển thị thông báo nếu có lịch trùng
        if (result.data.conflicts?.length > 0) {
          message.warning(
            `Có ${result.data.conflicts.length} lịch bị trùng không thể tạo`
          )
        }
      } else {
        message.error(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error:', error)
      message.error('Lỗi hệ thống khi tạo lịch tự động')
    }
  }

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
              onClick={openAutoGenerateModal}
            >
              <FolderPlusIcon className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
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
            Danh sách Giờ Chiếu
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['phim', 'rạp', 'bắt đầu', 'kết thúc', 'hành động'].map(
                  (el) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {showTime.map((obj, key) => {
                const className = `py-3 px-5 ${key === showTime.length - 1 ? '' : 'border-b border-blue-gray-50'}`

                return (
                  <tr key={obj.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4 w-[180px]">
                        <Avatar
                          src={obj?.Movie?.image}
                          alt={obj?.Movie?.image}
                          size="sm"
                          variant="rounded"
                        />
                        <Typography
                          className="text-sm font-semibold text-blue-gray-600 truncate"
                          title={obj?.Movie?.title || 'N/A'}
                        >
                          {obj?.Movie?.title || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography
                          className="text-sm font-semibold text-blue-gray-600 truncate"
                          title={obj?.Cinema?.name || 'N/A'}
                        >
                          {obj?.Cinema?.name || 'N/A'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.timeStart
                            ? formatDateShowtime(obj.timeStart)
                            : ''}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-[120px]">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {obj?.timeEnd ? formatDateShowtime(obj.timeEnd) : ''}
                        </Typography>
                      </div>
                    </td>
                    <td className={className} style={{ display: 'flex' }}>
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
                    </td>
                  </tr>
                )
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

      <AutoGenerateModal
        open={autoGenerateModalOpen}
        handleOpen={() => setAutoGenerateModalOpen(!autoGenerateModalOpen)}
        onSubmit={handleAutoGenerateSubmit}
      />
    </div>
  )
}

export default ShowTimePage
