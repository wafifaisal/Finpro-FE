"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const FILE_SIZE = 1 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

interface FormValues {
  file: File | null;
}

const validationSchema = Yup.object().shape({
  file: Yup.mixed<File>()
    .required("Silakan pilih gambar")
    .test(
      "fileSize",
      "File terlalu besar - maksimal 1 MB yang diizinkan",
      (value) => {
        if (!value) return true;
        return value instanceof File && value.size <= FILE_SIZE;
      }
    )
    .test("fileFormat", "Format Tidak Didukung", (value) => {
      if (!value) return true;
      return value instanceof File && SUPPORTED_FORMATS.includes(value.type);
    }),
});

interface AvatarUploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function AvatarUploadModal({
  onClose,
  onUploadSuccess,
}: AvatarUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (!values.file) return;

    const formData = new FormData();
    formData.append("file", values.file);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
      setUploading(true);
      const response = await fetch(`${base_url}/tenant/avatar-cloud`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        onUploadSuccess();
      } else {
        throw new Error(`Failed to upload. Status: ${response.status}`);
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Gagal memperbarui foto profil Anda. Coba lagi nanti.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Profile Picture</h2>

        <Formik<FormValues>
          initialValues={{ file: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {previewImage && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}

                <input
                  id="picture"
                  type="file"
                  accept="image/jpg, image/jpeg, image/png, image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("file", file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />

                <label
                  htmlFor="picture"
                  className="cursor-pointer bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition-colors text-sm font-medium"
                >
                  Pilih Gambar
                </label>

                {errors.file && (
                  <p className="text-sm text-red-500 text-center">
                    {errors.file as string}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
