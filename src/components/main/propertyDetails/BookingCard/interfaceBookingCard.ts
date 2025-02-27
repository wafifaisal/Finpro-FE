import { Property, RoomSelection } from "@/types/types";

export interface BookingCardProps {
  property: Property;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  today: string;
  getTomorrow: (dateString: string) => string;
  guests: number;
  setGuests: (value: number) => void;
  getTotalCapacity: () => number;
  selectedRooms: RoomSelection[];
  onRoomSelectionChange: (roomTypeId: number, change: number) => void;
}
