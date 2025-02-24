import * as Yup from "yup";

export const verifySchema = Yup.object({
  name: Yup.string().required("Nama diperlukan"),
  password: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter")
    .required("Kata sandi diperlukan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Kata sandi harus cocok")
    .required("Konfirmasi Kata Sandi diperlukan"),
  no_handphone: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Nomor telepon tidak valid")
    .required("Nomor telepon diperlukan"),
});
