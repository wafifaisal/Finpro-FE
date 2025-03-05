import EditRoomType from "@/components/sub/edit_roomtype/EditRoomTypes";

interface PageProps {
  params: {
    property_id: number;
    roomtype_id: number;
  };
}

export default function EditPropertyPage({ params }: PageProps) {
  return (
    <div className="p-8 pb-10 pt-0 md:pb-0 md:pt-12">
      <EditRoomType params={params} />
    </div>
  );
}
