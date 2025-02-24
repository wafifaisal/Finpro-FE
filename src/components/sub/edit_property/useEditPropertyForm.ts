"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormik, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { validationSchema } from "./validationSchema";
import { PropertyFormValues } from "./types";
import { Position } from "@/types/index";

export const useEditPropertyForm = (property_id: number) => {
  const [position, setPosition] = useState<Position>([-6.9175, 107.6191]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [propertyLoaded, setPropertyLoaded] = useState<boolean>(false);
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
  const { setValues } = formik;
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
      setValues({
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
  }, [property_id, base_url, setValues]);
  useEffect(() => {
    if (property_id) {
      loadPropertyData();
    }
  }, [property_id, loadPropertyData]);
  return {
    formik,
    position,
    setPosition,
    imagePreviewUrls,
    loading,
    propertyLoaded,
    handleImageChange,
    removeImage,
    toggleFacility,
  };
};
