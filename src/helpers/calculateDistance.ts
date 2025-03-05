export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: string,
  lon2: string
): number => {
  const lat2Num = parseFloat(lat2);
  const lon2Num = parseFloat(lon2);
  const R = 6371;
  const dLat = ((lat2Num - lat1) * Math.PI) / 180;
  const dLon = ((lon2Num - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2Num * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
