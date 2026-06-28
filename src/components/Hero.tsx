import { useRef, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-setup';

/* ─── Stats Counter Helper Component ────────────────────── */
function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        delay: 0.8, // start after title reveal
        ease: 'power3.out',
        onUpdate: () => {
          setCount(obj.val);
        },
      });
    },
    { dependencies: [value], scope: elementRef }
  );

  return <span ref={elementRef}>{count.toFixed(decimals)}{suffix}</span>;
}



/* ─── Rain Particle Canvas ────────────────────────────── */
function useRainEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const drops: Array<{ x: number; y: number; speed: number; length: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize rain drops
    for (let i = 0; i < 80; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 2 + Math.random() * 4,
        length: 15 + Math.random() * 25,
        opacity: 0.08 + Math.random() * 0.15,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const drop of drops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 0.5, drop.y + drop.length);
        ctx.strokeStyle = `rgba(149, 213, 178, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

/* ─── Hero Component ──────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useRainEffect(canvasRef);

  // Parallax + entrance + exit animations
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Parallax on the background image
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Cinematic exit fade-out + slide-up on scroll down
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        },
      });

      // Title character reveal
      const chars = titleRef.current?.querySelectorAll('.hero-char');
      if (chars?.length) {
        gsap.from(chars, {
          y: 80,
          opacity: 0,
          rotateX: -40,
          stagger: 0.04,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.2,
        });
      }

      // Content elements stagger in
      const contentEls = contentRef.current?.querySelectorAll('.hero-animate');
      if (contentEls?.length) {
        gsap.from(contentEls, {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.6,
        });
      }
    },
    { scope: sectionRef }
  );

  // Scroll down handler
  const handleScrollDown = useCallback(() => {
    const globalLenis = (window as any).lenis;
    if (globalLenis) {
      globalLenis.scrollTo(window.innerHeight);
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }, []);

  const titleText = 'BOGORNESIA';

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden flex items-center"
    >
      {/* Background Video with Parallax, refined with filters for high contrast */}
      <video
        ref={imageRef as any}
        className="absolute inset-0 -top-[15%] h-[130%] w-full object-cover pointer-events-none filter brightness-[0.9] contrast-[1.2] saturate-[1.15]"
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark gradient overlays - even vignette and bottom fade for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/20 to-forest-950 z-[1]" />

      {/* Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 shell pt-24 md:pt-28 pb-12 flex flex-col items-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Main Title — centered layout in white */}
          <h1
            ref={titleRef}
            className="font-display text-5xl font-black tracking-tight text-forest-50
              sm:text-7xl lg:text-8xl leading-none perspective-[1000px] text-center"
          >
            {titleText.split('').map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block text-forest-50 will-change-transform"
                style={{ transformOrigin: 'bottom center' }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="hero-animate mt-4 max-w-xl text-center text-base md:text-lg leading-relaxed text-forest-300/80">
            Temukan destinasi wisata terbaik di Bogor. Dari kebun raya legendaris hingga air terjun tersembunyi di kaki gunung.
          </p>

          {/* CTA Buttons */}
          <div className="hero-animate mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/destinations" className="btn-primary text-base px-8 py-4 shadow-[0_0_30px_rgba(82,183,136,0.25)] hover:shadow-[0_0_40px_rgba(82,183,136,0.45)] transition-all">
              Mulai Eksplorasi
            </Link>
            <Link to="/recommendations" className="btn-secondary text-base px-8 py-4 backdrop-blur-md bg-forest-950/20 border border-forest-600/30 hover:bg-forest-900/40 transition-all">
              Cari Rekomendasi
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-animate mt-8 flex flex-wrap justify-center gap-8 border-t border-forest-700/20 pt-6 w-full max-w-2xl">
            <div className="text-center px-4">
              <p className="font-display text-3xl font-bold text-gold-400">
                <Counter value={20} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-forest-500">Destinasi</p>
            </div>
            <div className="text-center px-4">
              <p className="font-display text-3xl font-bold text-gold-400">
                <Counter value={120} suffix="K+" />
              </p>
              <p className="mt-1 text-sm text-forest-500">Ulasan</p>
            </div>
            <div className="text-center px-4">
              <p className="font-display text-3xl font-bold text-gold-400">
                <Counter value={9.4} decimals={1} />
              </p>
              <p className="mt-1 text-sm text-forest-500">Rating Teratas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2
          text-forest-500 transition-[color,transform] duration-300 ease-out hover:text-forest-300 active:scale-90 cursor-pointer
          hidden md:flex"
        aria-label="Scroll ke bawah"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="h-5 w-5 animate-bounce"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
