import React, { useState, useEffect, useContext } from "react";
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
  Tooltip,
  Progress,
  TabsHeader,
  Tabs,
  Tab,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { BanknotesIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon, Cog6ToothIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { UserContext } from "@/context/authContext";
import dashboardService from "@/services/dashboardService";
import { chartsConfig } from "@/configs";
import { getCurrentWeekNumber } from "@/utils/formatDate";
import { RevenueStatistics } from "@/components/RevenueStatistics";

export function Home() {
  const [loading, setLoading] = useState(true);

  // form
  const [statisticData, setStatisticData] = useState({
    today: {
      date: "",
      totalRevenue: 0,
      totalTickets: 0,
      totalCustomers: 0
    },
    yesterday: {
      date: "",
      totalRevenueYesterday: 0,
      totalTicketsYesterday: 0,
      totalCustomersYesterday: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.statisticToday();
        // console.log(res.data);
        // Cấu trúc lại dữ liệu để dễ sử dụng
        setStatisticData({
          today: res.data[0],
          yesterday: res.data[1],
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Tính toán phần trăm thay đổi
  const calculateChange = (todayValue, yesterdayValue) => {
    if (yesterdayValue === 0) return 100; // Tránh chia cho 0
    return ((todayValue - yesterdayValue) / yesterdayValue * 100).toFixed(1);
  };

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="mt-8">
      {/* Render statistic today */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            <StatisticsCard
              key="Today's Revenue"
              icon={<BanknotesIcon className="w-6 h-6 text-white" />}
              title="Doanh thu hôm nay"
              value={formatCurrency(statisticData.today.totalRevenue)}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={
                    statisticData.today.totalRevenue >= statisticData.yesterday.totalRevenueYesterday ? 
                    "text-green-500" : "text-red-500"
                  }>{calculateChange(statisticData.today.totalRevenue, statisticData.yesterday.totalRevenueYesterday)}%
                  </strong>
                  &nbsp;{statisticData.today.totalRevenue >= statisticData.yesterday.totalRevenueYesterday ? 
                  "so với hôm qua" : "so với hôm qua"}
                </Typography>
              }
            />
            <StatisticsCard
              key="Today's Tickets"
              icon={<ChartBarIcon className="w-6 h-6 text-white" />}
              title="Vé bán hôm nay"
              value={statisticData.today.totalTickets.toString()}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={
                    statisticData.today.totalTickets >= statisticData.yesterday.totalTicketsYesterday ? 
                    "text-green-500" : "text-red-500"
                  }>{calculateChange(statisticData.today.totalTickets, statisticData.yesterday.totalTicketsYesterday)}%
                  </strong>
                  &nbsp;{statisticData.today.totalTickets >= statisticData.yesterday.totalTicketsYesterday ? 
                  "so với hôm qua" : "so với hôm qua"}
                </Typography>
              }
            />
            <StatisticsCard
              key="Today's Customers"
              icon={<UserIcon className="w-6 h-6 text-white" />}
              title="Khách mua hôm nay"
              value={statisticData.today.totalCustomers.toString()}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={
                    statisticData.today.totalCustomers >= statisticData.yesterday.totalCustomersYesterday ? 
                    "text-green-500" : "text-red-500"
                  }>
                    {calculateChange(statisticData.today.totalCustomers, statisticData.yesterday.totalCustomersYesterday)}%
                  </strong>
                  &nbsp;{statisticData.today.totalCustomers >= statisticData.yesterday.totalCustomersYesterday ? 
                  "so với hôm qua" : "so với hôm qua"}
                </Typography>
              }
            />
          </div>
        )}
      </div>

      {/* render statistic week, month, year by line chart */}
      <div className="mb-8">
        <RevenueStatistics />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
