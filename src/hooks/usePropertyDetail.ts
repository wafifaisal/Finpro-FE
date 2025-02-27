"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Property, RoomSelection, Totals } from "@/types/types";
import { RoomTypeDetail } from "@/types/roomTypes";

const usePropertyDetail = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const today = new Date().toISOString().split("T")[0];

  const getTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${base_url}/property/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil properti");
        const data: Property = await res.json();
        setProperty(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [id, base_url]);

  const handleRoomQuantityChange = (roomTypeId: number, change: number) => {
    setSelectedRooms((prev) => {
      if (change > 0) {
        if (prev.length === 0) {
          return [...prev, { roomTypeId, quantity: 1, addBreakfast: false }];
        }
        const existingRoom = prev.find((r) => r.roomTypeId === roomTypeId);
        if (existingRoom) {
          return prev.map((room) =>
            room.roomTypeId === roomTypeId
              ? { ...room, quantity: room.quantity + change }
              : room
          );
        } else {
          Swal.fire({
            title: "Peringatan",
            text: "Hanya satu tipe kamar dapat dipilih.",
            icon: "error",
          });
          return prev;
        }
      } else if (change < 0) {
        const updated = prev.map((room) => {
          if (room.roomTypeId === roomTypeId) {
            return { ...room, quantity: Math.max(0, room.quantity + change) };
          }
          return room;
        });
        return updated.filter((room) => room.quantity > 0);
      }
      return prev;
    });
  };

  const handleToggleBreakfast = (roomTypeId: number) => {
    setSelectedRooms((prev) =>
      prev.map((selection) => {
        if (selection.roomTypeId === roomTypeId) {
          return { ...selection, addBreakfast: !selection.addBreakfast };
        }
        return selection;
      })
    );
  };

  const calculateRoomPrice = (roomType: RoomTypeDetail, date: Date): number => {
    let price = roomType.price;
    if (roomType.seasonal_prices && roomType.seasonal_prices.length > 0) {
      for (const season of roomType.seasonal_prices) {
        const seasonStart = new Date(season.start_date);
        const seasonEnd = new Date(season.end_date);
        if (date >= seasonStart && date <= seasonEnd) {
          price = Number(season.price);
          break;
        }
      }
    }
    return price;
  };

  const isRoomAvailable = (roomType: RoomTypeDetail): boolean => {
    if (!checkIn || !checkOut) return true;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (roomType.Unavailable && roomType.Unavailable.length > 0) {
      for (const period of roomType.Unavailable) {
        const unavailStart = new Date(period.start_date);
        const unavailEnd = new Date(period.end_date);
        if (start < unavailEnd && end > unavailStart) {
          return false;
        }
      }
    }
    return true;
  };

  const calculateTotal = (): Totals | null => {
    if (!checkIn || !checkOut || !property || selectedRooms.length === 0)
      return null;

    let basePrice = 0;
    let breakfastCost = 0;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    selectedRooms.forEach((selection) => {
      const roomType = property.RoomTypes.find(
        (rt) => rt.id === selection.roomTypeId
      ) as RoomTypeDetail | undefined;
      if (roomType) {
        if (!isRoomAvailable(roomType)) return;
        let roomTotal = 0;
        let currentDate = new Date(startDate);
        while (currentDate < endDate) {
          roomTotal +=
            calculateRoomPrice(roomType, new Date(currentDate)) *
            selection.quantity;
          currentDate = new Date(currentDate.getTime() + 86400000);
        }
        basePrice += roomTotal;
        if (roomType.has_breakfast && selection.addBreakfast) {
          breakfastCost +=
            roomType.breakfast_price * selection.quantity * nights;
        }
      }
    });

    const total = basePrice + breakfastCost;
    return { nights, basePrice, breakfastCost, total };
  };

  const getTotalCapacity = () => {
    if (!property) return 0;
    return selectedRooms.reduce((total, selection) => {
      const roomType = property.RoomTypes.find(
        (rt) => rt.id === selection.roomTypeId
      ) as RoomTypeDetail | undefined;
      return total + (roomType?.capacity || 0) * selection.quantity;
    }, 0);
  };

  const totals = calculateTotal();

  return {
    property,
    showAllPhotos,
    setShowAllPhotos,
    showAllFacilities,
    setShowAllFacilities,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    selectedRooms,
    handleRoomQuantityChange,
    handleToggleBreakfast,
    getTomorrow,
    today,
    getTotalCapacity,
    totals,
    isRoomAvailable,
  };
};

export default usePropertyDetail;
