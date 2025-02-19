"use client";

import PropertyCard from "@/components/main/propertycard/propertylist";
import { UserLocation } from "@/types/types";

export const LoadingSkeleton = ({
  userLocation,
}: {
  userLocation: UserLocation;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-2/3 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <PropertyCard
          key={index}
          property={{
            id: index,
            name: "",
            desc: "",
            category: "",
            RoomTypes: [],
            location: {
              address: "",
              city: "",
              country: "",
              latitude: "0",
              longitude: "0",
            },
          }}
          loading={true}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
};
