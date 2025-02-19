// pages/EditRoomType.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import Swal from "sweetalert2";
import { format } from "date-fns";
import RoomCard from "../create_roomtype/roomCard";
import validationSchema from "@/types/ValidationSchema";
import SeasonalPriceSection from "./SeasonalPriceSection";
import UnavailableSection from "./UnavailableSection";
import {
  EditRoomTypeFormValues,
  EditRoom,
  SeasonalPrice,
  UnavailablePeriod,
} from "@/types/EditRoomTypes";

interface EditRoomTypeProps {
  params: { property_id: number; roomtype_id: number };
}

export default function EditRoomType({ params }: EditRoomTypeProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<EditRoomTypeFormValues>({
    rooms: [],
  });

  const availableFacilities = [
    { id: "WIFI", name: "WiFi" },
    { id: "TV", name: "TV" },
    { id: "AC", name: "AC" },
    { id: "ROOM_SERVICES", name: "Layanan Kamar" },
    { id: "MINI_BAR", name: "Mini Bar" },
    { id: "LAUNDRY", name: "Laundry" },
    { id: "SETRIKA", name: "Setrika" },
    { id: "ALAT_PEMADAM_API", name: "Alat Pemadam Api" },
    { id: "MICROWAVE", name: "Microwave" },
    { id: "KULKAS", name: "Kulkas" },
    { id: "RUANG_KERJA_KHUSUS", name: "Ruang kerja khusus" },
    { id: "KITCHEN", name: "Dapur" },
    { id: "HEATING", name: "Pemanas Ruangan" },
    { id: "AIR_PURIFIER", name: "Pembersih Udara" },
    { id: "SAFE", name: "Brankas" },
    { id: "BATHROBES", name: "Jubah Mandi" },
    { id: "TEA_COFFEE_MAKER", name: "Pembuat Teh/Kopi" },
    { id: "BALCONY", name: "Balkon" },
    { id: "BATHTUB", name: "Bak Mandi" },
    { id: "JACUZZI", name: "Jacuzzi" },
    { id: "PRIVATE_POOL", name: "Kolam Privat" },
  ];

  // Fetch room type data from backend
  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/property/roomtypes/${params.property_id}/${params.roomtype_id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token || ""}` },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data room type");
        const data = await res.json();
        const roomData = data.roomType;
        const imagePreviews = roomData.RoomImages
          ? roomData.RoomImages.map(
              (img: { image_url: string }) => img.image_url
            )
          : [];
        const unavailable = (
          roomData.unavailable ||
          roomData.Unavailable ||
          []
        ).map((u: UnavailablePeriod & { id?: number }) => ({
          id: u.id,
          start_date: format(new Date(u.start_date), "yyyy-MM-dd"),
          end_date: format(new Date(u.end_date), "yyyy-MM-dd"),
        }));
        const seasonal_prices = (roomData.seasonal_prices || []).map(
          (sp: SeasonalPrice) => ({
            ...sp,
            start_date: format(new Date(sp.start_date), "yyyy-MM-dd"),
            end_date: format(new Date(sp.end_date), "yyyy-MM-dd"),
          })
        );
        setInitialValues({
          rooms: [
            {
              ...roomData,
              imagePreviews,
              unavailable,
              seasonal_prices,
              images: [],
            } as EditRoom,
          ],
        });
      } catch (error) {
        console.error("Error fetching room type data", error);
      }
    };
    fetchRoomType();
  }, [params.roomtype_id, params.property_id]);

  const handleSubmit = async (
    values: EditRoomTypeFormValues,
    {
      resetForm,
      setSubmitting,
      setStatus,
    }: FormikHelpers<EditRoomTypeFormValues>
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      for (const room of values.rooms) {
        const {
          images = [],
          facilities,
          seasonal_prices,
          unavailable,
          ...basicData
        } = room;
        const formDataToSend = new FormData();
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
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/create/roomtype/${params.roomtype_id}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token || ""}` },
            body: formDataToSend,
          }
        );
        if (!res.ok) throw new Error(res.statusText);
      }
      const swalResult = await Swal.fire({
        title: "Berhasil!",
        text: "Tipe kamar berhasil diperbarui. Apa yang ingin Anda lakukan selanjutnya?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Edit Tipe Kamar Lainnya",
        cancelButtonText: "Kembali ke Home",
      });
      if (swalResult.isConfirmed) {
        resetForm();
        setStatus({ responseMessage: "Silahkan edit tipe kamar lainnya." });
      } else {
        router.push("/property-tenant");
      }
    } catch (error) {
      console.error("Error updating room type", error);
      setStatus({ responseMessage: "Gagal memperbarui tipe kamar." });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (initialValues.rooms.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <h1 className="text-4xl font-bold mb-12">Edit Tipe Kamar</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
              {({ remove }) => (
                <>
                  {values.rooms.map((room, roomIndex: number) => (
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
                </>
              )}
            </FieldArray>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Loading..." : "Perbarui Tipe Kamar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
