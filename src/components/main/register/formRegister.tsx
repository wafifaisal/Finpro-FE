"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import SocialLogin from "./socialLogin";
import axios from "axios";
import Image from "next/image";

const RegisterForm = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const images = [
    {
      url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738524257/c078a58f-05f8-4165-b473-96ec2166f9e8.png",
      alt: "Nature 1",
    },
    {
      url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738524324/6e9d096a-e07b-4345-bb1a-6ec3eb82b0b1.png",
      alt: "Nature 2",
    },
    {
      url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738524375/2af0b57b-4129-4a71-a648-b9e4915b4075.png",
      alt: "Nature 3",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post(`${base_url_be}/auth/register`, {
        email,
      });
      alert(response.data.message);
      router.push(`/auth/user/verifyUser/${response.data.token}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative w-1/2 hidden md:block">
        <div className="relative h-full overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
                index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={800}
                height={800}
                className="relative my-60 mx-auto w-80 h-auto object-cover"
              />
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Buat Akun</h2>
            <p className="mt-2 text-gray-600">
              Buat akun gratis untuk mengakses property dengan harga termurah!
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukan Email"
              className="w-full py-4 input"
            />
            <button
              onClick={handleEmailSubmit}
              className="relative z-20 flex justify-center w-full py-3 bg-red-500 rounded-2xl text-white"
            >
              <Mail className="mr-2 h-4 w-4" /> Daftar Menggunakan Email
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Atau Lanjutkan Dengan
              </span>
            </div>
          </div>

          <SocialLogin />

          <p className="text-center text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
