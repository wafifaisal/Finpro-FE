import HeroSection from "@/components/main/hero/heroSection";
import PropertyList from "@/components/main/propertycard/propertylist";
import Image from "next/image";

const HomePage = () => {
  const slides = [
    {
      image: "/3.png",
      title: "Temukan Penginapan",
    },
    { image: "/1.png", title: "Untuk Pengalaman" },
    { image: "/2.png", title: "Proses Check-in Aman" },
    {
      image: "/4.png",
      title: (
        <div className="flex items-center text-center flex-wrap w-full sm:w-[800px]">
          <span className=" ml-2 md:ml-12 mr-2">Bersama Kami</span>
          <Image
            src="/nginepin-logo.png"
            alt="NGINEPIN"
            width={100}
            height={100}
            className="mx-auto md:mx-0"
          />
        </div>
      ),
    },
    {
      image: "/nginepin-logo.png",
      title: "",
    },
  ];

  return (
    <div className="">
      <HeroSection slides={slides} />
      <div className="pt-48">
        <PropertyList />
      </div>
    </div>
  );
};

export default HomePage;
