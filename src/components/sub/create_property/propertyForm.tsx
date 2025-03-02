"use client";

import React, { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ImageUploadSection from "./imageUpload";
import FacilitiesSection from "./facilitiesSection";
import BasicInfoSection from "./basicInfo";
import LocationSection from "./locationSection";
import TermsConditionsSection from "./termCondition";
import { SAMPLE_FACILITIES, Position } from "@/types/index";
import { PropertyFormValues, validationSchema } from "./validationSchema";

const PropertyForm: React.FC = () => {
  const [position, setPosition] = useState<Position>([-6.9175, 107.6191]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const formik: FormikProps<PropertyFormValues> = useFormik<PropertyFormValues>(
    {
      initialValues: {
        name: "",
        desc: "",
        category: "",
        terms_condition: "",
        address: "",
        country: "",
        city: "",
        facilities: [],
        images: [],
      },
      validationSchema,
      onSubmit: async (values) => {
        const confirmResult = await Swal.fire({
          title: "Apakah anda sudah yakin dengan data anda?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, saya yakin",
          cancelButtonText: "Tidak, saya ingin mengedit kembali",
        });

        if (!confirmResult.isConfirmed) {
          return;
        }

        setLoading(true);
        try {
          const formDataToSend = new FormData();
          const token = localStorage.getItem("token");

          Object.entries(values).forEach(([key, value]) => {
            if (key === "facilities") {
              formDataToSend.append("facilities", JSON.stringify(value));
            } else if (key !== "images") {
              formDataToSend.append(key, value.toString());
            }
          });

          const locationObj = {
            address: values.address,
            country: values.country,
            city: values.city,
            longitude: position[1],
            latitude: position[0],
          };

          formDataToSend.append("location", JSON.stringify(locationObj));

          values.images.forEach((image: File) =>
            formDataToSend.append("files", image)
          );

          const response = await fetch(`${base_url}/create/property`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token || ""}` },
            body: formDataToSend,
          });

          if (!response.ok) throw new Error(await response.text());

          const data = await response.json();

          router.push(`/property-tenant/create/${data.property_id}`);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text:
              error instanceof Error ? error.message : "Gagal membuat properti",
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    }
  );

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (error) => console.error("Kesalahan geolokasi:", error)
    );
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...formik.values.images, ...newFiles].slice(0, 10);
      formik.setFieldValue("images", updatedFiles);

      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      const updatedPreviews = [...imagePreviewUrls, ...newPreviewUrls].slice(
        0,
        10
      );
      setImagePreviewUrls(updatedPreviews);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...formik.values.images];
    updatedFiles.splice(index, 1);
    formik.setFieldValue("images", updatedFiles);

    setImagePreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleFacility = (facilityId: string) => {
    const currentFacilities = formik.values.facilities;
    const newFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter((id) => id !== facilityId)
      : [...currentFacilities, facilityId];
    formik.setFieldValue("facilities", newFacilities);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg pt-0 md:pt-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Daftarkan Properti Anda
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <ImageUploadSection
          imagePreviewUrls={imagePreviewUrls}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />
        {formik.errors.images && formik.touched.images && (
          <div className="text-red-500 text-sm">
            {Array.isArray(formik.errors.images)
              ? formik.errors.images.join(", ")
              : (formik.errors.images as string)}
          </div>
        )}

        <FacilitiesSection
          facilities={formik.values.facilities}
          toggleFacility={toggleFacility}
          sampleFacilities={SAMPLE_FACILITIES}
          error={formik.errors.facilities as string | string[] | undefined}
          touched={formik.touched.facilities as boolean}
        />

        <BasicInfoSection formik={formik} />

        <LocationSection
          formik={formik}
          position={position}
          setPosition={setPosition}
        />

        <TermsConditionsSection formik={formik} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-rose-700 disabled:bg-rose-400 transition-colors"
        >
          {loading
            ? "Sedang membuat listing Anda..."
            : "Daftarkan Properti Anda"}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
