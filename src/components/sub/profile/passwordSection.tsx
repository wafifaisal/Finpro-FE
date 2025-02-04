import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ProfilePassword() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "New passwords do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${base_url}/users/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Password updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsEditingPassword(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        });
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update password. Please check your current password and try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div>
      <button
        onClick={() => setIsEditingPassword(!isEditingPassword)}
        className="flex items-center gap-2 text-rose-500 hover:text-rose-600"
      >
        <RiLockPasswordLine />
        Change Password
      </button>

      {isEditingPassword && (
        <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            placeholder="Current Password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            required
          />
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            placeholder="New Password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            required
          />
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirm New Password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => setIsEditingPassword(false)}
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
