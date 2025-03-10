import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import { FaCalendarCheck, FaCalendarXmark } from "react-icons/fa6";
import { getPropertyAvailability } from "@/libs/salesReport";
import { IAvailabilityRecord } from "@/types/salesReport";

interface PropertyAvailabilityCalendarProps {
  tenantId: string;
}

const PropertyAvailabilityCalendar = ({
  tenantId,
}: PropertyAvailabilityCalendarProps) => {
  const [availabilityData, setAvailabilityData] = useState<
    IAvailabilityRecord[]
  >([]);

  const fetchAvailability = async () => {
    try {
      const data = await getPropertyAvailability(tenantId);
      setAvailabilityData(data);
    } catch (error) {
      console.error("Error fetching property availability:", error);
    }
  };

  useEffect(() => {
    if (tenantId) fetchAvailability();
  }, [tenantId]);

  // Customize each calendar tile to display available and booked room numbers.
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateKey = dayjs(date).format("YYYY-MM-DD");
      const record = availabilityData.find((r) => r.date === dateKey);
      const available = record ? record.available : 0;
      const booked = record ? record.booked : 0;
      return (
        <div className="mt-1 text-center">
          <div className="text-xs font-semibold">
            <div className="text-gray-500 border-[1px]">{available}</div>
            <div className="text-rose-500 border-[1px]">{booked}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col container">
      <h2 className="font-bold text-xl text-gray-800 mb-4">
        Ketersediaan Properti
      </h2>
      <div className="flex gap-6">
        <Calendar tileContent={tileContent} className="react-calendar" />
        <div className="flex flex-col mt-4">
          <div className="flex gap-2 mb-2 text-gray-500">
            <FaCalendarCheck className="text-xl" />
            <p>Kamar Tersedia</p>
          </div>
          <div className="flex gap-2 text-rose-500">
            <FaCalendarXmark className="text-xl" />
            <p>Jumlah Reservasi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAvailabilityCalendar;
