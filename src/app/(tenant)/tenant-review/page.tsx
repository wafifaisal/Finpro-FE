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

export default function TenantReviewPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: number]: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const tenantId = "15881def-f8ab-4074-8b2f-78d0afe414bb";

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getReviewsByTenant(tenantId);
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [tenantId]);

  const handleReplyChange = (reviewId: number, value: string) => {
    setReply((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async () => {
    if (selectedReviewId === null || !reply[selectedReviewId]) return;

    setSubmitting((prev) => ({ ...prev, [selectedReviewId]: true }));

    try {
      const newReply = await createReviewReply(
        tenantId,
        selectedReviewId,
        reply[selectedReviewId]
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === selectedReviewId
            ? { ...review, reply: newReply } // Update review with reply
            : review
        )
      );

      setReply((prev) => ({ ...prev, [selectedReviewId]: "" }));
      alert("Reply submitted successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [selectedReviewId]: false }));
      setIsDialogOpen(false);
    }
  };

  const openReplyDialog = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <TripsNavbar />
      <div className="flex">
        <SideBar />
        <div className="w-[70%]">
          <div className="main-content flex flex-col container mx-auto p-8 px-20 mb-20">
            <h1 className="text-xl font-bold">Balas Ulasan</h1>
            <div className="border-b-[1px] my-6"></div>

            {loading ? (
              <p>Loading reviews...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-lg mb-4">
                  <p
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: review.review,
                    }}
                  ></p>
                  <p className="text-gray-600 text-sm">
                    Rating: {review.rating}/5
                  </p>

                  {review.reply ? (
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      <p className="text-sm text-gray-800">Tenant Reply:</p>
                      <p className="text-gray-600">{review.reply.reply}</p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        className="border p-2 w-full mt-2"
                        placeholder="Type your reply here..."
                        value={reply[review.id] || ""}
                        onChange={(e) =>
                          handleReplyChange(review.id, e.target.value)
                        }
                      />
                      <button
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                        disabled={submitting[review.id]}
                        onClick={() => openReplyDialog(review.id)}
                      >
                        {submitting[review.id] ? "Submitting..." : "Reply"}
                      </button>
                    </>
                  )}
                </div>
              ))
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
