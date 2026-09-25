"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
{/* dask boad in passage */} 
  return (
    <div className="p-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="font-extrabold text-gradient text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finance <br /> With Intelligence
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get the best financial insights and make informed decisions with our AI-powered financial management tools.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
       <div ref={imageRef} className="hero-image transition-all duration-500">
        <Image
         src="/banner.png"   
         alt="banner"
         width={1200}
         height={400}
         className="rounded-lg shadow-2xl border mx-auto"
         priority
         />
         </div>
         </div>
         </div>
  );
};

export default HeroSection;
