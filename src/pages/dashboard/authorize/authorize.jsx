import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { CircularProgress, Pagination } from '@mui/material'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import AuthorizeService from '@/services/authorizeService'
import ModalAuthorize from './modal'
import CreateEmployeeModal from './modalCreate'

const AuthorizePage = () => {
  const [employees, setEmployees] = useState([])
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
    totalPages: 1
  })

  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [currentUserPermissions, setCurrentUserPermissions] = useState([])

  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Lấy danh sách nhân viên
  const fetchEmployees = async (page = 1, pageSize = 5) => {
    try {
      setLoading(true)
      const response = await AuthorizeService.getUserByRole(page, pageSize)
      // console.log(response.data.data);
      setEmployees(response.data.data)
      setPagination({
        totalItems: response.data.pagination.totalItems,
        currentPage: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages
      })
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error)
    } finally {
      setLoading(false)
    }
  }

  // Thay đổi trang
  const handlePageChange = (event, page) => {
    fetchEmployees(page, pagination.pageSize)
  }

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleOpenModal = (userId) => {
    const user = employees.find((e) => e.id === userId)
    if (user) {
      setSelectedUserId(userId)
      // Giả sử user.permissions là mảng các permission objects
      setCurrentUserPermissions(user.permissions || [])
      // console.log(user.permissions);
      setModalOpen(true)
    }
  }

  const handleUpdatePermissions = async (userId, permissionIds) => {
    try {
      setLoading(true)

      // 1. Lấy thông tin tất cả permissions để map ID sang name
      const allPermsResponse = await AuthorizeService.getAllPermissions()
      const allPermissions = allPermsResponse.data.data

      // 2. Chuẩn bị dữ liệu gửi lên API
      const permissionNames = permissionIds
        .map((id) => {
          const p = allPermissions.find((p) => p.id === id)
          return p?.name
        })
        .filter(Boolean)

      // 3. Log dữ liệu trước khi gửi
      // console.group('Preparing API request:');
      // console.log('User ID:', userId);
      // console.log('Permission IDs:', permissionIds);
      // console.log('Permission Names:', permissionNames);
      // console.groupEnd();

      // 4. Gọi API
      const payload = { userId, roleName: 'employee', permissionNames }

      // console.log('API Payload:', payload);

      const response = await AuthorizeService.assignPermissions(payload)

      // 5. Log kết quả từ API
      // console.log('API Response:', response.data);

      // 6. Refresh danh sách
      await fetchEmployees(pagination.currentPage, pagination.pageSize)

      return true
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error)
      return false
    } finally {
      setLoading(false)
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
      <div className="absolute -top-[95px] flex justify-end right-[290px]">
        <div className="flex justify-between gap-3">
          <div>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setCreateModalOpen(true)}
            >
              <PlusCircleIcon className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h5" color="white">
            Danh sách Nhân Viên
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['#', 'tên', 'email', 'vai trò', 'quyền', 'hành động'].map(
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
              {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    {(pagination.currentPage - 1) * pagination.pageSize +
                      index +
                      1}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      className="font-medium text-blue-gray-600"
                    >
                      {employee.fullname}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      className="font-medium text-blue-gray-600"
                    >
                      {employee.email}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    {employee.roles.join(', ')}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div
                      className="max-w-[200px] truncate"
                      title={employee.permissions.join(', ')}
                    >
                      {employee.permissions.join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex gap-2">
                      <IconButton
                        variant="text"
                        color="blue"
                        onClick={() => handleOpenModal(employee.id)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </IconButton>
                      {/* <IconButton variant="text" color="red">
                        <TrashIcon className="h-5 w-5" />
                      </IconButton> */}
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Phân quyền cho nhân viên */}
      <ModalAuthorize
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpdatePermissions}
        userId={selectedUserId}
        userPermissions={currentUserPermissions}
      />

      {/* Thêm modal tạo nhân viên */}
      <CreateEmployeeModal
        open={createModalOpen}
        handleOpen={() => setCreateModalOpen(!createModalOpen)}
      />
    </div>
  )
}

export default AuthorizePage
