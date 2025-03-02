import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";

interface ConfirmDialogProps {
  isOpen: boolean;
  status: BookingStatus | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  status,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-xl max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Konfirmasi Perubahan Status
        </h3>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin mengubah status pemesanan ini menjadi{" "}
          <span className="font-medium text-rose-600">
            {status === "completed" ? "Selesai" : "Pemesanan Baru"}
          </span>
          ?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium transition-colors"
          >
            Konfirmasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export function CancelDialog({
  isOpen,
  onClose,
  onConfirmCancel,
}: CancelDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-6 rounded-xl max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Batalkan Pemesanan
        </h3>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin membatalkan pemesanan pelanggan ini? Tindakan
          ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            Pertahankan Pemesanan
          </Button>
          <Button
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium transition-colors"
            onClick={onConfirmCancel}
          >
            Batalkan Pemesanan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
