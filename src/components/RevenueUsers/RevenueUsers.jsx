import React, { useState, useEffect } from "react";
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
  Chip,
  Tooltip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import dashboardService from "@/services/dashboardService";

const RevenueUsers = () => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.statisticUsers(period);
        setUsersData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  const formatCurrency = (amount) => {
    // Convert string to number first if needed
    const numericAmount = typeof amount === 'string' 
      ? parseInt(amount.replace(/^0+/, '')) 
      : amount;
    
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(numericAmount);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "day": return "hôm nay";
      case "month": return "tháng này";
      case "year": return "năm nay";
      default: return "toàn thời gian";
    }
  };

  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  if (!usersData) {
    return <div className="text-center py-8">Không có dữ liệu</div>;
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
              Thống kê người dùng mua nhiều vé nhất {getPeriodLabel()}
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Tổng doanh thu: {formatCurrency(usersData.totalRevenue)} - {usersData.totalUsers} người dùng
            </Typography>
          </div>
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton size="sm" variant="text" color="blue-gray">
                <EllipsisVerticalIcon strokeWidth={3} className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => setPeriod("day")}>Theo ngày</MenuItem>
              <MenuItem onClick={() => setPeriod("month")}>Theo tháng</MenuItem>
              <MenuItem onClick={() => setPeriod("year")}>Theo năm</MenuItem>
              <MenuItem onClick={() => setPeriod("all")}>Toàn thời gian</MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Người dùng", "Email", "Doanh thu", "Số vé"].map((el) => (
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
              {usersData.users.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === usersData.users.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={user.userId}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar 
                          src={`https://ui-avatars.com/api/?name=${getInitials(user.fullname)}&background=random`}
                          alt={user.fullname} 
                          size="md"
                          className="border border-blue-gray-50"
                        />
                        <div>
                          <Typography variant="small" color="blue-gray">
                            {user.fullname}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-xs text-blue-gray-400"
                          >
                            ID: {user.userId}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Tooltip content={user.email}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600 truncate max-w-[180px]"
                        >
                          {user.email}
                        </Typography>
                      </Tooltip>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color="green"
                        value={formatCurrency(user.totalRevenue)}
                        className="text-xs py-0.5 px-2"
                      />
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Chip
                          variant="gradient"
                          color="blue"
                          value={`${user.totalTickets} vé`}
                          className="text-xs py-0.5 px-2"
                        />
                        <Typography
                          variant="small"
                          className="text-xs text-blue-gray-400"
                        >
                          {user.totalTickets === 1 ? '1 đơn hàng' : `${user.totalTickets} đơn hàng`}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default RevenueUsers;