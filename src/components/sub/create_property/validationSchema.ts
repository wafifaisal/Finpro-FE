import * as Yup from "yup";

export interface PropertyFormValues {
  name: string;
  desc: string;
  category: string;
  terms_condition: string;
  address: string;
  country: string;
  city: string;
  facilities: string[];
  images: File[];
}

export const validationSchema = Yup.object({
  name: Yup.string().required("Nama properti wajib diisi"),
  desc: Yup.string()
    .required("Deskripsi wajib diisi")
    .min(20, "Deskripsi harus terdiri dari minimal 20 karakter"),
  category: Yup.string()
    .oneOf(
      ["Hotel", "Villa", "Apartmen", "Resor", "Guest House"],
      "Kategori harus salah satu dari: Hotel, Villa, Apartmen, Resor, Guest House"
    )
    .required("Kategori wajib diisi"),
  terms_condition: Yup.string().required("Syarat & ketentuan wajib diisi"),
  address: Yup.string().required("Alamat wajib diisi"),
  country: Yup.string().required("Negara wajib diisi"),
  city: Yup.string().required("Kota wajib diisi"),
  facilities: Yup.array()
    .of(Yup.string())
    .min(1, "Pilih setidaknya satu fasilitas"),
  images: Yup.array()
    .of(Yup.mixed().required("File wajib diunggah"))
    .max(10, "Maksimal 10 foto diizinkan"),
});
