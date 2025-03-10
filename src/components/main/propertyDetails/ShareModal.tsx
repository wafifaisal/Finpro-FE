"use client";

import React from "react";
import { X, Link as LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaLinkedin,
  FaWhatsapp,
  FaInstagramSquare,
} from "react-icons/fa";
import { Property } from "@/types/types";

interface ShareModalProps {
  shareUrl: string;
  shareImage: string;
  shareTitle: string;
  shareDescription: string;
  property: Property;
  handleCopyLink: () => void;
  copyStatus: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  shareUrl,
  shareImage,
  shareTitle,
  shareDescription,
  property,
  handleCopyLink,
  copyStatus,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-2xl shadow-xl relative z-10 w-11/12 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 bg-gray-100 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Bagikan Properti</h2>
        <div className="mb-6 bg-gray-50 p-3 rounded-xl">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={shareImage}
                alt={property.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 line-clamp-1">
                {property.name}
              </h3>
              <div
                className="text-xs text-gray-500 line-clamp-2 mt-1"
                dangerouslySetInnerHTML={{ __html: shareDescription }}
              ></div>
              <div className="flex items-center mt-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3 mr-1" />
                <span>
                  {property.location.city}, {property.location.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">Bagikan melalui:</p>
        <div className="grid grid-cols-5 gap-2 mb-6">
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FaFacebookSquare className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs mt-1">Facebook</span>
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <FaTwitterSquare className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs mt-1">Twitter</span>
          </Link>
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <FaLinkedin className="w-6 h-6 text-blue-700" />
            </div>
            <span className="text-xs mt-1">LinkedIn</span>
          </Link>
          <Link
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareTitle + " " + shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <FaWhatsapp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs mt-1">WhatsApp</span>
          </Link>
          <Link
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
              <FaInstagramSquare className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-xs mt-1">Instagram</span>
          </Link>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Atau salin link:</p>
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
            <div className="flex-1 overflow-hidden">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-4 py-3 text-sm bg-transparent border-none focus:outline-none"
              />
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center"
            >
              {copyStatus ? (
                <span>{copyStatus}</span>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
