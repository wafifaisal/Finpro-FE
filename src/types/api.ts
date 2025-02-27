export const countTenantProperties = async (
  tenantId: string,
  baseUrl: string
): Promise<number> => {
  try {
    const res = await fetch(`${baseUrl}/tenant/${tenantId}/properties`);
    if (!res.ok) {
      throw new Error("Gagal mengambil properti tenant");
    }
    const tenantProperties = await res.json();
    return tenantProperties.length;
  } catch (err) {
    console.error(err);
    return 0;
  }
};
