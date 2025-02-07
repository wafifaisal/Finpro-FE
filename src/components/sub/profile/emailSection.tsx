import { useSession } from "@/context/useSessionHook";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

export default function ProfilEmail() {
  const [sedangMengeditEmail, setSedangMengeditEmail] = useState(false);
  const { user } = useSession();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const skemaValidasi = Yup.object().shape({
    emailBaru: Yup.string()
      .email("Format email tidak valid")
      .required("Email baru wajib diisi"),
  });

  const tanganiPembaruanEmail = async (
    emailBaru: string,
    { setSubmitting, resetForm }: FormikHelpers<{ emailBaru: string }>
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const respons = await fetch(`${base_url}/users/update-email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: emailBaru }),
      });

      if (respons.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Email Anda telah diperbarui. Silakan periksa email baru untuk verifikasi.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setSedangMengeditEmail(false);
          resetForm();
        });
      } else {
        throw new Error("Gagal memperbarui email");
      }
    } catch (error) {
      console.error("Kesalahan saat memperbarui email:", error);
      Swal.fire({
        title: "Kesalahan!",
        text: "Email baru tidak boleh sama dengan email saat ini",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row items-center justify-between flex-col">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-gray-400" />
          <span className="text-gray-600">{user?.email}</span>
          <FaCheck className="text-green-500" />
        </div>
        {!user?.googleId && (
          <button
            onClick={() => setSedangMengeditEmail(true)}
            className="text-rose-500 hover:text-rose-600 text-sm"
          >
            Ubah Email
          </button>
        )}
      </div>

      {sedangMengeditEmail && (
        <Formik
          initialValues={{ emailBaru: "" }}
          validationSchema={skemaValidasi}
          onSubmit={(values, actions) =>
            tanganiPembaruanEmail(values.emailBaru, actions)
          }
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="email"
                  name="emailBaru"
                  placeholder="Alamat Email Baru"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <ErrorMessage
                  name="emailBaru"
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
                  {isSubmitting ? "Memproses..." : "Perbarui Email"}
                </button>
                <button
                  type="button"
                  onClick={() => setSedangMengeditEmail(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
