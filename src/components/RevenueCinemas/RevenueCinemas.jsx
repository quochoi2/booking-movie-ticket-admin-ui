import React, { useState, useEffect } from 'react'
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Chip
} from '@material-tailwind/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import dashboardService from '@/services/dashboardService'

const RevenueCinemas = () => {
  const [cinemasData, setCinemasData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await dashboardService.statisticCinemas(period)
        setCinemasData(data.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching cinema statistics:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return 'hôm nay'
      case 'month':
        return 'tháng này'
      case 'year':
        return 'năm nay'
      default:
        return 'toàn thời gian'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>
  }

  if (!cinemasData) {
    return <div className="text-center py-8">Không có dữ liệu</div>
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Card className="overflow-hidden xl:col-span-3 border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Thống kê doanh thu rạp chiếu phim {getPeriodLabel()}
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Tổng doanh thu: {formatCurrency(cinemasData.totalRevenue)} -{' '}
              {cinemasData.totalCinemas} rạp
            </Typography>
          </div>
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton size="sm" variant="text" color="blue-gray">
                <EllipsisVerticalIcon strokeWidth={3} className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => setPeriod('day')}>Theo ngày</MenuItem>
              <MenuItem onClick={() => setPeriod('month')}>Theo tháng</MenuItem>
              <MenuItem onClick={() => setPeriod('year')}>Theo năm</MenuItem>
              <MenuItem onClick={() => setPeriod('all')}>
                Toàn thời gian
              </MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['Rạp', 'Địa chỉ', 'Doanh thu', 'Số vé'].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cinemasData.cinemas.map((cinema, key) => {
                const className = `py-3 px-5 ${
                  key === cinemasData.cinemas.length - 1
                    ? ''
                    : 'border-b border-blue-gray-50'
                }`

                return (
                  <tr key={cinema.cinemaId}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar 
                          src="/images/default-cinema.jpg" // You can replace with cinema.image if available
                          alt={cinema.name} 
                          size="md"
                          className="border border-blue-gray-50"
                        /> */}
                        <Typography variant="small" color="blue-gray">
                          {cinema.name}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600"
                      >
                        {cinema.address}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600"
                      >
                        {formatCurrency(cinema.totalRevenue)}
                      </Typography>
                      {cinema.totalOrders > 0 && (
                        <Typography
                          variant="small"
                          className="text-xs text-blue-gray-400"
                        >
                          {cinema.totalOrders} đơn hàng
                        </Typography>
                      )}
                    </td>
                    <td className={className}>
                      {cinema.totalOrders > 0 ? (
                        <Chip
                          variant="gradient"
                          color="green"
                          value={`${cinema.totalOrders} vé`}
                          className="text-xs py-0.5 px-2"
                        />
                      ) : (
                        <Chip
                          variant="outlined"
                          color="gray"
                          value="0 vé"
                          className="text-xs py-0.5 px-2"
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}

export default RevenueCinemas
