"use client";

import PropertyForm from "@/components/sub/create_property/propertyForm";
import withGuard from "@/hoc/pageGuard";

function CreatePropertyPage() {
  return (
    <div className="pb-10 pt-0 md:pb-0 md:pt-20">
      <PropertyForm />
    </div>
  );
}

export default withGuard(CreatePropertyPage, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
