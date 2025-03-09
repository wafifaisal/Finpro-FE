"use client";

import { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { uploadPaymentProof } from "@/libs/payment";
import { useRouter } from "next/navigation";

interface FormValues {
  paymentProof: File | null;
}

const FILE_SIZE = 1 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const validationSchema = Yup.object().shape({
  paymentProof: Yup.mixed<File>()
    .required("Silakan pilih file")
    .test(
      "fileSize",
      "File terlalu besar - maksimal 1 MB yang diizinkan",
      (value) => {
        if (!value) return true;
        return value.size <= FILE_SIZE;
      }
    )
    .test("fileFormat", "Format Tidak Didukung", (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    }),
});

export default function PaymentProofUpload({
  bookingId,
}: {
  bookingId: string;
}) {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    if (!values.paymentProof) return;

    const formData = new FormData();
    formData.append("paymentProof", values.paymentProof);
    formData.append("bookingId", bookingId);

    try {
      const message = await uploadPaymentProof(bookingId, formData);
      setUploadStatus(message);
      resetForm();

      router.push("/trips");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Gagal mengunggah bukti pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 border p-4 rounded-md">
      <h2 className="font-bold">Upload Bukti Pembayaran</h2>
      <Formik
        initialValues={{ paymentProof: null as File | null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, isSubmitting }) => (
          <Form className="flex flex-col items-center gap-4 w-full">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  setFieldValue("paymentProof", file);
                }
              }}
              className="border rounded-md p-2 w-full"
            />
            {errors.paymentProof && (
              <p className="text-sm text-red-500">{errors.paymentProof}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-700 px-6 py-2 rounded-lg text-white font-semibold hover:bg-red-800 disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>

            {uploadStatus && (
              <p className="text-sm text-gray-700 text-center">
                {uploadStatus}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
