import * as Yup from "yup";

export const emailSchema = Yup.object({
  email: Yup.string()
    .email("Email tidak valid")
    .required("Email wajib diisi")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Format email tidak valid"
    ),
});

export default emailSchema;
