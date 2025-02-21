import Link from "next/link";

export default function NoTrips() {
  return (
    <div className="h-[375px]">
      <h2 className="text-xl font-bold mb-2">
        Belum ada penginapan yang dipesan...
      </h2>
      <p>Saatnya mulai merencanakan perjalanan baru.</p>
      <Link
        href={`/`}
        className="mt-6 border bg-red-700 text-white px-6 py-2 rounded-md inline-block hover:bg-red-800"
      >
        Cari penginapan
      </Link>
      <div className="border-b-[1px] my-6"></div>
      <p className="text-sm text-gray-800">
        Tidak dapat mencari pesanan Anda?
        <span>
          <Link href={""} className="font-semibold underline">
            {" "}
            Hubungi Pusat Bantuan
          </Link>
        </span>
      </p>
    </div>
  );
}
