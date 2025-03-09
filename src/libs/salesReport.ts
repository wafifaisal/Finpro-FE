import { ISalesReport } from "@/types/salesReport";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const getSalesReport = async (
  tenantId: string,
  startDate?: string,
  endDate?: string,
  sortBy?: "date" | "total_penjualan"
): Promise<ISalesReport[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("tenantId", tenantId);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (sortBy) queryParams.append("sortBy", sortBy);

    const response = await fetch(
      `${BASE_URL}/sales-report?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ISalesReport[];
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil laporan penjualan.";
    console.error("Gagal mengambil laporan penjualan:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: errorMessage,
    });
    throw error;
  }
};
