"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ImageUploadSection from "../create_property/imageUpload";
import FacilitiesSection from "../create_property/facilitiesSection";
import BasicInfoSection from "../create_property/basicInfo";
import LocationSection from "../create_property/locationSection";
import TermsConditionsSection from "../create_property/termCondition";
import { SAMPLE_FACILITIES, Position } from "@/types/index";

export interface PropertyFormValues {
  name: string;
  desc: string;
  category: string;
  terms_condition: string;
  address: string;
  country: string;
  city: string;
  facilities: string[];
  images: File[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Nama properti wajib diisi"),
  desc: Yup.string()
    .required("Deskripsi wajib diisi")
    .min(20, "Deskripsi harus terdiri dari minimal 20 karakter"),
  category: Yup.string().required("Kategori wajib diisi"),
  terms_condition: Yup.string().required("Syarat & ketentuan wajib diisi"),
  address: Yup.string().required("Alamat wajib diisi"),
  country: Yup.string().required("Negara wajib diisi"),
  city: Yup.string().required("Kota wajib diisi"),
  facilities: Yup.array()
    .of(Yup.string())
    .min(1, "Pilih setidaknya satu fasilitas"),
  images: Yup.array().of(Yup.mixed()).max(10, "Maksimal 10 foto diizinkan"),
});

const EditPropertyForm: React.FC<{ params: { property_id: number } }> = ({
  params,
}) => {
  const [position, setPosition] = useState<Position>([-6.9175, 107.6191]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [propertyLoaded, setPropertyLoaded] = useState<boolean>(false);

  const router = useRouter();
  const property_id = params.property_id;
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  // Configure Formik
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
          title: "Apakah anda sudah yakin dengan data yang diperbarui?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, saya yakin",
          cancelButtonText: "Tidak, saya ingin mengedit kembali",
        });

        if (!confirmResult.isConfirmed) return;

        setLoading(true);
        try {
          const formDataToSend = new FormData();
          const token = localStorage.getItem("token");

          Object.entries(values).forEach(([key, value]) => {
            if (key === "facilities") {
              formDataToSend.append("facilities", JSON.stringify(value));
            } else if (key === "images") {
              // Images are appended separately
            } else {
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

          const response = await fetch(
            `${base_url}/create/property/${property_id}`,
            {
              method: "PUT",
              headers: { Authorization: `Bearer ${token || ""}` },
              body: formDataToSend,
            }
          );
          if (!response.ok) throw new Error(await response.text());

          await response.json();
          Swal.fire({
            title: "Success",
            text: "Properti berhasil diperbarui!",
            icon: "success",
          });
          router.push(`/property-tenant`);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text:
              error instanceof Error
                ? error.message
                : "Gagal memperbarui properti",
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    }
  );

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

  // Load property data using useCallback so that it's stable for useEffect
  const loadPropertyData = useCallback(async () => {
    if (!property_id) {
      Swal.fire({
        title: "Error",
        text: "Property ID tidak ditemukan",
        icon: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${base_url}/property/${property_id}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();

      formik.setValues({
        name: data.name || "",
        desc: data.desc || "",
        category: data.category || "",
        terms_condition: data.terms_condition || "",
        address: data.location?.address || "",
        country: data.location?.country || "",
        city: data.location?.city || "",
        facilities: data.facilities || [],
        images: [],
      });

      if (data.location) {
        setPosition([data.location.latitude, data.location.longitude]);
      }
      if (data.PropertyImages && Array.isArray(data.PropertyImages)) {
        // Replace the explicit any with a type for the image object.
        const urls = data.PropertyImages.map(
          (img: { image_url: string }) => img.image_url
        );
        setImagePreviewUrls(urls);
      }
      setPropertyLoaded(true);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error instanceof Error ? error.message : "Gagal memuat data properti",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [property_id, base_url, formik]);

  useEffect(() => {
    if (property_id) {
      loadPropertyData();
    }
  }, [property_id, loadPropertyData]);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Edit Properti Anda
      </h1>
      {!propertyLoaded ? (
        <div className="text-center py-8">
          <p>Memuat data properti...</p>
        </div>
      ) : (
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
            {loading ? "Memperbarui properti..." : "Perbarui Properti"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPropertyForm;
