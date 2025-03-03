import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingStatus, IBooking } from "@/types/booking";
import { getStatusBadgeStyles, getStatusText } from "./bookingUtils";

interface BookingItemProps {
  booking: IBooking;
  onOpenConfirm: (bookingId: string, status: BookingStatus) => void;
  onCancelBooking: (bookingId: string) => void;
  selectedImage: string | null;
  handleResendEmail: (bookingId: string) => Promise<void>;
}

export default function BookingItem({
  booking,
  onOpenConfirm,
  onCancelBooking,
  selectedImage,
}: BookingItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="font-semibold text-xl text-gray-900">
              {booking.room_types.property.name}
            </h3>
            <p className="text-gray-600 mt-1">{booking.room_types.name}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(
                booking.status
              )}`}
            >
              {getStatusText(booking.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">ID Reservasi</p>
            <p className="font-medium">{booking.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Harga Total</p>
            <p className="font-medium text-rose-600">
              Rp {booking.total_price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          {booking.payment_proof && (
            <Dialog>
              <DialogTrigger className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Lihat Bukti Pembayaran
              </DialogTrigger>
              <DialogContent className="bg-white p-0 rounded-lg overflow-hidden max-w-2xl">
                <Image
                  src={selectedImage || booking.payment_proof}
                  alt="Bukti Pembayaran"
                  width={600}
                  height={600}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          )}

          {booking.status === "waiting_payment" && (
            <>
              <Button
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium transition-colors"
                onClick={() =>
                  onOpenConfirm(booking.id, BookingStatus.completed)
                }
              >
                Terima Pembayaran
              </Button>
              <Button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                onClick={() => onOpenConfirm(booking.id, BookingStatus.new)}
              >
                Tolak Pembayaran
              </Button>
            </>
          )}

          {booking.status === "new" && (
            <Button
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              onClick={() => onCancelBooking(booking.id)}
            >
              Batalkan Pemesanan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
