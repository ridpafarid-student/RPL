import { useEffect, useMemo, useRef, useState } from 'react';

interface ImageCarouselProps {
  images?: string[];
  alt?: string;
  heightClass?: string;
  roundedClass?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showCounter?: boolean;
  showDots?: boolean;
  objectFitClass?: string;
}

export default function ImageCarousel({
  images = [],
  alt = 'Image',
  heightClass = 'h-52',
  roundedClass = 'rounded-none',
  showThumbnails = false,
  autoPlay = true,
  autoPlayInterval = 3500,
  showCounter = true,
  showDots = true,
  objectFitClass = 'object-cover',
}: ImageCarouselProps) {
  const validImages = useMemo(
    () => images.filter((item) => typeof item === 'string' && item.trim()),
    [images]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const autoPlayRef = useRef<number | null>(null);

  const hasImages = validImages.length > 0;
  const hasMultiple = validImages.length > 1;

  const goToSlide = (index: number) => {
    if (!hasImages) return;
    setCurrentIndex((index + validImages.length) % validImages.length);
  };

  const goToPrev = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.changedTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dist = touchStartX - e.changedTouches[0].clientX;
    if (dist > 50) goToNext();
    else if (dist < -50) goToPrev();
  };

  const handleImageLoad = (index: number) => {
    setLoadedMap((prev) => ({ ...prev, [index]: true }));
  };

  // Reset on image change
  useEffect(() => {
    setCurrentIndex(0);
    setLoadedMap({});
  }, [validImages]);

  // Auto play
  useEffect(() => {
    if (!hasMultiple || !autoPlay || isHovered || isFullscreen) return;

    autoPlayRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, autoPlayInterval, hasMultiple, isHovered, isFullscreen, validImages.length]);

  // Fullscreen keyboard
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  });

  if (!hasImages) {
    return (
      <div className={`flex w-full items-end bg-gradient-to-br from-forest-800 via-forest-800/50 to-forest-900 p-5 ${heightClass} ${roundedClass}`}>
        <div className="rounded-2xl bg-forest-800/50 px-4 py-3 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-500">
            Foto belum tersedia
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`group relative overflow-hidden bg-forest-900 ${heightClass} ${roundedClass}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            width: `${validImages.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / validImages.length)}%)`,
          }}
        >
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="relative block h-full w-full shrink-0 cursor-zoom-in bg-forest-900 text-left"
              style={{ width: `${100 / validImages.length}%` }}
              aria-label={`Buka foto ${index + 1}`}
            >
              {!loadedMap[index] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-forest-800 via-forest-900 to-forest-800" />
              )}
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className={`h-full w-full ${objectFitClass} transition duration-700 group-hover:scale-105`}
                onLoad={() => handleImageLoad(index)}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/1200x800/0A1F14/40916C?text=Foto+tidak+tersedia';
                  handleImageLoad(index);
                }}
              />
            </button>
          ))}
        </div>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              type="button" onClick={goToPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-900/60
                p-2.5 text-forest-300 backdrop-blur-md border border-forest-700/20
                transition-[opacity,background-color,transform] duration-300 ease-out hover:bg-forest-800/80 active:scale-90 opacity-0 group-hover:opacity-100"
              aria-label="Foto sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button" onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-900/60
                p-2.5 text-forest-300 backdrop-blur-md border border-forest-700/20
                transition-[opacity,background-color,transform] duration-300 ease-out hover:bg-forest-800/80 active:scale-90 opacity-0 group-hover:opacity-100"
              aria-label="Foto berikutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && hasMultiple && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-forest-900/50 px-3 py-2 backdrop-blur-sm">
            {validImages.map((_, i) => (
              <button
                key={i} type="button" onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'w-5 bg-forest-400' : 'w-1.5 bg-forest-600/60'
                }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {showCounter && hasMultiple && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-forest-900/50 px-3 py-1 text-xs font-mono font-semibold text-forest-300 backdrop-blur-sm">
            {currentIndex + 1}/{validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={`thumb-${index}`} type="button" onClick={() => goToSlide(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-[border-color,opacity,box-shadow] duration-300 ease-out ${
                currentIndex === index
                  ? 'border-forest-500 shadow-md shadow-forest-500/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image} alt={`${alt} thumbnail ${index + 1}`}
                loading="lazy" className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/95 backdrop-blur-sm p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button" onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 rounded-full bg-forest-800/50 p-3 text-forest-300 backdrop-blur transition-[background-color,transform] duration-300 ease-out hover:bg-forest-700/50 hover:scale-110 active:scale-90"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {hasMultiple && (
            <>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-forest-800/50 p-3 text-forest-300 backdrop-blur transition-[background-color,transform] duration-300 ease-out hover:bg-forest-700/50 active:scale-90"
                aria-label="Sebelumnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-forest-800/50 p-3 text-forest-300 backdrop-blur transition-[background-color,transform] duration-300 ease-out hover:bg-forest-700/50 active:scale-90"
                aria-label="Berikutnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={validImages[currentIndex]} alt={`${alt} ${currentIndex + 1}`}
              className="max-h-[82vh] w-full rounded-3xl object-contain"
            />
            <div className="mt-4 flex items-center justify-center gap-2">
              {validImages.map((_, i) => (
                <button key={i} type="button" onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ease-out ${currentIndex === i ? 'w-6 bg-forest-300' : 'w-2 bg-forest-600'}`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
