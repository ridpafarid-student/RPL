import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-setup';

interface FaqItem {
  id: string;
  tag: string;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: 'perbedaan',
    tag: 'Perbedaan Wilayah',
    question: 'Apa sih bedanya wisata di Kota Bogor dan Kabupaten Bogor?',
    answer: 'Banyak yang masih bingung, nih! Biar gampang, ini bedanya:\n\n• Kota Bogor: Cocok buat city tour, wisata sejarah, dan kulineran tanpa harus jauh dari pusat kota dengan akses transportasi umum yang mudah. Destinasi Andalan: Kebun Raya Bogor, Jalan Suryakencana (pusat street food), Museum Zoologi, dan The Jungle Waterpark.\n\n• Kabupaten Bogor: Surganya hidden gem dan wisata alam pegunungan (Puncak, Sentul, Pamijahan). Cocok buat healing, camping, atau trekking. Destinasi Andalan: Taman Safari, Gunung Pancar, aneka Curug, dan wisata Puncak.'
  },
  {
    id: 'hits',
    tag: 'Tren Wisata 2026',
    question: 'Apa saja tempat wisata terbaru dan lagi hits di Bogor tahun 2026?',
    answer: 'Beberapa destinasi yang lagi viral tahun ini antara lain:\n\n• Snowfield Sentul: Wahana salju indoor kekinian untuk liburan dingin bareng keluarga.\n• Nicole\'s River Park (Puncak): One-stop-recreation kastil Eropa, sungai estetik, & mini zoo.\n• Rustic Market: Spot nongkrong dengan vibes pedesaan kayu ala Eropa klasik.\n• Cimory Dairyland Farm Theme Park: Wahana edukasi peternakan interaktif dan spot instagramable.'
  },
  {
    id: 'healing',
    tag: 'Healing Alam',
    question: 'Kalau mau healing ke alam terbuka, ke mana ya enaknya?',
    answer: 'Kabupaten Bogor adalah juaranya:\n\n• Kawasan Sentul: Trekking ringan ke Goa Agung Garunggang atau berenang di jernihnya Curug Leuwi Lieuk. Untuk camping di bawah pinus, Gunung Pancar adalah pilihan utama.\n• Kawasan Puncak: Menikmati kebun teh Puncak, hamparan bunga di Taman Bunga Nusantara, udara segar di Kebun Raya Cibodas, atau glamping mewah di Highland Park Resort.'
  },
  {
    id: 'ramah-anak',
    tag: 'Ramah Keluarga',
    question: 'Ada tidak rekomendasi wisata yang ramah anak (family-friendly)?',
    answer: 'Bogor adalah destinasi favorit keluarga! Bawa si kecil ke:\n\n• Taman Safari Indonesia (Cisarua): Melihat satwa liar dari dekat langsung dari dalam mobil.\n• Taman Rekreasi & Buah Mekarsari: Berkeliling kebun buah raksasa dan memetik buah langsung dari pohonnya.\n• Jump O Land Trampoline Park: Alternatif seru dalam ruangan (indoor) di Puncak saat hujan.'
  },
  {
    id: 'waktu-terbaik',
    tag: 'Tips Perjalanan',
    question: 'Kapan waktu terbaik untuk liburan ke Bogor?',
    answer: 'Bogor asyik dikunjungi kapan saja, namun ikuti tips ini:\n\n• Hari Biasa (Weekdays): Sangat direkomendasikan jika ingin ke Puncak guna menghindari sistem buka-tutup jalur (One Way / Ganjil-Genap) dan kemacetan akhir pekan.\n• Datang Pagi Hari: Cuaca sering cerah di pagi hari dan hujan saat sore. Sampai di tempat alam sejak pagi untuk udara segar & cahaya terbaik.'
  },
  {
    id: 'mobilitas',
    tag: 'Transportasi',
    question: 'Bagaimana cara terbaik melakukan mobilitas di Bogor?',
    answer: '• Angkutan Umum (KRL & Biskita): Sangat cocok untuk mengitari Kota Bogor. Dari Stasiun Bogor, Anda bisa berjalan kaki atau naik transportasi lokal ke tempat wisata terdekat.\n• Kendaraan Pribadi / Sewa: Pilihan wajib untuk menjelajahi Kabupaten Bogor (Puncak, Sentul, atau Curug di pedalaman) karena jarak antar-wisatanya berjauhan dan rutenya berliku.'
  },
  {
    id: 'kuliner',
    tag: 'Wisata Kuliner',
    question: 'Habis capek jalan-jalan, kuliner apa saja yang wajib dicoba?',
    answer: 'Belum sah ke Bogor kalau perut belum kenyang! Cicipi:\n\n• Makanan Berat: Soto Kuning khas Bogor, Toge Goreng gurih, atau Doclang hangat.\n• Jajanan Suryakencana: Meluncur ke Jalan Suryakencana untuk berburu aneka street food legendaris.\n• Oleh-oleh: Bawa pulang Roti Unyil Venus, Lapis Talas Sangkuriang, Asinan Bogor, atau Makaroni Panggang.'
  }
];

