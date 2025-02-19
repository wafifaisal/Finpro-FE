import EditPropertyForm from "@/components/sub/edit_property/EditPropertyForm";
interface PageProps {
  params: {
    property_id: number;
  };
}

export default function EditPropertyPage({ params }: PageProps) {
  const property_id = params.property_id;

  return (
    <div>
      <EditPropertyForm params={{ property_id }} />
    </div>
  );
}
