const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export interface FetchedProperty {
  RoomTypes?: Array<{
    price: number;
  }>;
}

export const fetchPriceRange = async (): Promise<{
  minPrice: number;
  maxPrice: number;
}> => {
  try {
    const res = await fetch(`${base_url}/property`);
    if (!res.ok) {
      throw new Error("Gagal mengambil properti");
    }
    const data = await res.json();
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    (data.result as FetchedProperty[]).forEach((property) => {
      if (property.RoomTypes && Array.isArray(property.RoomTypes)) {
        property.RoomTypes.forEach((room) => {
          if (room.price < minPrice) minPrice = room.price;
          if (room.price > maxPrice) maxPrice = room.price;
        });
      }
    });
    return {
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 1000 : maxPrice,
    };
  } catch (error) {
    console.error("Error mengambil properti:", error);
    return { minPrice: 0, maxPrice: 1000 };
  }
};
