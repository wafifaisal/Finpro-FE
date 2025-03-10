"use client";

import { useEffect, useState } from "react";
import { getReviewsByTenant, createReviewReply } from "@/libs/tenantReview";
import { IReview } from "@/types/review";
import SideBar from "@/components/sub/tenant-booking/sideBar";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
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

function TenantReviewPage() {
  const { tenant } = useSession();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: number]: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      if (!tenant) return;
      try {
        const data = await getReviewsByTenant(tenant.id);
        setReviews(data);
      } catch (error) {
        setError("Failed to load reviews.");
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [tenant]);

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
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <ReviewList
                reviews={reviews}
                reply={reply}
                submitting={submitting}
                onReplyChange={handleReplyChange}
                onOpenReply={openReplyDialog}
              />
            )}
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
