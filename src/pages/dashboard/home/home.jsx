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

export function Home() {
  const { user } = useContext(UserContext);
  const [statisticDataToday, setStatisticDataToday] = useState(
    {
      today: {
        totalRevenueToday: 0,
        totalTicketsSoldToday: 0,
        totalNewUserToday: 0,
      },
      difference: {
        revenueDifference: 0,
        ticketsDifference: 0,
        usersDifference: 0,
      },
    }
  );
  const [chartDataByWeek, setChartDataByWeek] = useState({
    series: [],
    options: {
      ...chartsConfig,
    },
  });
  const [chartDataByMonth, setChartDataByMonth] = useState({
    series: [],
    options: {
      ...chartsConfig,
    },
  });
  const [chartDataByYear, setChartDataByYear] = useState({
    series: [],
    options: {
      ...chartsConfig,
    },
  });

  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekNumber());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedOption, setSelectedOption] = useState('week');

  // Fetch statistics by week
  const fetchStatisticChartDataByWeek = async (year = 2024, week = 51) => {
    try {
      const res = await dashboardService.statisticByWeek({ year, week });
      if (res && res.data) {
        // console.log(res.data);
        const categories = res.data.map((item) => item.day);
        const totalTickets = res.data.map((item) => item.totalTicket);
        const totalRevenues = res.data.map((item) => item.totalRevenue);
  
        const chartOptions = {
          ...chartsConfig,
          series: [
            { name: "Total Tickets", data: totalTickets },
            { name: "Total Revenue", data: totalRevenues },
          ],
          options: {
            ...chartsConfig, 
            xaxis: {
              ...chartsConfig.xaxis,
              categories: categories,
            },
          },
        };
  
        setChartDataByWeek(chartOptions);
      }
    } catch (error) {
      console.error("Failed to fetch weekly statistics:", error);
    }
  };

  // Fetch statistics by month
  const fetchStatisticChartDataByMonth = async (year = 2024, month = 12) => {
    try {
      const res = await dashboardService.statisticByMonth({ year, month });
      if (res && res.data) {
        const categories = res.data.map((item) => item.day);
        const totalTickets = res.data.map((item) => item.totalTicket);
        const totalRevenues = res.data.map((item) => item.totalRevenue);

        const chartOptions = {
          ...chartsConfig,
          series: [
            { name: "Total Tickets", data: totalTickets },
            { name: "Total Revenue", data: totalRevenues },
          ],
          options: {
            ...chartsConfig,
            xaxis: {
              ...chartsConfig.xaxis,
              categories: categories,
            },
          },
        };

        setChartDataByMonth(chartOptions);
      }
    } catch (error) {
      console.error("Failed to fetch monthly statistics:", error);
    }
  };

  // Fetch statistics by year
  const fetchStatisticChartDataByYear = async (year = 2024) => {
    try {
      const res = await dashboardService.statisticByYear({ year });
      if (res && res.updatedData) {
        const categories = res.updatedData.map((item) => item.month);
        const totalTickets = res.updatedData.map((item) => item.totalTicket);
        const totalRevenues = res.updatedData.map((item) => item.totalRevenue);

        const chartOptions = {
          ...chartsConfig,
          series: [
            { name: "Total Tickets", data: totalTickets },
            { name: "Total Revenue", data: totalRevenues },
          ],
          options: {
            ...chartsConfig,
            xaxis: {
              ...chartsConfig.xaxis,
              categories: categories,
            },
          },
        };

        setChartDataByYear(chartOptions);
      }
    } catch (error) {
      console.error("Failed to fetch yearly statistics:", error);
    }
  };

   // Fetch statistics for today
  const fetchStatisticDataToday = async () => {
    try {
      dashboardService.getRevenueAndTicketAndUserToday()
        .then((res) => {
          // console.log(res);
          setStatisticDataToday(res);
        })
        .catch(err => console.log("Error fetching: ", err))
      
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  useEffect(() => {
    fetchStatisticDataToday();
  }, []);
  
  useEffect(() => {
    fetchStatisticChartDataByWeek(selectedYear, selectedWeek);
    fetchStatisticChartDataByMonth(selectedYear, selectedMonth);
    fetchStatisticChartDataByYear(selectedYear);
  }, [selectedYear, selectedMonth, selectedWeek]);

  return (
    <div className="mt-8">
      {/* render statistic today */}
      <div>
        {statisticDataToday.today ? (
          <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            <StatisticsCard
              key={"Today's Money"}
              icon={<BanknotesIcon className="w-6 h-6 text-white"/>}
              title={"Today's Money"}
              value={"$" + statisticDataToday.today.totalRevenueToday}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={"text-green-500"}>{"$" + statisticDataToday.difference.revenueDifference}</strong>
                  &nbsp;{"than last today"}
                </Typography>
              }
            />
            <StatisticsCard
              key={"Today's Sales"}
              icon={<ChartBarIcon className="w-6 h-6 text-white"/>}
              title={"Today's Sales"}
              value={"$" + statisticDataToday.today.totalTicketsSoldToday}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={"text-green-500"}>{"$" + statisticDataToday.difference.ticketsDifference}</strong>
                  &nbsp;{"than last today"}
                </Typography>
              }
            />
            <StatisticsCard
              key={"Today's New User"}
              icon={<UserIcon className="w-6 h-6 text-white"/>}
              title={"Today's New User"}
              value={"$" + statisticDataToday.today.totalNewUserToday}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={"text-green-500"}>{"$" + statisticDataToday.difference.usersDifference}</strong>
                  &nbsp;{"than last today"}
                </Typography>
              }
            />
          </div>
        ): (
          <div>Loading statistic for today...</div>
        )}
      </div>

      {/* render statistic week, month, year by line chart */}
      <div className="mb-8">
        <div className="flex justify-between mb-4 space-x-4">
          <div className="select-none">
            {selectedOption === 'week' || selectedOption === 'month' || selectedOption === 'year' ? (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="py-2 px-4 h-10 border rounded-md mr-5 shadow-sm cursor-pointer overflow-y-auto focus:outline-none"
              >
                {Array.from({ length: new Date().getFullYear() - 1999 }, (_, index) => 2000 + index)
                  .reverse()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            ) : null}

            {selectedOption === 'month' ? (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="py-2 px-4 h-10 border rounded-md shadow-sm cursor-pointer overflow-y-auto focus:outline-none"
              >
                {[...Array(12).keys()].map((month) => (
                  <option key={month} value={month + 1}>
                    {new Date(0, month).toLocaleString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
            ) : null}

            {selectedOption === 'week' ? (
              <select
                value={selectedWeek}  
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="py-2 px-4 h-10 border rounded-md shadow-sm cursor-pointer overflow-y-auto focus:outline-none"
              >
                {[...Array(52).keys()].map((week) => (
                  <option key={week} value={week + 1}>
                    Week {week + 1}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <div className="grid grid-cols-3 bg-gray-200 rounded-md w-96">
            <button
              className={`px-4 rounded-md ${
                selectedOption === "week"
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setSelectedOption("week")}
            >
              Week
            </button>
            <button
              className={`px-4 rounded-md ${
                selectedOption === "month"
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setSelectedOption("month")}
            >
              Month
            </button>
            <button
              className={`px-4 rounded-md ${
                selectedOption === "year"
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setSelectedOption("year")}
            >
              Year
            </button>
          </div>
        </div>

        <div>
          {selectedOption === 'week' && (
            <StatisticsChart
              color="white"
              chart={chartDataByWeek}
              title="Weekly Statistics"
              description="Total tickets and revenue for the selected week"
              footer="Updated just now"
            />
          )}
          {selectedOption === 'month' && (
            <StatisticsChart
              color="white"
              chart={chartDataByMonth}
              title="Monthly Statistics"
              description="Total tickets and revenue for the selected month"
              footer="Updated just now"
            />
          )}
          {selectedOption === 'year' && (
            <StatisticsChart
              color="white"
              chart={chartDataByYear}
              title="Yearly Statistics"
              description="Total tickets and revenue for the selected year"
              footer="Updated just now"
            />
          )}
        </div>
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
