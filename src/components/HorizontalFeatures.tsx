import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-setup';
import { Trees, Sparkles, Map, CloudRain, ArrowRight } from 'lucide-react';

interface FeatureItem {
  icon: React.ComponentType<any>;
  eyebrow: string;
  title: string;
  description: string;
  glowColor: string;
}

const features: FeatureItem[] = [
  {
    icon: Trees,
    eyebrow: 'Alam Sejuk',
    title: 'Kota dengan udara yang menyegarkan',
    description:
      'Bogor terkenal dengan udara pegunungan yang sejuk, ruang hijau yang luas, serta keindahan wisata alam yang sangat cocok untuk melepas penat.',
    glowColor: 'rgba(82, 183, 136, 0.15)', // Green glow
  },
  {
    icon: Sparkles,
    eyebrow: 'Wisata Keluarga',
    title: 'Dari kebun raya hingga waterpark',
    description:
      'Taman bermain modern, kebun binatang safari, hingga kebun raya tertua — Bogor menawarkan kebahagiaan lengkap untuk seluruh anggota keluarga.',
    glowColor: 'rgba(212, 168, 67, 0.15)', // Gold glow
  },
  {
    icon: Map,
    eyebrow: 'Mudah Dijangkau',
    title: 'Sempurna untuk weekend trip',
    description:
      'Aksesibilitas yang mudah dijangkau dengan commuter line maupun tol, menjadikannya pilihan destinasi liburan singkat akhir pekan terfavorit.',
    glowColor: 'rgba(56, 189, 248, 0.15)', // Sky blue glow
  },
  {
    icon: CloudRain,
    eyebrow: 'Kota Hujan',
    title: 'Suasana yang tak ada duanya',
    description:
      'Rintik gerimis khas Bogor menciptakan atmosfer tenang, sejuk, dan romantis yang membedakan kota ini dengan daerah wisata lainnya di Indonesia.',
    glowColor: 'rgba(244, 63, 94, 0.15)', // Rose glow
  },
];

export default function HorizontalFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      const getScrollDistance = () => {
        return trackRef.current!.scrollWidth - window.innerWidth;
      };

      // Pin the section and translate the track horizontally over the entire container height
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: true,
          scrub: 1, // Smooth scrub easing
          invalidateOnRefresh: true,
        },
      });

      // Animate card content entry slightly as they scroll in
      const cards = trackRef.current.querySelectorAll('.feature-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card.querySelectorAll('.card-content-el'),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'left right-=80',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-gradient-to-b from-forest-950 to-forest-900/20">
        <div
          ref={trackRef}
          className="flex gap-8 px-12 md:px-24 items-center flex-nowrap will-change-transform"
        >
          {/* Header Panel */}
          <div className="w-[300px] md:w-[450px] shrink-0 pr-8 md:pr-16 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-forest-500">
              Kenapa Bogor?
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-black text-forest-50 leading-[1.1] tracking-tight">
              Alasan Bogor jadi destinasi terfavorit
            </h2>
            <p className="mt-4 text-sm text-forest-400 leading-relaxed">
              Keindahan alam, akses yang dekat, serta kekayaan tempat rekreasi menjadikannya magnet liburan.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-gold-500 tracking-wider uppercase animate-pulse">
              <span>Scroll untuk melihat</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Cards Panels */}
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.eyebrow}
                className="feature-card w-[320px] sm:w-[380px] h-[440px] shrink-0 rounded-[2.5rem] border border-forest-800/20 bg-forest-900/15 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-forest-700/40 hover:bg-forest-900/25"
              >
                {/* Glow Backdrop Accent */}
                <div
                  className="absolute -top-20 -right-20 w-52 h-52 rounded-full blur-[80px] pointer-events-none"
                  style={{ backgroundColor: feat.glowColor }}
                />

                {/* Card Icon */}
                <div className="card-content-el w-14 h-14 rounded-2xl bg-forest-900/60 border border-forest-700/20 flex items-center justify-center text-forest-400 shadow-inner">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Card Content */}
                <div className="space-y-4">
                  <span className="card-content-el block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-forest-500">
                    {feat.eyebrow}
                  </span>
                  <h3 className="card-content-el font-display text-xl sm:text-2xl font-bold text-forest-100 leading-tight">
                    {feat.title}
                  </h3>
                  <p className="card-content-el text-xs sm:text-sm leading-relaxed text-forest-400/80">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Spacer at the end to keep the last card visible before unpinning */}
          <div className="w-[100px] md:w-[300px] shrink-0" />
        </div>
      </div>
    </div>
  );
}
