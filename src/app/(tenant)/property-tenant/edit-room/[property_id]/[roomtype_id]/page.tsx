import EditRoomType from "@/components/sub/edit_roomtype/EditRoomTypes";

interface PageProps {
  params: {
    property_id: number;
    roomtype_id: number;
  };
}

export default function EditPropertyPage({ params }: PageProps) {
  return (
    <div>
      <EditRoomType params={params} />
    </div>
  );
}
