"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const banners = [
  { src: "/banners/watch.jpg", href: "/category/fashion-men" },
  { src: "/banners/shoes.jpg", href: "/category/fashion-men" },
  { src: "/banners/Kitchen.jpg", href: "/category/home-kitchen" },
  { src: "/banners/dry-fruits.jpg", href: "/category/health-wellness" },
  { src: "/banners/car.jpg", href: "/category/automotive" },
  { src: "/banners/shoes.jpg", href: "/category/fashion-women" },
  { src: "/banners/watch.jpg", href: "/category/electronics" },
  { src: "/banners/Kitchen.jpg", href: "/category/home-kitchen" },
  { src: "/banners/dry-fruits.jpg", href: "/category/health-wellness" },
  { src: "/banners/car.jpg", href: "/category/automotive" },
  { src: "/banners/shoes.jpg", href: "/category/fashion-men" },
  { src: "/banners/watch.jpg", href: "/category/fashion-women" },
  { src: "/banners/Kitchen.jpg", href: "/category/home-kitchen" },
  { src: "/banners/dry-fruits.jpg", href: "/category/health-wellness" },
  { src: "/banners/car.jpg", href: "/category/automotive" },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="relative group w-full max-w-400 mx-auto py-4 bg-background px-4">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {banners.map((banner, index) => (
            <Link
              href={banner.href}
              key={index}
              className="relative flex-[0_0_auto] w-[150px] h-[230px] sm:w-[240px] sm:h-[370px] rounded-lg overflow-hidden block"
            >
              <Image
                fill
                src={banner.src}
                alt={`Banner ${index + 1}`}
                className="object-cover object-center shadow-md transition-transform duration-300"
                sizes="285px"
                priority={index <= 3}
              />
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-20 bg-background shadow-lg border flex items-center justify-center cursor-pointer text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-r-md z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-8" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-20 bg-background shadow-lg border flex items-center justify-center cursor-pointer text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-l-md z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="size-8" />
      </button>
    </div>
  );
}
