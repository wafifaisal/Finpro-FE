"use client";

import { useEffect, useState } from "react";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import {
  cancelBooking,
  getTenantBooking,
  resendBookingConfirmation,
  updateBookingStatus,
} from "@/libs/tenantBooking";
import { IBooking, BookingStatus } from "@/types/booking";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import { toast } from "react-hot-toast";
import Image from "next/image";
import SideBar from "@/components/sub/tenant-booking/sideBar";

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    bookingId: string;
    status: BookingStatus;
  } | null>(null);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );

  const tenantId = "77b66d85-4228-4326-b3e7-e5109ca225e6";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getTenantBooking(tenantId);
        setBookings(data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [tenantId]);

  const handleResendEmail = async (bookingId: string) => {
    try {
      await resendBookingConfirmation(bookingId);
      toast.success("Booking confirmation email resent!");
    } catch (error) {
      toast.error("Failed to resend email");
      console.error("Resend email failed:", error);
    }
  };

  const handleConfirmStatus = async () => {
    if (!confirmDialog) return;

    try {
      console.log(
        "Updating status:",
        confirmDialog.bookingId,
        confirmDialog.status
      );
      await updateBookingStatus(confirmDialog.bookingId, confirmDialog.status);

      if (confirmDialog.status === BookingStatus.completed) {
        await handleResendEmail(confirmDialog.bookingId);
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === confirmDialog.bookingId
            ? { ...booking, status: confirmDialog.status }
            : booking
        )
      );

      toast.success(`Status updated to ${confirmDialog.status}`);

      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Update failed:", err);
    } finally {
      setConfirmDialog(null);
      setIsDialogOpen(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelDialog) return;
    try {
      await cancelBooking(cancelDialog, tenantId);
      toast.success("Booking canceled successfully");
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== cancelDialog)
      );
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error("Cancel booking failed:", error);
    } finally {
      setCancelDialog(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // 🔹 Filter bookings based on the selected tab
  const filteredBookings =
    selectedTab === "ongoing"
      ? bookings.filter(
          (booking) =>
            booking.status === "new" || booking.status === "waiting_payment"
        )
      : bookings.filter((booking) => booking.status === "completed");

  return (
    <div className="min-h-screen">
      <TripsNavbar />
      <div className="flex">
        <SideBar />
        <div className="w-[70%]">
          <div className="main-content flex flex-col container mx-auto p-8 px-20 mb-20">
            <h1 className="text-xl font-bold">Daftar Reservasi</h1>
            <div className="border-b-[1px] my-6"></div>

            {/* 🔹 Tab Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                className={`${
                  selectedTab === "ongoing"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => setSelectedTab("ongoing")}
              >
                Ongoing Booking
              </Button>
              <Button
                className={`${
                  selectedTab === "completed"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed Booking
              </Button>
            </div>

            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border p-4 rounded-lg shadow-md"
                  >
                    <p>No. Reservasi: {booking.id.slice(0, 8)}</p>
                    <p>
                      <strong>Nama Properti:</strong>{" "}
                      {booking.room_types.property.name}
                    </p>
                    <p>
                      <strong>Tipe Kamar:</strong> {booking.room_types.name}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`px-2 py-1 rounded-lg ${
                          booking.status === "completed"
                            ? "bg-green-200"
                            : "bg-yellow-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p>
                      <strong>Total Harga:</strong> Rp {booking.total_price}
                    </p>
                    {booking.status === "new" && (
                      <div className="mt-4">
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => setCancelDialog(booking.id)}
                        >
                          Batalkan Booking
                        </Button>
                      </div>
                    )}
                    {booking.payment_proof && (
                      <div className="mt-2">
                        <Dialog>
                          <DialogTrigger
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() =>
                              setSelectedImage(booking.payment_proof ?? null)
                            }
                          >
                            Lihat Bukti Pembayaran
                          </DialogTrigger>
                          <DialogContent>
                            <Image
                              src={selectedImage || booking.payment_proof}
                              alt="Bukti Pembayaran"
                              width={500} // Set an appropriate width
                              height={500} // Set an appropriate height
                              className="w-full h-auto max-h-[80vh] object-contain"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {booking.status === "waiting_payment" && (
                      <div className="mt-4 flex gap-4">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => {
                            setConfirmDialog({
                              bookingId: booking.id,
                              status: BookingStatus.completed,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          Terima Pembayaran
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => {
                            setConfirmDialog({
                              bookingId: booking.id,
                              status: BookingStatus.new,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          Tolak Pembayaran
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Tidak ada reservasi.</p>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <p className="text-lg">
                Apakah Anda yakin ingin mengubah status pesanan menjadi{" "}
                <strong>
                  {confirmDialog?.status === "completed" ? "Selesai" : "Baru"}
                </strong>
                ?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  onClick={() => {
                    setConfirmDialog(null);
                    setIsDialogOpen(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmStatus}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Konfirmasi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={!!cancelDialog}
            onOpenChange={() => setCancelDialog(null)}
          >
            <DialogContent>
              <p className="text-lg">
                Apakah Anda yakin ingin membatalkan booking pelanggan?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => setCancelDialog(null)}
                >
                  Batal
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleCancelBooking}
                >
                  Konfirmasi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
