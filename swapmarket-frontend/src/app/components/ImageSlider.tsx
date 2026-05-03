import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export function ImageSlider({ images, alt }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <img
        src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&h=600&fit=crop"
        alt={alt}
        className="h-full w-full object-cover"
      />
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-full w-full group/slider overflow-hidden">
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="h-full w-full object-cover transition-all duration-500"
      />
      
      {images.length > 1 && (
        <div className="absolute inset-0">
          {/* Navigation zones */}
          <div 
            onClick={prevImage}
            className="absolute left-0 top-0 bottom-0 w-1/4 cursor-w-resize z-10"
          />
          <div 
            onClick={nextImage}
            className="absolute right-0 top-0 bottom-0 w-3/4 cursor-e-resize z-10"
          />

          {/* Elegant Arrows - Always Visible */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Counter Badge - Bottom Middle */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-md z-20">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
