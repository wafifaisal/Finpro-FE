import { useSession } from "@/context/useSessionHook";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function ProfileEmail() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const { user } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${base_url}/users/update-email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Your email has been updated. Please check your new email for verification.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsEditingEmail(false);
          setNewEmail("");
        });
      } else {
        throw new Error("Failed to update email");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "New email cannot be the same as the current email",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row items-center justify-between flex-col">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-gray-400" />
          <span className="text-gray-600">{user?.email}</span>
          {user?.isVerify ? (
            <FaCheck className="text-green-500" />
          ) : (
            <button className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full hover:bg-yellow-200 transition-colors">
              Resend Verification Email
            </button>
          )}
        </div>
        <button
          onClick={() => setIsEditingEmail(true)}
          className="text-rose-500 hover:text-rose-600 text-sm"
        >
          Change Email
        </button>
      </div>

      {isEditingEmail && (
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email Address"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Update Email
            </button>
            <button
              type="button"
              onClick={() => setIsEditingEmail(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
