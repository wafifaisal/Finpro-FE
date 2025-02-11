export type Position = [number, number];

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export const SAMPLE_FACILITIES: Facility[] = [
  {
    id: "PEMANDANGAN_KOTA",
    name: "Pemandangan Kota",
    icon: "PEMANDANGAN_KOTA",
  },
  {
    id: "PEMANDANGAN_ALAM",
    name: "Pemandangan Alam",
    icon: "PEMANDANGAN_ALAM",
  },
  { id: "AKSES_PANTAI", name: "Akses Pantai", icon: "AKSES_PANTAI" },
  { id: "TAMAN", name: "Taman", icon: "TAMAN" },
  {
    id: "RAMAH_HEWAN_PELIHARAAN",
    name: "Ramah Hewan Peliharaan",
    icon: "RAMAH_HEWAN_PELIHARAAN",
  },
  { id: "RESTAURANT", name: "Restoran", icon: "RESTAURANT" },
  { id: "BAR", name: "Bar", icon: "BAR" },
  { id: "CONFERENCE_ROOM", name: "Ruang Konferensi", icon: "CONFERENCE_ROOM" },
  { id: "PARKIR_GRATIS", name: "Parkir Gratis", icon: "PARKIR_GRATIS" },
  { id: "KOLAM_RENANG", name: "Kolam Renang", icon: "KOLAM_RENANG" },
  { id: "GYM", name: "Gym", icon: "GYM" },
  { id: "SPA", name: "Spa", icon: "SPA" },
  { id: "TAMAN_BERMAIN", name: "Taman Bermain", icon: "TAMAN_BERMAIN" },
  { id: "DEKAT_WISATA", name: "Dekat Wisata", icon: "DEKAT_WISATA" },
  { id: "BUDGET", name: "Budget", icon: "BUDGET" },
  { id: "MEWAH", name: "Mewah", icon: "MEWAH" },
];
