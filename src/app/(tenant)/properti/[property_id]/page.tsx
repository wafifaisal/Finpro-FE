import React from "react";
import CreateRoomType from "@/components/sub/create_roomtype/createRoomType";

interface PageProps {
  params: {
    property_id: number;
  };
}

export default function Page({ params }: PageProps) {
  const property_id = params.property_id;

  return (
    <div className="p-8">
      <CreateRoomType params={{ property_id }} />
    </div>
  );
}
