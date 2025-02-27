import Image from "next/image";

export const slides = [
  {
    image: "/3.png",
    title: "Temukan Penginapan Impianmu di Setiap Sudut Kota",
    buttonText: "Eksplor Sekarang",
    buttonLink: "/property/search-result",
  },
  {
    image: "/1.png",
    title: "Bergabunglah dalam Komunitas Pecinta Perjalanan Berkualitas",
    buttonText: "Buat Akun",
    buttonLink: "/auth/user/register",
  },
  {
    image: "/2.png",
    title: "Tingkatkan Bisnis Properti dengan Sistem Manajemen Modern",
    buttonText: "Bergabung Bisnis",
    buttonLink: "/auth/tenant/register",
  },
  {
    image: "/4.png",
    title: (
      <div className="flex items-center text-center flex-wrap w-full sm:w-[800px]">
        <span className="ml-2 md:ml-12 mr-2">Kenali Lebih Jauh</span>
        <Image
          src="/nginepin-logo.png"
          alt="NGINEPIN"
          width={100}
          height={100}
          className="mx-auto md:mx-0"
        />
      </div>
    ),
    buttonText: "Pelajari Lebih Lanjut",
    buttonLink: "/about",
  },
  {
    image: "/nginepin-logo.png",
    title: "",
  },
];
