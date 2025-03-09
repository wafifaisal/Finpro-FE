"use client";

import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, submitReview } from "@/libs/review";
import { IBooking } from "@/types/booking";
import dynamic from "next/dynamic";
import { ErrorMessage, Form, Formik, FormikProps } from "formik";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { reviewSchema } from "@/libs/schema";
import Rating from "@/components/ui/rating";
import Loading from "@/app/loading";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CreateReviewPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewValues, setReviewValues] = useState<{
    rating: number;
    description: string;
  }>({ rating: 5, description: "" });

  useEffect(() => {
    async function fetchBooking() {
      try {
        const data = await getBookingById(bookingId as string);
        console.log("Fetched booking:", data);
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    }
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handleAdd = async (values: { rating: number; description: string }) => {
    try {
      setIsLoading(true);
      await submitReview({
        userId: "2cc09e1c-6cfa-4c7a-8a37-b7b3b3399260",
        bookingId: bookingId as string,
        rating: values.rating,
        comment: values.description,
      });
      toast.success("Review submitted successfully!");
      router.push("/review");
    } catch (err) {
      toast.error("Failed to submit review");
      console.error("Error submitting review:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogSubmit = () => {
    handleAdd(reviewValues);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <TripsNavbar />
      <div className="main-content flex flex-col container mx-auto p-8 px-60">
        <h1 className="text-xl font-bold mb-8">Ceritakan Pengalamanmu</h1>
        <div className="flex gap-2 w-full h-[400px] shadow-md rounded-xl">
          <div className="relative h-64 w-64 m-4">
            {booking && (
              <Image
                src={
                  booking.room_types.RoomImages[0].image_url ||
                  "/placeholder.jpg"
                }
                alt="Room"
                layout="fill"
                className="object-cover rounded-xl"
              />
            )}
          </div>
          <div className="flex flex-col mt-4">
            {booking && (
              <>
                <div className="font-semibold text-lg">
                  {booking.room_types.property.name}
                </div>
                <div className="text-gray-500">{booking.room_types.name}</div>
              </>
            )}
            <p className="mt-4 font-semibold">Tulis Ulasan:</p>
            <Formik
              initialValues={reviewValues}
              validationSchema={reviewSchema}
              onSubmit={(values) => {
                setReviewValues(values);
                setIsDialogOpen(true);
              }}
            >
              {({
                setFieldValue,
                values,
              }: FormikProps<{ rating: number; description: string }>) => (
                <Form className="flex flex-col gap-4">
                  <Rating
                    setFieldValue={setFieldValue}
                    values={values.rating}
                  />
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                  <div className="relative w-[400px]">
                    <ReactQuill
                      theme="snow"
                      value={values.description}
                      onChange={(content) => {
                        const plainText = content.replace(/<[^>]+>/g, "");
                        if (plainText.length <= 200) {
                          setFieldValue("description", content);
                        } else {
                          setFieldValue("description", values.description);
                        }
                      }}
                      className={`w-full rounded-lg border ${
                        values.description.replace(/<[^>]+>/g, "").length > 200
                          ? "border-rose-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                    />
                    <p className="text-sm text-gray-500 absolute right-2">
                      {values.description.replace(/<[^>]+>/g, "").length}/200
                    </p>
                  </div>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                  <Button
                    type="submit"
                    className="bg-red-700 text-white font-semibold w-full hover:bg-red-500 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading ..." : "Submit Ulasan"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Konfirmasi Ulasan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin mengirim ulasan ini?
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleDialogSubmit}
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
