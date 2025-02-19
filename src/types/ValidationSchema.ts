import * as Yup from "yup";

const validationSchema = Yup.object({
  rooms: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Nama kamar wajib diisi"),
      stock: Yup.number()
        .typeError("Jumlah kamar harus berupa angka")
        .required("Jumlah kamar wajib diisi")
        .min(1, "Jumlah kamar minimal 1"),
      price: Yup.number()
        .typeError("Harga harus berupa angka")
        .required("Harga wajib diisi")
        .min(0, "Harga minimal 0"),
      capacity: Yup.number()
        .typeError("Kapasitas tamu harus berupa angka")
        .required("Kapasitas tamu wajib diisi")
        .min(1, "Kapasitas minimal 1"),
      bed_details: Yup.string()
        .required("Detail tempat tidur wajib diisi")
        .test(
          "bed-details-format",
          "Detail harus mencakup jumlah dan tipe kasur (misal: '1 tempat tidur King')",
          (value) => {
            if (!value) return false;
            const regex = /\d+\s*tempat tidur\s+\w+/i;
            return regex.test(value);
          }
        ),
      has_breakfast: Yup.boolean(),
      breakfast_price: Yup.number()
        .typeError("Harga sarapan harus berupa angka")
        .when("has_breakfast", {
          is: true,
          then: (schema: Yup.NumberSchema<number | undefined>) =>
            schema
              .required("Harga sarapan wajib diisi jika sarapan disediakan")
              .min(0, "Harga minimal 0"),
          otherwise: (schema: Yup.NumberSchema<number | undefined>) =>
            schema.notRequired(),
        }),
      images: Yup.array()
        .of(Yup.mixed().required("File wajib diunggah"))
        .max(10, "Maksimal 10 foto diizinkan"),
      facilities: Yup.array().of(Yup.string()),
      seasonal_prices: Yup.array().of(
        Yup.object({
          price: Yup.number()
            .typeError("Harga harus berupa angka")
            .required("Harga wajib diisi")
            .min(0, "Harga minimal 0"),
          start_date: Yup.date().required("Tanggal mulai wajib diisi"),
          end_date: Yup.date()
            .required("Tanggal akhir wajib diisi")
            .min(
              Yup.ref("start_date"),
              "Tanggal akhir harus setelah tanggal mulai"
            ),
          apply_weekend: Yup.boolean(),
          apply_holiday: Yup.boolean(),
        })
      ),
      unavailable: Yup.array().of(
        Yup.object({
          start_date: Yup.date().required("Tanggal mulai wajib diisi"),
          end_date: Yup.date()
            .required("Tanggal akhir wajib diisi")
            .min(
              Yup.ref("start_date"),
              "Tanggal akhir harus setelah tanggal mulai"
            ),
        })
      ),
    })
  ),
});

export default validationSchema;
