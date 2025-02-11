"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { PlusCircle } from "lucide-react";
import RoomCard from "./roomCard";
import { RoomType } from "@/types/roomTypes";

interface CreateRoomTypeProps {
  params: { property_id: number };
}

interface CreateRoomTypeFormValues {
  rooms: RoomType[];
}

export default function CreateRoomType({ params }: CreateRoomTypeProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const initialValues: CreateRoomTypeFormValues = {
    rooms: [
      {
        name: "",
        stock: "",
        price: 0,
        capacity: "",
        bed_details: "",
        has_breakfast: false,
        breakfast_price: 0,
        images: [],
        facilities: [],
        imagePreviews: [], // Sertakan property imagePreviews
      },
    ],
  };

  const validationSchema = Yup.object({
    rooms: Yup.array().of(
      Yup.object({
        name: Yup.string().required("Nama kamar wajib diisi"),
        stock: Yup.number()
          .typeError("Jumlah kamar harus berupa angka")
          .required("Jumlah kamar wajib diisi")
          .min(1, "Jumlah kamar minimal 1"),
        price: Yup.number()
          .typeError("Harga harus berupa angka")
          .required("Harga wajib diisi")
          .min(0, "Harga minimal 0"),
        capacity: Yup.number()
          .typeError("Kapasitas tamu harus berupa angka")
          .required("Kapasitas tamu wajib diisi")
          .min(1, "Kapasitas minimal 1"),
        bed_details: Yup.string()
          .required("Detail tempat tidur wajib diisi")
          .test(
            "bed-details-format",
            "Detail harus mencakup jumlah dan tipe kasur (misal: '1 tempat tidur King')",
            (value) => {
              if (!value) return false;
              const regex = /\d+\s*tempat tidur\s+\w+/i;
              return regex.test(value);
            }
          ),
        has_breakfast: Yup.boolean(),
        breakfast_price: Yup.number()
          .typeError("Harga sarapan harus berupa angka")
          .when("has_breakfast", {
            is: true,
            then: (schema: Yup.NumberSchema<number | undefined>) =>
              schema
                .required("Harga sarapan wajib diisi jika sarapan disediakan")
                .min(0, "Harga minimal 0"),
            otherwise: (schema: Yup.NumberSchema<number | undefined>) =>
              schema.notRequired(),
          }),
        images: Yup.array()
          .of(Yup.mixed().required("File wajib diunggah"))
          .max(10, "Maksimal 10 foto diizinkan"),
        facilities: Yup.array().of(Yup.string()),
      })
    ),
  });

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
        const { images, facilities, ...basicData } = room;
        Object.entries(basicData).forEach(([key, value]) => {
          formDataToSend.append(key, String(value));
        });
        formDataToSend.append("property_id", String(params.property_id));
        formDataToSend.append("facilities", JSON.stringify(facilities));
        images.forEach((file) => {
          formDataToSend.append("files", file);
        });
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
    <div className="max-w-6xl mx-auto p-8 bg-white">
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
                  {values.rooms.map((room: RoomType, roomIndex: number) => (
                    <RoomCard
                      key={roomIndex}
                      room={room}
                      roomIndex={roomIndex}
                      availableFacilities={availableFacilities}
                      setFieldValue={setFieldValue}
                      remove={remove}
                    />
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
                        imagePreviews: [], // Pastikan properti ini juga disertakan
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
}
