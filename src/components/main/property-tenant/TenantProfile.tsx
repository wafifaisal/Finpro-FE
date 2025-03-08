"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import PropertyCard from "./PropertyCard";
import PaginationControls from "./PaginationControl";
import { useTenantProperties } from "@/hooks/useTenantProperty";
import { Property } from "@/types/propertyTypes";

const TenantProfile: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const {
    properties,
    loading,
    totalPages,
    handleCreate,
    handleEdit,
    handleDelete,
    handleEditRoomType,
    handleDeleteRoomType,
    handleCreateRoomType,
  } = useTenantProperties(page);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pt-36">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-rose-600">Properti Saya</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-md transition-colors duration-300"
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah Baru
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse text-gray-500 text-sm">
            Memuat properti...
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            Belum ada properti
          </h3>
          <p className="text-gray-500 text-xs mb-4">
            Mulailah dengan menambahkan properti pertama Anda
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-md transition-colors duration-300"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Properti
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {properties.map((property: Property) => (
              <PropertyCard
                key={property.id}
                property={property}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleEditRoomType={handleEditRoomType}
                handleDeleteRoomType={handleDeleteRoomType}
                handleCreateRoomType={handleCreateRoomType}
              />
            ))}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default TenantProfile;
