// src/app/BookingManagementPage.tsx
"use client";

import { useState } from "react";
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
import { useBookings } from "@/components/main/booking-management/useBookings";

export default function BookingManagementPage() {
  const { tenant } = useSession();
  const { bookings, setBookings, loading } = useBookings(tenant?.id);
  const [selectedImage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    bookingId: string;
    status: BookingStatus;
  } | null>(null);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );

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
      window.location.reload();
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

  return (
    <div className="min-h-screen bg-white">
      <TripsNavbar />
      <div className="flex">
        <SideBar />
        <div className="w-full md:w-[80%] lg:w-[75%] xl:w-[80%] mx-auto pt-0 md:pt-24">
          <div className="main-content flex flex-col p-4 md:p-8 mb-20">
            <h1 className="text-2xl font-bold text-gray-900">Reservasi</h1>
            <p className="text-gray-500 mt-1 mb-6">
              Kelola semua pemesanan properti Anda
            </p>
            <div className="flex mb-8 border-b">
              <button
                className={`py-3 px-6 font-medium text-sm transition-colors ${
                  selectedTab === "ongoing"
                    ? "text-rose-500 border-b-2 border-rose-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setSelectedTab("ongoing")}
              >
                Pemesanan Aktif
              </button>
              <button
                className={`py-3 px-6 font-medium text-sm transition-colors ${
                  selectedTab === "completed"
                    ? "text-rose-500 border-b-2 border-rose-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Selesai
              </button>
            </div>

            <BookingList
              bookings={bookings}
              selectedTab={selectedTab}
              selectedImage={selectedImage}
              onOpenConfirm={openConfirmDialog}
              onCancelBooking={openCancelDialog}
              handleResendEmail={handleResendEmail}
            />
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
