import BookingItem from "./BookingItem";
import { IBooking, BookingStatus } from "@/types/booking";

interface BookingListProps {
  bookings: IBooking[];
  selectedImage: string | null;
  onOpenConfirm: (bookingId: string, status: BookingStatus) => void;
  onCancelBooking: (bookingId: string) => void;
  handleResendEmail: (bookingId: string) => Promise<void>;
}

export default function BookingList({
  bookings,
  selectedImage,
  onOpenConfirm,
  onCancelBooking,
  handleResendEmail,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 rounded-full bg-rose-50 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Tidak ada reservasi yang ditemukan
        </h3>
        <p className="text-gray-500">
          Saat ini, Anda tidak memiliki reservasi.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          selectedImage={selectedImage}
          onOpenConfirm={onOpenConfirm}
          onCancelBooking={onCancelBooking}
          handleResendEmail={handleResendEmail}
        />
      ))}
    </div>
  );
}
