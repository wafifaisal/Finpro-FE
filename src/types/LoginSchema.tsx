import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username atau Email harus diisi"),
  password: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter ")
    .required("Password harus diisi"),
});
