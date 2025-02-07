import { useSession } from "@/context/useSessionHook";
import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

// Definisikan tipe nilai form
interface FormValues {
  kataSandiSaatIni: string;
  kataSandiBaru: string;
  konfirmasiKataSandi: string;
}

export default function ProfilKataSandi() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const { user } = useSession();
  const [sedangMengeditPassword, setSedangMengeditPassword] = useState(false);

  // Skema validasi menggunakan Yup
  const skemaValidasi = Yup.object().shape({
    kataSandiSaatIni: Yup.string().required("Kata sandi saat ini wajib diisi"),
    kataSandiBaru: Yup.string()
      .min(8, "Kata sandi baru minimal 8 karakter")
      .required("Kata sandi baru wajib diisi"),
    konfirmasiKataSandi: Yup.string()
      .oneOf([Yup.ref("kataSandiBaru")], "Konfirmasi kata sandi tidak cocok")
      .required("Konfirmasi kata sandi wajib diisi"),
  });

  // Fungsi untuk menangani pembaruan password dengan tipe parameter yang tepat
  const tanganiPembaruanPassword = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const respons = await fetch(`${base_url}/users/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: values.kataSandiSaatIni,
          newPassword: values.kataSandiBaru,
        }),
      });

      if (respons.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Kata sandi Anda telah diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setSedangMengeditPassword(false);
          resetForm();
        });
      } else {
        throw new Error("Gagal memperbarui kata sandi");
      }
    } catch (error) {
      console.error("Kesalahan saat memperbarui kata sandi:", error);
      Swal.fire({
        title: "Kesalahan!",
        text: "Gagal memperbarui kata sandi. Silakan periksa kata sandi saat ini dan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!user?.googleId && (
        <>
          <button
            onClick={() => setSedangMengeditPassword(!sedangMengeditPassword)}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600"
          >
            <RiLockPasswordLine />
            Ubah Kata Sandi
          </button>

          {sedangMengeditPassword && (
            <Formik<FormValues>
              initialValues={{
                kataSandiSaatIni: "",
                kataSandiBaru: "",
                konfirmasiKataSandi: "",
              }}
              validationSchema={skemaValidasi}
              onSubmit={tanganiPembaruanPassword}
            >
              {({ isSubmitting }) => (
                <Form className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="kataSandiSaatIni"
                      placeholder="Kata Sandi Saat Ini"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                    <ErrorMessage
                      name="kataSandiSaatIni"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password Baru
                    </label>
                    <Field
                      type="password"
                      name="kataSandiBaru"
                      placeholder="Kata Sandi Baru"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                    <ErrorMessage
                      name="kataSandiBaru"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Konfirmasi Password
                    </label>
                    <Field
                      type="password"
                      name="konfirmasiKataSandi"
                      placeholder="Konfirmasi Kata Sandi Baru"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                    <ErrorMessage
                      name="konfirmasiKataSandi"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Memproses..." : "Perbarui Kata Sandi"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSedangMengeditPassword(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </div>
  );
}