export default function WhyBogor() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  useGSAP(
    () => {
      if (!sectionRef.current || !leftPanelRef.current || !rightPanelRef.current) return;

      const accordionItems = rightPanelRef.current.querySelectorAll('.faq-item-wrapper');

      // 1. Entrance timeline (Smoother, slower scrub range)
      const tlEnter = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',  // Starts animating earlier (almost as soon as top enters)
          end: 'top 25%',    // Finishes later, making the scroll range longer and slower
          scrub: 2.2,        // Higher scrub inertia for ultra-smooth catch-up lag
          invalidateOnRefresh: true,
        }
      });

      tlEnter.fromTo(leftPanelRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      tlEnter.fromTo(accordionItems,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, ease: 'power2.out' },
        0
      );

      // 2. Exit timeline (Smoother, slower exit scrub range)
      const tlExit = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom 45%', // Starts fading out when bottom reaches 45% of viewport
          end: 'bottom 5%',    // Finishes when bottom reaches 5%
          scrub: 2.2,          // Matching scrub inertia
          invalidateOnRefresh: true,
        }
      });

      tlExit.to(leftPanelRef.current,
        { x: -50, opacity: 0, ease: 'power2.inOut' },
        0
      );

      tlExit.to(accordionItems,
        { y: -60, opacity: 0, stagger: 0.1, ease: 'power2.inOut' },
        0
      );
    },
    { scope: sectionRef }
  );

  return (
    <section 
      ref={sectionRef} 
      className="py-16 sm:py-24 bg-forest-950/10 relative overflow-hidden z-10"
    >
      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Header (Left Panel on Desktop, Centered on Mobile - Sticky at the top of viewport) */}
          <div 
            ref={leftPanelRef}
            className="lg:col-span-5 lg:sticky lg:top-24 lg:pt-2 will-change-transform"
          >
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <span className="section-eyebrow">Mengapa Memilih Kota Hujan?</span>
              <h2 className="section-title mt-3">Kenapa Harus Bogor?</h2>
              <p className="section-copy mt-4 max-w-lg lg:max-w-none mx-auto lg:mx-0">
                Dari iklim pegunungan yang sejuk hingga petualangan curug tersembunyi dan warisan kuliner legendaris, temukan alasan mengapa Bogor selalu memikat hati setiap penjelajah.
              </p>
            </div>
          </div>

          {/* Accordion Container (Right Panel on Desktop) */}
          <div 
            ref={rightPanelRef}
            className="lg:col-span-7 w-full"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {faqData.map((item) => {
                const isOpen = openItem === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    className="faq-item-wrapper border-none will-change-transform"
                  >
                    {/* Accordion Header / Trigger Button */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className="flex w-full items-start justify-between gap-x-4 group text-left outline-none"
                    >
                      <div className="flex-1 max-w-[88%] sm:max-w-[90%]">
                        {/* Tag at the top of question */}
                        <span
                          className={`mb-1.5 block text-left text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300
                            ${isOpen ? 'text-gold-400' : 'text-forest-500'}`}
                        >
                          {item.tag}
                        </span>
                        
                        {/* Question Bubble with Forest/Gold styling */}
                        <div
                          className={`relative flex items-center space-x-2 rounded-[14px] sm:rounded-[18px] rounded-bl-[4px] px-4 py-2.5 sm:px-5 sm:py-3 transition-all duration-300 w-fit max-w-[95%] sm:max-w-[90%] border
                            ${isOpen 
                              ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-forest-950 border-gold-600/20 shadow-[0_10px_30px_-10px_rgba(212,168,67,0.25)]' 
                              : 'bg-gradient-to-br from-forest-900/60 to-forest-950/80 text-forest-100 border-forest-800/40 hover:border-forest-600/40 hover:brightness-105 shadow-md'}`}
                        >
                          <span className="font-bold text-[13.5px] sm:text-[15px] md:text-base leading-snug">
                            {item.question}
                          </span>
                        </div>
                      </div>

                      {/* Toggle Icon Indicator */}
                      <span 
                        className={`flex shrink-0 items-center justify-center transition-all duration-300 mt-5
                          ${isOpen 
                            ? 'text-gold-400' 
                            : 'text-forest-400 group-hover:text-gold-400'}`}
                      >
                        {isOpen ? (
                          <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </span>
                    </button>
                    
                    {/* Animated Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${item.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex justify-end w-full mt-2.5 pb-1 pl-4 sm:pl-12">
                            {/* Answer Bubble with Deep Forest styling */}
                            <div className="relative inline-block max-w-[95%] sm:max-w-[90%] rounded-[14px] sm:rounded-[18px] rounded-tr-[4px] bg-gradient-to-br from-forest-950/90 to-forest-900/70 border border-forest-800/40 px-4 py-3 sm:px-5 sm:py-3.5 text-forest-200/90 shadow-lg">
                              <p className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed font-medium whitespace-pre-line">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
