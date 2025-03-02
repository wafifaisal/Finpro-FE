// EditPropertyForm.tsx
"use client";

import React from "react";
import ImageUploadSection from "../create_property/imageUpload";
import FacilitiesSection from "../create_property/facilitiesSection";
import BasicInfoSection from "../create_property/basicInfo";
import LocationSection from "../create_property/locationSection";
import TermsConditionsSection from "../create_property/termCondition";
import { SAMPLE_FACILITIES } from "@/types/index";
import { useEditPropertyForm } from "./useEditPropertyForm";

const EditPropertyForm: React.FC<{ params: { property_id: number } }> = ({
  params,
}) => {
  const {
    formik,
    position,
    setPosition,
    imagePreviewUrls,
    loading,
    propertyLoaded,
    handleImageChange,
    removeImage,
    toggleFacility,
  } = useEditPropertyForm(params.property_id);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg pt-0 md:pt-28">
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
