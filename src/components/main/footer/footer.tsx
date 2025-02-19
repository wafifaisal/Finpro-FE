"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { GoGlobe } from "react-icons/go";
import Link from "next/link";

export type Property = {
  id: number;
  name: string;
  desc: string;
  category: string;
  click_rate?: number;
  PropertyImages?: { image_url: string }[];
  location: { address: string; city: string; country: string };
};

const Footer = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    fetch(`${base_url_be}/property`)
      .then((response) => response.json())
      .then((data) => {
        // Urutkan properti berdasarkan click_rate secara descending
        const sorted = data.result.sort(
          (a: Property, b: Property) =>
            (b.click_rate || 0) - (a.click_rate || 0)
        );
        // Simpan hanya 9 properti teratas
        setProperties(sorted.slice(0, 9));
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  }, [base_url_be]);

  const footerLinks = {
    Dukungan: [
      "Pusat Bantuan",
      "Opsi Pembatalan",
      "Laporkan masalah lingkungan",
    ],
    Hosting: ["Nginepin rumah Anda", "Hosting dengan bertanggung jawab"],
    Nginepin: ["Berita", "Fitur baru", "Karir", "Investor"],
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 pb-5 border-b border-gray-200">
          <Image
            src="/nginepin-logo.png"
            alt="Logo Nginepin"
            width={400}
            height={400}
            className="h-20 w-auto"
          />
        </div>

        <div className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Inspirasi untuk liburan mendatang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id}>
                <Link
                  href={`/property/${property.id}`}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {property.name}
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      {property.location.city}, {property.location.country}
                    </li>
                  </ul>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <span className="text-sm text-gray-600">
                © 2025 Nginepin, Inc.
              </span>
              <div className="flex space-x-6 text-sm text-gray-600">
                <Link href="#" className="hover:text-gray-900">
                  Privasi
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Syarat dan Ketentuan
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Peta situs
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <GoGlobe className="w-5 h-5" />
                <span className="text-sm">Indonesia (ID)</span>
              </div>
              <div className="flex space-x-4">
                <FaFacebook className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
                <FaXTwitter className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
                <FaInstagram className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
                <FaYoutube className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
