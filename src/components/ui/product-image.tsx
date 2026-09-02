"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_SRC = "/product-placeholder.png";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
};

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_SRC);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(FALLBACK_SRC)}
    />
  );
}
