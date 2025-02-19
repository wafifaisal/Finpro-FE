"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectFade,
  Autoplay,
  Pagination,
  Navigation,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import SwiperCore from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  title: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroSectionProps {
  slides: Slide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
  const [hoveredCard, setHoveredCard] = useState<boolean>(false);

  const activeSlide = slides[activeIndex];

  return (
    <div
      className="relative top-20 bg-gradient-to-b from-purple-100 to-blue-300 rounded-3xl max-w-4xl md:max-w-5xl sm:max-w-full mx-auto shadow-lg overflow-hidden pb-4 flex justify-center items-center"
      onMouseEnter={() => setHoveredCard(true)}
      onMouseLeave={() => setHoveredCard(false)}
    >
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation, Keyboard]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        loop={true}
        pagination={
          hoveredCard
            ? {
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
              }
            : false
        }
        keyboard={{ enabled: true }}
        className="relative w-full max-w-[400px] h-[400px] rounded-3xl"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative flex flex-col justify-center items-center text-center"
          >
            <h1
              className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4 transition-all duration-1000 pb-8 md:pb-2 
              ${
                activeIndex === index
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {slide.title}
            </h1>
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              width={800}
              height={600}
              priority
              className={`w-full max-w-[600px] sm:max-w-[400px] md:max-w-[500px] h-auto object-contain rounded-3xl transition-opacity duration-700 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Render CTA hanya untuk slide yang bukan slide terakhir */}
      {activeIndex !== slides.length - 1 && activeSlide.buttonText && (
        <div className="absolute bottom-20 left-1/2 transition-all  group duration-500 -translate-x-1/2 z-30">
          <Link href={activeSlide.buttonLink || "#"}>
            <button className="px-6 py-3 transition-transform bg-gradient-to-r from-[#FF9A9E] to-[#FAD0C4] text-white hover:bg-white hover:text-rose-600 rounded-full font-semibold shadow-md hover:shadow-lg  duration-300">
              {activeSlide.buttonText}
            </button>
          </Link>
        </div>
      )}

      {activeIndex === slides.length - 1 && (
        <div className="absolute bottom-4 w-full py-2 overflow-hidden">
          <span className="text-2xl md:text-3xl flex font-bold text-white items-center text-center justify-center pb-5 md:pb-0 pl-0 md:pl-20">
            Dipercayai Oleh :
          </span>
          <div className="whitespace-nowrap animate-marquee pb-16">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="inline-block mr-10">
                <Image
                  src={`/hotel${num}.png`}
                  alt={`Logo ${num}`}
                  width={100}
                  height={100}
                  className="inline-block"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {hoveredCard && (
        <div className="absolute top-1/2 -translate-y-1/2 flex w-full justify-between px-4 z-50">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 sm:w-8 h-6 sm:h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
          >
            <ChevronRight className="w-6 sm:w-8 h-6 sm:h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
