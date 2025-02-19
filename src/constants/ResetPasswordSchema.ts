import * as Yup from "yup";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter")
    .required("Kata Sandi Baru diperlukan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "kata sandi harus cocok")
    .required("Konfirmasi Kata Sandi diperlukan"),
});

export default ResetPasswordSchema;
