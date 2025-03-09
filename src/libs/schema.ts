import * as Yup from "yup";

export const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .oneOf([1, 2, 3, 4, 5], "You have to set rating for this event")
    .required("You have to set the rate first"),
  description: Yup.string()
    .max(200, "Maksimal 200 karakter")
    .required("Deskripsi tidak boleh kosong"),
});
