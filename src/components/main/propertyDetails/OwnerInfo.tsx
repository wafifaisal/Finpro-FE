"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Tenant } from "@/types/types";
import { Star, Shield, Home, MessageCircle, CheckCircle } from "lucide-react";

interface OwnerInfoProps {
  tenant: Tenant;
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({ tenant }) => {
  const { email, createdAt, avatar, name } = tenant;
  const joinYear = new Date(createdAt).getFullYear();
  const [copied, setCopied] = useState(false);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(0);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    async function fetchPropertyCount() {
      try {
        const res = await fetch(
          `${base_url}/property/tenant/${tenant.id}/count-properties`
        );
        if (!res.ok) {
          throw new Error("Gagal mengambil properti tenant");
        }
        const data = await res.json();
        setPropertyCount(data.totalProperties);
      } catch (err) {
        console.error(err);
      }
    }
    if (tenant.id) fetchPropertyCount();
  }, [tenant.id, base_url]);

  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const res = await fetch(
          `${base_url}/tenant/count-reviews/${tenant.id}`
        );
        if (!res.ok) {
          throw new Error("Gagal mengambil data review tenant");
        }
        const data = await res.json();
        setTotalReviews(data.totalReviews);
        setAvgRating(data.avgRating);
      } catch (err) {
        console.error(err);
      }
    }
    if (tenant.id) fetchReviewStats();
  }, [tenant.id, base_url]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={avatar}
                alt={name}
                width={64}
                height={64}
                className="rounded-full object-cover ring-2 ring-offset-2 ring-gray-100"
              />
              <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Tenant
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Ditenant oleh {name}</h2>
              <p className="text-gray-500 text-sm">
                Bergabung pada tahun {joinYear}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg border border-gray-300 font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              "Salin Email Tenant"
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-rose-500" />
            <div>
              <p className="font-medium">{avgRating.toFixed(1)} rating</p>
              <p className="text-sm text-gray-500">
                Dari {totalReviews} ulasan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-500" />
            <div>
              <p className="font-medium">Identitas Terverifikasi</p>
              <p className="text-sm text-gray-500">Tenant Aman</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="w-4 h-4" />
            <span>{propertyCount} properti terdaftar</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>Biasanya merespon dalam satu jam</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
