import { useState, useEffect } from "react";
import StatisticsChart from "@/widgets/charts/statistics-chart";
import dashboardService from "@/services/dashboardService"; // Import service của bạn

const RevenueStatistics = () => {
  // State management
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [yearData, setYearData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState({
    years: true,
    yearData: false,
    monthData: false
  });

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, years: true }));
        
        // Fetch available years
        const yearsResponse = await dashboardService.getYears();
        // console.log(yearsResponse.data.years);        
        setAvailableYears(yearsResponse.data.years);
        
        if (yearsResponse.data.years.length > 0) {
          const currentYear = new Date().getFullYear();
          const defaultYear = yearsResponse.data.years.includes(currentYear) 
            ? currentYear 
            : yearsResponse.data.years[0];
          
          setSelectedYear(defaultYear);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(prev => ({ ...prev, years: false }));
      }
    };

    loadInitialData();
  }, []);

  // Fetch year data when year changes
  useEffect(() => {
    if (!selectedYear) return;

    const loadYearStatistics = async () => {
      try {
        setLoading(prev => ({ ...prev, yearData: true }));
        const data = await dashboardService.statisticRenevue("year", selectedYear, null);
        // console.log(data.data.data);
        setYearData(data.data);
      } catch (error) {
        console.error("Year data error:", error);
      } finally {
        setLoading(prev => ({ ...prev, yearData: false }));
      }
    };

    loadYearStatistics();
  }, [selectedYear]);

  // Fetch month data when month changes
  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    const loadMonthStatistics = async () => {
      try {
        setLoading(prev => ({ ...prev, monthData: true }));
        const data = await dashboardService.statisticRenevue("month", selectedYear, selectedMonth);
        setMonthData(data.data);
      } catch (error) {
        console.error("Month data error:", error);
      } finally {
        setLoading(prev => ({ ...prev, monthData: false }));
      }
    };

    loadMonthStatistics();
  }, [selectedYear, selectedMonth]);

  // Helper functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Chart configurations
  const yearlyChartConfig = {
    type: "line",
    height: 400,
    series: [
      {
        name: "Doanh thu",
        data: yearData?.data?.map(month => month.totalRevenue) || Array(12).fill(0),
      },
      {
        name: "Số vé",
        data: yearData?.data?.map(month => month.totalTickets) || Array(12).fill(0),
      },
    ],
    options: {
      chart: {
        toolbar: { show: false },
        animations: { enabled: true },
      },
      colors: ["#4CAF50", "#2196F3"],
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5 },
      xaxis: {
        categories: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        title: { text: "Tháng" },
      },
      yaxis: [
        {
          title: { text: "Doanh thu" },
          labels: { formatter: (value) => formatCurrency(value).replace('₫', '') + '₫' }
        },
        {
          opposite: true,
          title: { text: "Số vé" },
        },
      ],
      tooltip: {
        shared: true,
        y: {
          formatter: (value, { seriesIndex }) => 
            seriesIndex === 0 ? formatCurrency(value) : value
        }
      },
    },
  };

  const monthlyChartConfig = {
    type: "line",
    height: 400,
    series: [
      {
        name: "Doanh thu",
        data: monthData?.data?.map(day => day.totalRevenue) || [],
      },
      {
        name: "Số vé",
        data: monthData?.data?.map(day => day.totalTickets) || [],
      },
    ],
    options: {
      chart: {
        toolbar: { show: false },
        animations: { enabled: true },
      },
      colors: ["#4CAF50", "#2196F3"],
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5 },
      xaxis: {
        categories: monthData?.data?.map(day => formatDate(day.date)) || [],
        title: { text: "Ngày" },
      },
      yaxis: [
        {
          title: { text: "Doanh thu" },
          labels: { formatter: (value) => formatCurrency(value).replace('₫', '') + '₫' }
        },
        {
          opposite: true,
          title: { text: "Số vé" },
        },
      ],
      tooltip: {
        shared: true,
        y: {
          formatter: (value, { seriesIndex }) => 
            seriesIndex === 0 ? formatCurrency(value) : value
        }
      },
    },
  };

  // Loading and error states
  if (loading.years && availableYears.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (availableYears.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        Không có dữ liệu năm nào khả dụng
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.years}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tháng
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.monthData}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

        {/* Monthly Statistics */}
        <div className="bg-white p-4 rounded-lg shadow-md">
        <StatisticsChart
          color="white"
          chart={monthlyChartConfig}
          title={`Doanh thu chi tiết tháng ${selectedMonth}/${selectedYear}`}
          description={
            <>
              <p>Tổng doanh thu: {formatCurrency(monthData?.totalRevenue)}</p>
              <p>Tổng số vé: {monthData?.totalTickets || 0}</p>
            </>
          }
          footer={
            <div className="text-xs text-gray-500 mt-2">
              {loading.monthData ? (
                <span className="flex items-center">
                  <span className="animate-pulse">Đang cập nhật dữ liệu...</span>
                </span>
              ) : (
                `Cập nhật lúc: ${new Date().toLocaleTimeString()}`
              )}
            </div>
          }
        />
      </div>

      {/* Yearly Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <StatisticsChart
          color="white"
          chart={yearlyChartConfig}
          title={`Tổng doanh thu năm ${selectedYear}`}
          description={
            <>
              <p>Tổng doanh thu: {formatCurrency(yearData?.totalRevenue)}</p>
              <p>Tổng số vé: {yearData?.totalTickets || 0}</p>
            </>
          }
          footer={
            <div className="text-xs text-gray-500 mt-2">
              {loading.yearData ? (
                <span className="flex items-center">
                  <span className="animate-pulse">Đang cập nhật dữ liệu...</span>
                </span>
              ) : (
                `Cập nhật lúc: ${new Date().toLocaleTimeString()}`
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default RevenueStatistics;