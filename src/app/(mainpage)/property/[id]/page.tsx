"use client";

import { useEffect } from "react";
import Loading from "@/app/loading";
import RoomDetail from "@/components/main/propertyDetails/RoomDetail";
import BookingCard from "@/components/main/propertyDetails/BookingCard/BookingCard";
import PropertyMap from "@/components/main/propertyDetails/PropertyMap";
import PhotoGallery from "@/components/main/propertyDetails/PhotoGallery";
import OwnerInfo from "@/components/main/propertyDetails/OwnerInfo";
import Reviews from "@/components/main/propertyDetails/Reviews";
import PropertyHeader from "@/components/main/propertyDetails/PropertyHeader";
import PropertyDetails from "@/components/main/propertyDetails/PropertyDetail";
import PhotoGrid from "@/components/main/propertyDetails/PhotoGrid";
import usePropertyDetail from "@/hooks/usePropertyDetail";
import { Review as ReviewType } from "@/types/types";

const PropertyDetail = ({ params }: { params: { id: string } }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
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
  } = usePropertyDetail(params.id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (showAllPhotos) {
    return (
      <PhotoGallery
        property={property}
        onClose={() => setShowAllPhotos(false)}
      />
    );
  }

  const aggregatedReviews: ReviewType[] = property.RoomTypes.reduce(
    (acc: ReviewType[], room) => acc.concat(room.Review || []),
    []
  );

  return (
    <div className="pt-20 min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PropertyHeader property={property} roomtypes={property.RoomTypes} />

        <PhotoGrid property={property} setShowAllPhotos={setShowAllPhotos} />
        <PropertyDetails
          property={property}
          showAllFacilities={showAllFacilities}
          setShowAllFacilities={setShowAllFacilities}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {property.RoomTypes.map((room) => {
              const selection = selectedRooms.find(
                (s) => s.roomTypeId === room.id
              );
              return (
                <RoomDetail
                  key={room.id}
                  room={room}
                  selection={selection}
                  onToggleBreakfast={handleToggleBreakfast}
                  onRoomQuantityChange={handleRoomQuantityChange}
                  guests={guests}
                  selectedDate={checkIn || today}
                />
              );
            })}
          </div>
          <BookingCard
            property={property}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            today={today}
            getTomorrow={getTomorrow}
            guests={guests}
            setGuests={setGuests}
            getTotalCapacity={getTotalCapacity}
            selectedRooms={selectedRooms}
            onRoomSelectionChange={handleRoomQuantityChange}
          />
        </div>

        <div className="relative z-10 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Lokasi</h2>
          <PropertyMap property={property} />
        </div>

        <OwnerInfo tenant={property.tenant} />

        <Reviews reviews={aggregatedReviews} />
      </main>
    </div>
  );
};

export default PropertyDetail;
