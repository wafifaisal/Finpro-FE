export const getStatusBadgeStyles = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "new":
      return "bg-rose-100 text-rose-800";
    case "waiting_payment":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "completed":
      return "Selesai";
    case "new":
      return "Pemesanan Baru";
    case "waiting_payment":
      return "Menunggu Pembayaran";
    default:
      return status;
  }
};
