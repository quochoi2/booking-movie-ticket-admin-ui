import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material'
import AuthorizeService from '@/services/authorizeService'

const ModalAuthorize = ({
  open,
  onClose,
  onSubmit,
  userId,
  userPermissions = []
}) => {
  const [allPermissions, setAllPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setInitialLoading(true)
        const response = await AuthorizeService.getAllPermissions()
        setAllPermissions(response.data.data)

        // Chuẩn hóa userPermissions về dạng mảng ids
        const normalizePermissions = (permissions) => {
          return permissions
            .map((p) => {
              if (typeof p === 'string') {
                // Trường hợp của bạn: p là string như "VIEW_USERS"
                const found = response.data.data.find((perm) => perm.name === p)
                // console.log("Tìm permission bằng name:", p, "Kết quả:", found);
                return found ? found.id : null
              } else if (p.id) {
                // Nếu có id, trả về id
                return p.id
              } else if (p.name) {
                // Nếu có name nhưng không có id, tìm id
                const found = response.data.data.find(
                  (perm) => perm.name === p.name
                )
                return found ? found.id : null
              }
              return null
            })
            .filter((id) => id !== null)
        }

        // console.log("Dữ liệu đầu vào userPermissions:", userPermissions);
        const normalized = normalizePermissions(userPermissions)
        // console.log("Dữ liệu sau khi chuẩn hóa:", normalized);
        setSelectedPermissions(normalized)
      } catch (error) {
        console.error('Error fetching permissions:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    if (open) {
      fetchPermissions()
    } else {
      setSelectedPermissions([])
    }
  }, [open, userPermissions])

  const handleTogglePermission = (permissionId) => () => {
    setSelectedPermissions((prev) => {
      const newSelected = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId) // Bỏ chọn nếu đã có
        : [...prev, permissionId] // Thêm vào nếu chưa có

      // Log thông tin permission vừa thay đổi
      const permission = allPermissions.find((p) => p.id === permissionId)
      console.log(
        `Permission ${permission.name} (ID: ${permissionId}) - ` +
          `${newSelected.includes(permissionId) ? 'SELECTED' : 'UNSELECTED'}`
      )

      // Log toàn bộ danh sách permissions đang được chọn
      console.log(
        'Current selected permissions:',
        newSelected.map((id) => {
          const p = allPermissions.find((p) => p.id === id)
          return p ? p.name : id
        })
      )

      return newSelected
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // 1. Chuẩn bị dữ liệu gửi đi
      const permissionsToSend = selectedPermissions.map((id) => {
        const p = allPermissions.find((p) => p.id === id)
        return {
          id: p.id,
          name: p.name,
          description: p.description
        }
      })

      // 2. Log toàn bộ thông tin sẽ gửi
      // console.group('Data being submitted:');
      // console.log('User ID:', userId);
      // console.log('Selected Permissions:', permissionsToSend);
      // console.groupEnd();

      // 3. Gọi hàm onSubmit từ props và truyền selectedPermissions
      await onSubmit(userId, selectedPermissions)

      onClose()
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{'Danh sách quyền'}</DialogTitle>
      <DialogContent>
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {allPermissions.map((permission) => (
              <ListItem
                key={permission.id}
                disablePadding
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={handleTogglePermission(permission.id)}
                    color="primary"
                  />
                }
              >
                <ListItemButton onClick={handleTogglePermission(permission.id)}>
                  <ListItemText
                    primary={
                      <div className="flex items-center">
                        <span className="font-medium">{permission.name}</span>
                        {permission.description && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({permission.description})
                          </span>
                        )}
                      </div>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || initialLoading}
          endIcon={loading && <CircularProgress size={20} />}
        >
          {'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalAuthorize
