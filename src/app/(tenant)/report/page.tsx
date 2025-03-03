"use client";

import { useEffect, useState } from "react";
import { getSalesReport } from "@/libs/salesReport";
import { ISalesReport } from "@/types/salesReport";
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
import { DatePicker, Select, Button } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ReportPage = () => {
  const tenantId = "15881def-f8ab-4074-8b2f-78d0afe414bb";

  const today = dayjs();
  const defaultStartDate = today.format("YYYY-MM-DD");
  const defaultEndDate = today.add(1, "month").format("YYYY-MM-DD");

  const [salesData, setSalesData] = useState<ISalesReport[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "total_penjualan">("date");
  const [dateRange, setDateRange] = useState<[string, string]>([
    defaultStartDate,
    defaultEndDate,
  ]);

  useEffect(() => {
    fetchSalesReport();
  }, [sortBy, dateRange]);

  const fetchSalesReport = async () => {
    try {
      const [startDate, endDate] = dateRange;
      console.log("Fetching data from:", startDate, "to", endDate);

      const data = await getSalesReport(tenantId, startDate, endDate, sortBy);

      const sortedData = [...data].sort((a, b) =>
        dayjs(a.start_date).isAfter(dayjs(b.start_date)) ? 1 : -1
      );

      setSalesData(sortedData);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Penjualan</h1>

      <div className="flex gap-4 mb-6">
        <RangePicker
          value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
          onChange={(dates: [Dayjs | null, Dayjs | null] | null) =>
            setDateRange(
              dates && dates[0] && dates[1]
                ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]
                : [defaultStartDate, defaultEndDate] // Reset if cleared
            )
          }
        />
        <Select
          value={sortBy}
          onChange={(value: "date" | "total_penjualan") => setSortBy(value)}
          style={{ width: 200 }}
        >
          <Select.Option value="date">Tanggal</Select.Option>
          <Select.Option value="total_penjualan">Total Penjualan</Select.Option>
        </Select>
        <Button type="primary" onClick={fetchSalesReport}>
          Tampilkan
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(tick) => dayjs(tick).format("YYYY-MM-DD")}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_price"
            name="Total Penjualan"
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportPage;
