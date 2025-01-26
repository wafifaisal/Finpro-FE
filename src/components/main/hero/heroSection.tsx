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
import SwiperCore from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  slides: { image: string; title: React.ReactNode }[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  return (
    <div className="relative top-20 bg-gradient-to-b from-purple-100 to-blue-300 rounded-3xl max-w-4xl md:max-w-5xl sm:max-w-full mx-auto shadow-lg overflow-hidden pb-4 flex justify-center items-center">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation, Keyboard]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        loop={true}
        pagination={{
          clickable: true,
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        keyboard={{ enabled: true }}
        className="relative w-full max-w-[400px] h-[400px] rounded-3xl"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative flex justify-center items-center text-center"
          >
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl text-center"></div>
            <h1
              className={`text-3xl sm:text-3xl md:text-3xl font-bold text-white mt-4 transition-all duration-1000 pb-8 md:pb-2 md:whitespace-nowrap
    ${
      activeIndex === index
        ? "translate-y-0 opacity-100"
        : "translate-y-10 opacity-0"
    } 
    `}
            >
              {slide.title}
            </h1>
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              width={800}
              height={600}
              className={`w-full max-w-[600px] sm:max-w-[400px] md:max-w-[500px] h-auto object-contain rounded-3xl transition-opacity duration-700 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {activeIndex === slides.length - 1 && (
        <div className="absolute bottom-4 w-full py-2 overflow-hidden ">
          <span className="text-2xl md:text-3xl flex font-bold text-white items-center text-center justify-center pb-5 md:pb-0 pl-0 md:pl-20 ">
            Dipercayai Oleh :
          </span>
          <div className="whitespace-nowrap animate-marquee pb-16">
            <div className="inline-block mr-10">
              <Image
                src="/hotel1.png"
                alt="Logo 1"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
            <div className="inline-block mr-10">
              <Image
                src="/hotel2.png"
                alt="Logo 2"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
            <div className="inline-block mr-10">
              <Image
                src="/hotel3.png"
                alt="Logo 3"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
            <div className="inline-block mr-10">
              <Image
                src="/hotel4.png"
                alt="Logo 4"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
            <div className="inline-block mr-10">
              <Image
                src="/hotel5.png"
                alt="Logo 5"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
            <div className="inline-block mr-10">
              <Image
                src="/hotel6.png"
                alt="Logo 6"
                width={100}
                height={100}
                className="inline-block"
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-1/2 -translate-y-1/2 flex w-full justify-between px-4 z-20">
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
    </div>
  );
};

export default HeroSection;
