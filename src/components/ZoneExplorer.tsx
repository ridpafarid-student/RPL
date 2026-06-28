import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-setup';
import ScrollReveal from './ui/ScrollReveal';

// Import the two separate accurate map images uploaded by the user
import petaKab from '@/assets/images/peta-wilayah-kab-bogor.webp';
import petaKota from '@/assets/images/peta-wilayah-kota-bogor.webp';

export default function ZoneExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // State for interactive map hover
  const [activeZone, setActiveZone] = useState<'kota' | 'kabupaten' | null>(null);

  useGSAP(
    () => {
      if (!mapContainerRef.current) return;

      // Smooth scale-in and fade-in for the centered map on scroll
      gsap.from(mapContainerRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: containerRef }
  );

  const handleZoneRedirect = (zone: 'kota' | 'kabupaten') => {
    navigate(`/destinations?wilayah=${zone}`);
  };

  return (
    <section ref={containerRef} className="py-16 sm:py-24 bg-forest-950/20 relative overflow-hidden z-10">
      <div className="shell flex flex-col items-center">
        
        {/* Header (Centered) */}
        <ScrollReveal>
          <div className="max-w-3xl text-center mb-6 flex flex-col items-center">
            <span className="section-eyebrow">Dua Sisi Pesona</span>
            <h2 className="section-title mt-3">Pembagian Wilayah Bogor</h2>
            <p className="section-copy mt-4 mx-auto">
              Visualisasi pembagian wilayah administratif Kota Bogor dan Kabupaten Bogor.
            </p>
          </div>
        </ScrollReveal>

        {/* Centered Map Container (Larger Scale) */}
        <div 
          ref={mapContainerRef}
          className="flex flex-col items-center w-full max-w-[700px]"
        >
          {/* Centered Map Wrapper (Clean Floating Style, No Border or Card Background) */}
          <div className="relative flex justify-center items-center w-full overflow-hidden">
            
            {/* Glowing Map Backdrop */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[90px] pointer-events-none transition-all duration-750 ease-out
              ${activeZone === 'kota' ? 'bg-forest-50/5' : activeZone === 'kabupaten' ? 'bg-emerald-500/10' : 'bg-forest-500/5'}`} 
            />

            {/* Accurate Image Wrapper with Aspect Ratio (647 width x 386 height) (Enlarged) */}
            <div className="relative w-full aspect-[647/386] max-w-[540px] md:max-w-[620px] flex items-center justify-center select-none transition-all duration-500 hover:scale-[1.01]">
              
              {/* Layer 1: Kabupaten Bogor (Green area with cut-out hole) */}
              <img
                src={petaKab}
                alt="Peta Kabupaten Bogor"
                className={`w-full h-full object-cover rounded-2xl transition-all duration-500 transform-gpu
                  ${activeZone === 'kota' ? 'opacity-45 filter brightness-[0.7] saturate-[0.8]' : ''}
                  ${activeZone === 'kabupaten' ? 'filter drop-shadow-[0_0_25px_rgba(82,183,136,0.4)] brightness-[1.03] saturate-[1.1]' : ''}`}
              />

              {/* Layer 2: Kota Bogor (White Enclave - positioned exactly inside the hole) */}
              <img
                src={petaKota}
                alt="Peta Kota Bogor"
                className={`absolute rounded-lg transition-all duration-500 transform-gpu pointer-events-none
                  ${activeZone === 'kabupaten' ? 'opacity-40 filter brightness-[0.7]' : ''}
                  ${activeZone === 'kota' ? 'filter drop-shadow-[0_0_35px_rgba(255,255,255,0.75)] brightness-[1.1] scale-[1.03]' : ''}`}
                style={{
                  left: '36.50%',
                  top: '29.00%',
                  width: '25.00%',
                  height: '51.20%',
                  zIndex: 20,
                }}
              />

              {/* Layer 3: Interactive SVG Overlay (captures hover & click and highlights regions) */}
              <svg
                viewBox="0 0 647 386"
                className="absolute inset-0 w-full h-full z-30"
              >
                {/* Hotspot 1: Kabupaten Bogor (Green Area) */}
                <path
                  d="M 80,113 C 100,50 130,80 160,60 C 205,40 248,45 281,45 C 324,75 356,45 378,45 C 399,60 432,30 453,50 C 475,75 507,75 529,95 C 561,110 604,130 615,195 C 626,240 594,260 561,260 C 518,260 486,265 453,290 C 410,335 367,320 313,320 C 259,320 194,310 151,325 C 108,340 75,300 65,250 C 54,200 59,150 80,113 Z M 288,172 C 290,165 310,167 325,185 C 340,205 353,230 353,250 C 353,265 340,270 330,270 C 310,270 295,230 288,205 Z"
                  fillRule="evenodd"
                  className="fill-transparent cursor-pointer"
                  onMouseEnter={() => setActiveZone('kabupaten')}
                  onMouseLeave={() => setActiveZone(null)}
                  onClick={() => handleZoneRedirect('kabupaten')}
                />

                {/* Hotspot 2: Kota Bogor (Central Enclave) */}
                <path
                  d="M 288,172 C 290,165 310,167 325,185 C 340,205 353,230 353,250 C 353,265 340,270 330,270 C 310,270 295,230 288,205 Z"
                  className="fill-transparent cursor-pointer"
                  onMouseEnter={() => setActiveZone('kota')}
                  onMouseLeave={() => setActiveZone(null)}
                  onClick={() => handleZoneRedirect('kota')}
                />
              </svg>
            </div>
          </div>

          {/* Clean Centered Legend underneath the map */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-6 text-[10px] font-mono tracking-widest text-forest-400 uppercase select-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-forest-50 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              <span>Kota Bogor (Putih)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(82,183,136,0.4)]" />
              <span>Kabupaten Bogor (Hijau)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
