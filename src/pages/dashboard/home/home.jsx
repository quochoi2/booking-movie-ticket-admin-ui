import React, { useState, useEffect } from 'react'
import { Typography } from '@material-tailwind/react'
import { StatisticsCard } from '@/widgets/cards'
import {
  BanknotesIcon,
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/react/24/solid'
import dashboardService from '@/services/dashboardService'
import { RevenueStatistics } from '@/components/RevenueStatistics'
import RevenueMovies from '@/components/RevenueMovies/RevenueMovies'
import RevenueCinemas from '@/components/RevenueCinemas/RevenueCinemas'
import RevenueUsers from '@/components/RevenueUsers/RevenueUsers'

export function Home() {
  const [loading, setLoading] = useState(true)

  // form
  const [statisticData, setStatisticData] = useState({
    today: {
      date: '',
      totalRevenue: 0,
      totalTickets: 0,
      totalCustomers: 0
    },
    yesterday: {
      date: '',
      totalRevenueYesterday: 0,
      totalTicketsYesterday: 0,
      totalCustomersYesterday: 0
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.statisticToday()
        // console.log(res.data);
        // Cấu trúc lại dữ liệu để dễ sử dụng
        setStatisticData({
          today: res.data[0],
          yesterday: res.data[1]
        })
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Tính toán phần trăm thay đổi
  const calculateChange = (todayValue, yesterdayValue) => {
    if (yesterdayValue === 0) return 0 // Tránh chia cho 0
    return (((todayValue - yesterdayValue) / yesterdayValue) * 100).toFixed(1)
  }

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

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
                  <strong
                    className={
                      statisticData.today.totalRevenue >=
                      statisticData.yesterday.totalRevenueYesterday
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {calculateChange(
                      statisticData.today.totalRevenue,
                      statisticData.yesterday.totalRevenueYesterday
                    )}
                    %
                  </strong>
                  &nbsp;
                  {statisticData.today.totalRevenue >=
                  statisticData.yesterday.totalRevenueYesterday
                    ? 'so với hôm qua'
                    : 'so với hôm qua'}
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
                  <strong
                    className={
                      statisticData.today.totalTickets >=
                      statisticData.yesterday.totalTicketsYesterday
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {calculateChange(
                      statisticData.today.totalTickets,
                      statisticData.yesterday.totalTicketsYesterday
                    )}
                    %
                  </strong>
                  &nbsp;
                  {statisticData.today.totalTickets >=
                  statisticData.yesterday.totalTicketsYesterday
                    ? 'so với hôm qua'
                    : 'so với hôm qua'}
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
                  <strong
                    className={
                      statisticData.today.totalCustomers >=
                      statisticData.yesterday.totalCustomersYesterday
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {calculateChange(
                      statisticData.today.totalCustomers,
                      statisticData.yesterday.totalCustomersYesterday
                    )}
                    %
                  </strong>
                  &nbsp;
                  {statisticData.today.totalCustomers >=
                  statisticData.yesterday.totalCustomersYesterday
                    ? 'so với hôm qua'
                    : 'so với hôm qua'}
                </Typography>
              }
            />
          </div>
        )}
      </div>

      {/* render statistic week, month, year by movies */}
      <div className="mb-8">
        <RevenueMovies />
      </div>

      {/* render statistic week, month, year by cinemas */}
      <div className="mb-8">
        <RevenueCinemas />
      </div>

      {/* render statistic week, month, year by users */}
      <div className="mb-8">
        <RevenueUsers />
      </div>

      {/* render statistic week, month, year by line chart */}
      <div className="mb-8">
        <RevenueStatistics />
      </div>
    </div>
  )
}

export default Home
