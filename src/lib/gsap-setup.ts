/**
 * GSAP Setup — Register plugins once at app root.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Configure defaults for the Bogornesia feel
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
});

export { gsap, ScrollTrigger };
