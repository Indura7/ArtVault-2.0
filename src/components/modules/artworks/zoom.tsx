"use client"
import { useState,MouseEvent} from "react";
import Image from "next/image";

interface ZoomPreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}


export default function Zoom({
    src,
    alt,
    width=800,
    height=1200,
}: ZoomPreviewProps){

    const [position, setPosition] = useState({ x: 50, y: 50 });
const [isHovered, setIsHovered] = useState(false);

const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  setPosition({ x, y });
};

return(
<div
  className="relative overflow-hidden rounded-xl cursor-zoom-in border border-gray-300 shadow-md"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onMouseMove={handleMouseMove}
>

<Image
  src={src}
  alt={alt}

  width={width}
  height={height}
  priority
  className="w-full h-auto block transition-transform duration-150 ease-out"
  style={{
    transformOrigin: `${position.x}% ${position.y}%`,
    transform: isHovered ? "scale(2.5)" : "scale(1)",
  }}
/>
</div>
);
}