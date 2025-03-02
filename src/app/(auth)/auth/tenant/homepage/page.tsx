"use client";

import React, { useEffect } from "react";
import HeroSection from "@/components/sub/tenant_login/HeroSection";
import JoinCommunitySection from "@/components/sub/tenant_login/JoinCommunitySection";
import BenefitsSection from "@/components/sub/tenant_login/BenefitsSection";

const TenantHomesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white overflow-hidden pt-0 md:pt-24">
      <HeroSection />
      <JoinCommunitySection />
      <BenefitsSection />
    </div>
  );
};

export default TenantHomesPage;
