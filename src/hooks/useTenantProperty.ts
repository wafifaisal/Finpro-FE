// hooks/useTenantProperties.ts
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Property } from "@/types/propertyTypes";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const useTenantProperties = (page: number) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${base_url}/tenant/properties?page=${page}&limit=8`,
        {
          headers: { Authorization: `Bearer ${token || ""}` },
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
    } catch (error: unknown) {
      Swal.fire({
        title: "Kesalahan",
        text: (error as Error).message || "Gagal mengambil properti",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleCreate = () => {
    router.push("/property-tenant/create");
  };

  const handleEdit = (propertyId: number) => {
    router.push(`/property-tenant/edit/${propertyId}`);
  };

  const handleDelete = async (propertyId: number) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Properti ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${base_url}/create/property/${propertyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token || ""}` },
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Properti telah dihapus.",
        icon: "success",
      });
      fetchProperties();
    } catch (error: unknown) {
      Swal.fire({
        title: "Kesalahan",
        text: (error as Error).message || "Gagal menghapus properti",
        icon: "error",
      });
    }
  };

  const handleEditRoomType = (propertyId: number, roomTypeId: number) => {
    router.push(`/property-tenant/edit-room/${propertyId}/${roomTypeId}`);
  };

  const handleDeleteRoomType = async (roomTypeId: number) => {
    const propertyWithRoomType = properties.find(
      (property) =>
        property.RoomTypes &&
        property.RoomTypes.some((room) => room.id === roomTypeId)
    );

    if (
      propertyWithRoomType &&
      propertyWithRoomType.RoomTypes &&
      propertyWithRoomType.RoomTypes.length <= 1
    ) {
      Swal.fire({
        title: "Peringatan",
        text: "Tidak dapat menghapus tipe kamar jika hanya tersisa satu, silahkan edit tipe kamar ",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Tipe kamar ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${base_url}/create/roomtype/${roomTypeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token || ""}` },
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Tipe kamar telah dihapus.",
        icon: "success",
      });
      fetchProperties();
    } catch (error: unknown) {
      Swal.fire({
        title: "Kesalahan",
        text: (error as Error).message || "Gagal menghapus tipe kamar",
        icon: "error",
      });
    }
  };

  const handleCreateRoomType = (propertyId: number) => {
    router.push(`/property-tenant/create/${propertyId}`);
  };

  return {
    properties,
    loading,
    totalPages,
    fetchProperties,
    handleCreate,
    handleEdit,
    handleDelete,
    handleEditRoomType,
    handleDeleteRoomType,
    handleCreateRoomType,
  };
};
