"use client";

import { useCallback, useEffect, useState } from "react";
import { getSalesReport } from "@/libs/salesReport";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import SideBar from "@/components/sub/tenant-booking/sideBar";
import { FaArrowRight } from "react-icons/fa6";
import { formatDate } from "@/helpers/formatDate";
import { formatCurrency } from "@/helpers/formatCurrency";
import { CustomizedYAxisTick } from "@/components/sub/report/yAxis";
import { useSession } from "@/context/useSessionHook";
import Loading from "@/app/loading";
import withGuard from "@/hoc/pageGuard";
import PropertyAvailability from "@/components/sub/report/propertyAvailability";

// Define an interface for aggregated sales data
interface AggregatedSalesData {
  created_at: string;
  total_price: number;
}

const ReportPage = () => {
  const { tenant, loading } = useSession();

  if (loading) return <Loading />;
  if (!tenant) return <div>Please sign in to view your report.</div>;

  const tenantId = tenant.id;

  const today = dayjs();
  const defaultStartDate = today.subtract(1, "month").toDate();
  const defaultEndDate = today.add(1, "day").toDate();

  const [salesData, setSalesData] = useState<AggregatedSalesData[]>([]);
  const sortBy: "date" | "total_penjualan" = "date";
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    defaultStartDate,
    defaultEndDate,
  ]);

  const fetchSalesReport = useCallback(async () => {
    try {
      const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
      const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
      console.log("Fetching data from:", startDate, "to", endDate);

      // Get the raw sales report data.
      const data = await getSalesReport(tenantId, startDate, endDate, sortBy);

      // Aggregate data: group by day (using the created_at date)
      const aggregated = data.reduce((acc, booking) => {
        const key = dayjs(booking.created_at).format("YYYY-MM-DD");
        if (!acc[key]) {
          acc[key] = { created_at: key, total_price: 0 };
        }
        acc[key].total_price += booking.total_price;
        return acc;
      }, {} as Record<string, AggregatedSalesData>);

      const aggregatedData = Object.values(aggregated);
      // Sort ascending so the earliest date appears on the left.
      aggregatedData.sort((a, b) =>
        dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1
      );
      setSalesData(aggregatedData);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  }, [tenantId, dateRange, sortBy]);

  useEffect(() => {
    fetchSalesReport();
  }, [fetchSalesReport]);

  return (
    <div className="h-min-screen">
      <TripsNavbar />
      <div className="flex">
        <SideBar />
        <div className="w-full md:w-[80%] lg:w-[75%] xl:w-[80%] mx-auto pt-0 md:pt-24">
          <div className="flex flex-col container mx-auto p-8">
            <h2 className="font-bold text-xl text-gray-800 mb-4">
              Analisis Penjualan
            </h2>
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              {/* Date pickers for start and end dates */}
              <div className="flex gap-2 border border-rose-700 shadow-md p-2 rounded-xl">
                <label className="text-sm font-semibold text-rose-700">
                  Start Date :
                </label>
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(date: Date | null) => {
                    if (date) setDateRange([date, dateRange[1]]);
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="cursor-pointer shadow-md p-1 text-sm hover:bg-gray-100"
                />
              </div>
              <div>
                <FaArrowRight />
              </div>
              <div className="flex gap-2 border border-gray-700 shadow-md p-2 rounded-xl">
                <label className="text-sm font-semibold text-gray-600">
                  End Date :
                </label>
                <DatePicker
                  selected={dateRange[1]}
                  onChange={(date: Date | null) => {
                    if (date) setDateRange([dateRange[0], date]);
                  }}
                  dateFormat="yyyy-MM-dd"
                  minDate={dateRange[0]}
                  className="cursor-pointer shadow-md p-1 text-sm hover:bg-gray-100"
                />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={(tick) => formatDate(tick, "MMMM dd, yyyy")}
                  className="text-sm"
                />
                <YAxis
                  tickFormatter={(tick) => formatCurrency(tick)}
                  tick={(props) => <CustomizedYAxisTick {...props} />}
                  className="text-sm"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => formatDate(label, "MMMM dd, yyyy")}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_price"
                  name="Total Penjualan"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="w-full border-[1px] my-4"></div>
            <PropertyAvailability tenantId={tenantId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withGuard(ReportPage, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
