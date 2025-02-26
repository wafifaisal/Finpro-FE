"use client";

import PropertyForm from "@/components/sub/create_property/propertyForm";
import withGuard from "@/hoc/pageGuard";

function CreatePropertyPage() {
  return (
    <div>
      <PropertyForm />
    </div>
  );
}

export default withGuard(CreatePropertyPage, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
