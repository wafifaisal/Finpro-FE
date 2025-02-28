"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { format } from "date-fns";
import EditRoomTypeForm from "./EditRoomtypeForm";
import {
  EditRoomTypeFormValues,
  EditRoom,
  SeasonalPrice,
  UnavailablePeriod,
} from "@/types/EditRoomTypes";

interface EditRoomTypeProps {
  params: { property_id: number; roomtype_id: number };
}
interface RoomImage {
  image_url: string;
}
interface FetchRoomTypeResponse {
  roomType: {
    RoomImages?: RoomImage[];
    unavailable?: UnavailablePeriod[];
    Unavailable?: UnavailablePeriod[];
    seasonal_prices?: SeasonalPrice[];
    [key: string]: unknown;
  };
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
        const data: FetchRoomTypeResponse = await res.json();
        const roomData = data.roomType;
        const imagePreviews: string[] = roomData.RoomImages
          ? roomData.RoomImages.map((img: RoomImage) => img.image_url)
          : [];
        const unavailable: UnavailablePeriod[] = (
          roomData.unavailable ||
          roomData.Unavailable ||
          []
        ).map((u: UnavailablePeriod & { id?: number }) => ({
          id: u.id,
          start_date: format(new Date(u.start_date as string), "yyyy-MM-dd"),
          end_date: format(new Date(u.end_date as string), "yyyy-MM-dd"),
        }));
        const seasonal_prices: SeasonalPrice[] = (
          roomData.seasonal_prices || []
        ).map((sp: SeasonalPrice) => ({
          ...sp,
          start_date: format(new Date(sp.start_date as string), "yyyy-MM-dd"),
          end_date: format(new Date(sp.end_date as string), "yyyy-MM-dd"),
        }));
        setInitialValues({
          rooms: [
            {
              ...roomData,
              imagePreviews,
              unavailable,
              seasonal_prices,
              images: [],
              name: roomData.name || "",
              stock: roomData.stock || 0,
              price: roomData.price || 0,
              capacity: roomData.capacity || 0,
              size: roomData.size || 0,
              description: roomData.description || "",
              facilities: roomData.facilities || [],
              bed_details: roomData.bed_details || "",
              has_breakfast: roomData.has_breakfast || false,
              breakfast_price: roomData.breakfast_price || 0,
            } as unknown as EditRoom,
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
    }: import("formik").FormikHelpers<EditRoomTypeFormValues>
  ): Promise<void> => {
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
    <EditRoomTypeForm
      initialValues={initialValues}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      availableFacilities={availableFacilities}
    />
  );
}
