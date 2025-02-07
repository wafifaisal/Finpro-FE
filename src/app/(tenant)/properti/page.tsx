"use client";

import dynamic from "next/dynamic";
import React, { useState, ChangeEvent, FormEvent } from "react";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";
import Image from "next/image";

type Position = [number, number];
const DynamicMap = dynamic(
  () => import("@/components/sub/map_createproperty/map"),
  { ssr: false }
);

interface FormData {
  name: string;
  desc: string;
  category: string;
  terms_condition: string;
  address: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

const PropertyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    desc: "",
    category: "",
    terms_condition: "",
    address: "",
    country: "",
    city: "",
    latitude: 0,
    longitude: 0,
  });

  const [position, setPosition] = useState<Position>([-6.9175, 107.6191]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newFiles]);

      // Create preview URLs for new images
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls((prevUrls) => {
      const newUrls = prevUrls.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevUrls[index]); // Clean up the URL
      return newUrls;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      const token = localStorage.getItem("token");

      // Append basic form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Create and append location object
      const locationObj = {
        address: formData.address,
        country: formData.country,
        city: formData.city,
        longitude: position[1],
        latitude: position[0],
      };

      formDataToSend.append("location", JSON.stringify(locationObj));

      // Append files
      images.forEach((image) => {
        formDataToSend.append("files", image);
      });

      const response = await fetch(`${base_url}/create/property`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }

      const data = await response.json();
      alert(`Property created successfully! ID: ${data.property_id}`);

      // Reset form
      setFormData({
        name: "",
        desc: "",
        category: "",
        terms_condition: "",
        address: "",
        country: "",
        city: "",
        latitude: 0,
        longitude: 0,
      });
      setImages([]);
      setImagePreviewUrls([]);
      setPosition([-6.9175, 107.6191]);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        List your property
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900">
            Property Photos
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <div className="text-gray-600">
                <span className="font-semibold text-rose-600">
                  Upload photos
                </span>{" "}
                or drag and drop
              </div>
              <p className="text-sm text-gray-500">Up to 10 photos</p>
            </div>
          </div>

          {/* Image Preview Grid */}
          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    fill
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Property Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter property name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Apartment, House, Villa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Describe your property..."
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pin Location
            </label>
            <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
              <DynamicMap position={position} onPositionChange={setPosition} />
            </div>
            <p className="text-sm text-gray-500">
              Selected coordinates: {position[0].toFixed(6)},{" "}
              {position[1].toFixed(6)}
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Terms & Conditions
          </label>
          <textarea
            name="terms_condition"
            value={formData.terms_condition}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Enter property terms and conditions..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-rose-700 disabled:bg-rose-400 transition-colors"
        >
          {loading ? "Creating your listing..." : "List your property"}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
