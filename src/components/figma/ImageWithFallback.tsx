"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  fallback?: string;
}

export function ImageWithFallback({ 
  src, 
  alt,
  fallback = "/placeholder.svg",
  fill,
  width,
  height,
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should use fill or explicit dimensions
  const useFill = fill !== undefined ? fill : (!width && !height);

  return (
    <>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill={useFill}
        width={useFill ? undefined : (width || 800)}
        height={useFill ? undefined : (height || 600)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        className={`${props.className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </>
  );
}
