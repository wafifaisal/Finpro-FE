// components/CreateRoomType/CreateRoomTypeForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import Swal from "sweetalert2";
import { PlusCircle } from "lucide-react";

import RoomCard from "./roomCard";
import SeasonalPriceSection from "./SeasonalPrice";
import UnavailableSection from "./UnavailableSection";
import initialValues from "@/types/initialValues";
import validationSchema from "@/types/ValidationSchema";
import {
  RoomFormType,
  CreateRoomTypeFormValues,
} from "@/types/createRoomTypes";
import { availableFacilities } from "@/constants/AvailableFacilities";

interface CreateRoomTypeProps {
  params: { property_id: number };
}

const CreateRoomTypeForm: React.FC<CreateRoomTypeProps> = ({ params }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    values: CreateRoomTypeFormValues,
    {
      resetForm,
      setSubmitting,
      setStatus,
    }: FormikHelpers<CreateRoomTypeFormValues>
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      for (const room of values.rooms) {
        const formDataToSend = new FormData();
        const {
          images,
          facilities,
          seasonal_prices,
          unavailable,
          ...basicData
        } = room;
        Object.entries(basicData).forEach(([key, value]) => {
          formDataToSend.append(key, String(value));
        });
        formDataToSend.append("property_id", String(params.property_id));
        formDataToSend.append("facilities", JSON.stringify(facilities));
        images.forEach((file) => {
          formDataToSend.append("files", file);
        });
        formDataToSend.append(
          "seasonal_prices",
          JSON.stringify(seasonal_prices)
        );
        formDataToSend.append("unavailable", JSON.stringify(unavailable));

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/create/property/${params.property_id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token || ""}` },
            body: formDataToSend,
          }
        );
        if (!res.ok) throw new Error(res.statusText);
      }
      const swalResult = await Swal.fire({
        title: "Berhasil!",
        text: "Tipe kamar berhasil dibuat. Apa yang ingin Anda lakukan selanjutnya?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Buat Tipe Kamar Lainnya",
        cancelButtonText: "Kembali ke Home",
      });
      if (swalResult.isConfirmed) {
        resetForm();
        setStatus({ responseMessage: "Silahkan buat tipe kamar lainnya." });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating room types", error);
      setStatus({ responseMessage: "Gagal membuat tipe kamar." });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white pt-40">
      <h1 className="text-4xl font-bold mb-12">Buat Tipe Kamar Baru</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, status }) => (
          <Form className="space-y-12">
            {status && status.responseMessage && (
              <div
                className={`mb-8 p-4 rounded-2xl ${
                  (status.responseMessage as string).includes("berhasil")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.responseMessage}
              </div>
            )}
            <FieldArray name="rooms">
              {({ push, remove }) => (
                <>
                  {values.rooms.map((room: RoomFormType, roomIndex: number) => (
                    <div
                      key={roomIndex}
                      className="border p-4 rounded-2xl mb-8"
                    >
                      <RoomCard
                        room={room}
                        roomIndex={roomIndex}
                        availableFacilities={availableFacilities}
                        setFieldValue={setFieldValue}
                        remove={remove}
                      />
                      <SeasonalPriceSection
                        roomIndex={roomIndex}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                      <UnavailableSection
                        roomIndex={roomIndex}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        name: "",
                        stock: "",
                        price: 0,
                        capacity: "",
                        bed_details: "",
                        has_breakfast: false,
                        breakfast_price: 0,
                        images: [],
                        facilities: [],
                        imagePreviews: [],
                        seasonal_prices: [],
                        unavailable: [],
                      })
                    }
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <PlusCircle className="w-6 h-6 mr-2" />
                    Tambah Kamar
                  </button>
                </>
              )}
            </FieldArray>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Loading..." : "Buat Tipe Kamar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateRoomTypeForm;
