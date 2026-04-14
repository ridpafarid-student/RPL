import { useEffect, useMemo, useRef, useState } from 'react';

function ImageCarousel({
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
}) {
  const validImages = useMemo(
    () => images.filter((item) => typeof item === 'string' && item.trim()),
    [images]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const autoPlayRef = useRef(null);

  const hasImages = validImages.length > 0;
  const hasMultipleImages = validImages.length > 1;

  const goToSlide = (index) => {
    if (!hasImages) return;
    const normalizedIndex =
      (index + validImages.length) % validImages.length;
    setCurrentIndex(normalizedIndex);
  };

  const goToPrev = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.changedTouches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;

    if (distance > 50) {
      goToNext();
    } else if (distance < -50) {
      goToPrev();
    }
  };

  const handleImageLoad = (index) => {
    setLoadedMap((current) => ({
      ...current,
      [index]: true,
    }));
  };

  useEffect(() => {
    setCurrentIndex(0);
    setLoadedMap({});
  }, [validImages]);

  useEffect(() => {
    if (!hasMultipleImages || !autoPlay || isHovered || isFullscreenOpen) {
      return undefined;
    }

    autoPlayRef.current = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % validImages.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current);
      }
    };
  }, [
    autoPlay,
    autoPlayInterval,
    hasMultipleImages,
    isHovered,
    isFullscreenOpen,
    validImages.length,
  ]);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreenOpen(false);
      }

      if (event.key === 'ArrowLeft') {
        goToPrev();
      }

      if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen, currentIndex]);

  if (!hasImages) {
    return (
      <div
        className={`flex w-full items-end bg-gradient-to-br from-emerald-200 via-teal-100 to-cyan-100 p-5 ${heightClass} ${roundedClass}`}
      >
        <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            Foto belum tersedia
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`group relative overflow-hidden bg-slate-100 ${heightClass} ${roundedClass}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
              onClick={() => setIsFullscreenOpen(true)}
              className="relative block h-full w-full shrink-0 cursor-zoom-in bg-slate-100 text-left"
              style={{ width: `${100 / validImages.length}%` }}
              aria-label={`Buka foto ${index + 1} dalam tampilan penuh`}
            >
              {!loadedMap[index] ? (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
              ) : null}

              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                loading="lazy"
                className={`h-full w-full ${objectFitClass} transition duration-500 group-hover:scale-[1.03]`}
                onLoad={() => handleImageLoad(index)}
                onError={(event) => {
                  event.currentTarget.src =
                    'https://placehold.co/1200x800/e2e8f0/64748b?text=Foto+tidak+tersedia';
                  handleImageLoad(index);
                }}
              />
            </button>
          ))}
        </div>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
              aria-label="Foto sebelumnya"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
              aria-label="Foto berikutnya"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        ) : null}

        {showDots && hasMultipleImages ? (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
            {validImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  currentIndex === index ? 'w-6 bg-white' : 'bg-white/45'
                }`}
                aria-label={`Lihat foto ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        {showCounter && hasMultipleImages ? (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {currentIndex + 1} / {validImages.length}
          </div>
        ) : null}
      </div>

      {showThumbnails && hasMultipleImages ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <button
              key={`${image}-thumb-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                currentIndex === index
                  ? 'scale-[1.02] border-emerald-500 shadow-md'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              {!loadedMap[`thumb-${index}`] ? (
                <div className="absolute inset-0 animate-pulse bg-slate-200" />
              ) : null}

              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                onLoad={() =>
                  setLoadedMap((current) => ({
                    ...current,
                    [`thumb-${index}`]: true,
                  }))
                }
                onError={(event) => {
                  event.currentTarget.src =
                    'https://placehold.co/300x200/e2e8f0/64748b?text=Foto';
                  setLoadedMap((current) => ({
                    ...current,
                    [`thumb-${index}`]: true,
                  }));
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {isFullscreenOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsFullscreenOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Tutup fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Foto sebelumnya"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Foto berikutnya"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className="w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={validImages[currentIndex]}
              alt={`${alt} fullscreen ${currentIndex + 1}`}
              className="max-h-[82vh] w-full rounded-[2rem] object-contain shadow-2xl"
              onError={(event) => {
                event.currentTarget.src =
                  'https://placehold.co/1200x800/e2e8f0/64748b?text=Foto+tidak+tersedia';
              }}
            />

            <div className="mt-4 flex flex-col items-center justify-center gap-3">
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Gunakan ← → untuk pindah foto, ESC untuk menutup
              </div>

              <div className="flex items-center gap-2">
                {validImages.map((_, index) => (
                  <button
                    key={`fullscreen-dot-${index}`}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      currentIndex === index ? 'w-6 bg-white' : 'w-2.5 bg-white/40'
                    }`}
                    aria-label={`Pilih foto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ImageCarousel;