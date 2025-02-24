export async function resetPasswordApi(
  token: string,
  newPassword: string,
  confirmPassword: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/resetPassword/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: decodeURIComponent(token),
        newPassword,
        confirmPassword,
      }),
    }
  );

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Password reset failed!");
  return result;
}
