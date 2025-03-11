"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import SideBar from "@/components/sub/tenant-booking/sideBar";
import Loading from "@/app/loading";
import { toast } from "react-hot-toast";
import { useSession } from "@/context/useSessionHook";
import BookingList from "@/components/main/booking-management/BookingList";
import {
  ConfirmDialog,
  CancelDialog,
} from "@/components/main/booking-management/BookingDialog";
import {
  resendBookingConfirmation,
  updateBookingStatus,
  cancelBooking,
} from "@/libs/tenantBooking";
import { BookingStatus, IBooking } from "@/types/booking";
import { useBookings } from "@/hooks/useBookings";
import BookingSearchFilter from "@/components/sub/tenant-booking/bookingSearchFilter";
import BookingPagination from "@/components/sub/tenant-booking/bookingPagination";

export default function BookingManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenant } = useSession();

  const initialFilterType = searchParams.get("filterType") || "property";
  const initialSearchValue = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const { bookings, setBookings, loading, refetch, totalPages } = useBookings(
    tenant?.id
  );
  const visibleBookings = bookings.filter(
    (booking) => booking.status !== BookingStatus.canceled
  );

  const [selectedImage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    bookingId: string;
    status: BookingStatus;
  } | null>(null);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);

  if (loading) {
    return <Loading />;
  }

  const handleResendEmail = async (bookingId: string) => {
    try {
      await resendBookingConfirmation(bookingId);
      toast.success("Email konfirmasi pemesanan telah dikirim ulang!");
    } catch (error) {
      toast.error("Gagal mengirim ulang email");
      console.error("Error resending email:", error);
    }
  };

  const handleConfirmStatus = async () => {
    if (!confirmDialog) return;
    try {
      await updateBookingStatus(confirmDialog.bookingId, confirmDialog.status);
      if (confirmDialog.status === BookingStatus.completed) {
        await handleResendEmail(confirmDialog.bookingId);
      }
      setBookings((prev: IBooking[]) =>
        prev.map((booking) =>
          booking.id === confirmDialog.bookingId
            ? { ...booking, status: confirmDialog.status }
            : booking
        )
      );
      toast.success(`Status diperbarui menjadi ${confirmDialog.status}`);
      refetch();
    } catch (err) {
      toast.error("Gagal memperbarui status");
      console.error("Error updating status:", err);
    } finally {
      setConfirmDialog(null);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelDialog || !tenant?.id) return;
    try {
      await cancelBooking(cancelDialog, tenant.id);
      toast.success("Pemesanan berhasil dibatalkan");
      setBookings((prev: IBooking[]) =>
        prev.filter((booking) => booking.id !== cancelDialog)
      );
    } catch (error) {
      toast.error("Gagal membatalkan pemesanan");
      console.error("Error canceling booking:", error);
    } finally {
      setCancelDialog(null);
    }
  };

  const openConfirmDialog = (bookingId: string, status: BookingStatus) => {
    setConfirmDialog({ bookingId, status });
    setIsConfirmDialogOpen(true);
  };

  const openCancelDialog = (bookingId: string) => {
    setCancelDialog(bookingId);
  };

  const handleSearch = (filterType: string, searchValue: string) => {
    const params: Record<string, string> = {};
    params.filterType = filterType;
    if (
      filterType === "status-new" ||
      filterType === "status-waiting_payment" ||
      filterType === "status-completed"
    ) {
      params.status = filterType.split("-")[1];
    } else {
      params.q = searchValue;
      params.search = searchValue;
    }
    params.page = "1";
    const queryString = new URLSearchParams(params).toString();
    router.push(`?${queryString}`);
    refetch();
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams();
    params.set("filterType", "property");
    params.set("q", "");
    params.set("search", "");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <TripsNavbar />
      <div className="flex flex-col md:flex-row">
        <SideBar />
        <div className="w-full md:w-[80%] lg:w-[75%] xl:w-[80%] mx-auto pt-0 md:pt-24">
          <div className="main-content w-full flex flex-col p-4 md:p-8 mb-20">
            <h1 className="text-2xl font-bold text-gray-900">Reservasi</h1>
            <p className="text-gray-500 mt-1 mb-6">
              Kelola semua pemesanan properti Anda
            </p>

            <BookingSearchFilter
              initialFilterType={initialFilterType}
              initialSearchValue={initialSearchValue}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />

            <BookingList
              bookings={visibleBookings}
              selectedImage={selectedImage}
              onOpenConfirm={openConfirmDialog}
              onCancelBooking={openCancelDialog}
              handleResendEmail={handleResendEmail}
            />

            {totalPages > 1 && (
              <BookingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            status={confirmDialog ? confirmDialog.status : null}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleConfirmStatus}
          />

          <CancelDialog
            isOpen={!!cancelDialog}
            onClose={() => setCancelDialog(null)}
            onConfirmCancel={handleCancelBooking}
          />
        </div>
      </div>
    </div>
  );
}
