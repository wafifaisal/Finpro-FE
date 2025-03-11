"use client";

import { useEffect, useState } from "react";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import { getReviewsByTenant, createReviewReply } from "@/libs/tenantReview";
import { IReview } from "@/types/review";
import SideBar from "@/components/sub/tenant-booking/sideBar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import withGuard from "@/hoc/pageGuard";
import { useSession } from "@/context/useSessionHook";
import Swal from "sweetalert2";
import ReviewList from "@/components/sub/tenant-review/reviewList";
import Pagination from "@/components/sub/tenant-booking/bookingPagination";

function TenantReviewPage() {
  const { tenant } = useSession();

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: number]: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const [totalCount, setTotalCount] = useState(0);
  const [displayType, setDisplayType] = useState<"replied" | "not_replied">(
    "not_replied"
  );

  useEffect(() => {
    async function fetchReviews() {
      if (!tenant) return;
      setLoading(true);
      try {
        const data = await getReviewsByTenant(
          tenant.id,
          currentPage,
          limit,
          displayType
        );
        setReviews(data.reviews);
        setTotalCount(data.pagination.total);
      } catch (error) {
        setError("Failed to load reviews.");
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [tenant, currentPage, limit, displayType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [displayType]);

  const handleReplyChange = (reviewId: number, value: string) => {
    setReply((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async () => {
    if (selectedReviewId === null || !reply[selectedReviewId]) return;
    setSubmitting((prev) => ({ ...prev, [selectedReviewId]: true }));
    try {
      if (!tenant) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Tenant information is missing.",
        });
        return;
      }
      const newReply = await createReviewReply(
        tenant.id,
        selectedReviewId,
        reply[selectedReviewId]
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReviewId
            ? { ...review, reply: newReply }
            : review
        )
      );
      setReply((prev) => ({ ...prev, [selectedReviewId]: "" }));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Reply submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting reply:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit reply.",
      });
    } finally {
      setSubmitting((prev) => ({ ...prev, [selectedReviewId]: false }));
      setIsDialogOpen(false);
    }
  };

  const openReplyDialog = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        <TripsNavbar />
        <div className="flex">
          <SideBar />
          <div className="w-full md:w-[80%] lg:w-[75%] xl:w-[80%] mx-auto pt-0 md:pt-24">
            <p className="font-semibold p-4">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <TripsNavbar />
      <div className="flex">
        <SideBar />
        <div className="w-full md:w-[80%] lg:w-[75%] xl:w-[80%] mx-auto pt-0 md:pt-24">
          <div className="main-content w-[80%] flex flex-col p-4 md:p-8 mb-20">
            <h1 className="text-xl font-bold">Balas Ulasan</h1>
            <div className="border-b-[1px] my-6"></div>

            <div className="flex gap-4">
              <Button
                onClick={() => setDisplayType("not_replied")}
                className={
                  displayType === "not_replied"
                    ? "bg-rose-500 hover:bg-rose-700 text-white font-semibold"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }
              >
                Belum Diulas
              </Button>
              <Button
                onClick={() => setDisplayType("replied")}
                className={
                  displayType === "replied"
                    ? "bg-rose-500 hover:bg-rose-700 text-white font-semibold"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }
              >
                Sudah Diulas
              </Button>
            </div>

            {error ? (
              <p className="text-red-500">{error}</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">
                Tidak ada ulasan untuk ditampilkan.
              </p>
            ) : (
              <ReviewList
                reviews={reviews}
                reply={reply}
                submitting={submitting}
                onReplyChange={handleReplyChange}
                onOpenReply={openReplyDialog}
              />
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / limit)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Konfirmasi Balasan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin mengirim balasan ini?
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleReplySubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withGuard(TenantReviewPage, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
