import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types";

interface FeaturedDestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  destination: Destination;
  themeColor?: string; // HSL value, e.g., "150 50% 25%"
}

const FeaturedDestinationCard = React.forwardRef<HTMLDivElement, FeaturedDestinationCardProps>(
  ({ className, destination, themeColor = "158 64% 22%", ...props }, ref) => {
    
    // Determine image
    const images = Array.isArray(destination.photos) && destination.photos.length > 0 
      ? destination.photos 
      : [destination.image, destination.photoUrl, destination.fotoUrl].filter(Boolean) as string[];
    const imageUrl = images[0] || 'https://placehold.co/800x600/0A1F14/40916C?text=No+Image';

    const stats = `⭐ ${destination.rating.toFixed(1)} Rating • ${destination.category[0]}`;

    return (
      <div
        ref={ref}
        style={{
          // @ts-ignore - CSS custom properties are valid
          "--theme-color": themeColor,
        } as React.CSSProperties}
        className={cn("w-full h-full", className)}
        {...props}
      >
        <Link
          to={`/destinations/${destination.id}`}
          className="group relative block w-full h-full rounded-3xl overflow-hidden shadow-lg 
                     transition-all duration-300 ease-out
                     hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          aria-label={`Explore details for ${destination.name}`}
          style={{
             boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.5)`
          }}
        >
          {/* Background Image with Parallax Zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={imageUrl}
              alt={destination.name}
              loading="lazy"
              className="h-full w-full object-cover transform-gpu
                         transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              style={{ backfaceVisibility: 'hidden' }}
            />
          </div>

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95), hsl(var(--theme-color) / 0.6) 40%, transparent 80%)`,
            }}
          />
          
          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-forest-50 transform-gpu">
            <h3 className="text-3xl font-bold tracking-tight font-display leading-tight">
              {destination.name}
            </h3>
            <p className="text-sm text-forest-200 mt-2 font-medium">{stats}</p>
            <p className="text-xs text-forest-300/80 mt-1 line-clamp-2 leading-relaxed">
              {destination.description}
            </p>

            {/* Explore Button */}
            <div className="mt-8 flex items-center justify-between bg-[hsl(var(--theme-color)/0.3)] border border-[hsl(var(--theme-color)/0.4)] 
                           rounded-2xl px-5 py-3.5 
                           transition-[background-color,border-color] duration-300 ease-out
                           group-hover:bg-[hsl(var(--theme-color)/0.4)] group-hover:border-[hsl(var(--theme-color)/0.6)]">
              <span className="text-sm font-semibold tracking-wide text-forest-100">Jelajahi Sekarang</span>
              <ArrowRight className="h-4 w-4 text-forest-100 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    );
  }
);
FeaturedDestinationCard.displayName = "FeaturedDestinationCard";

export { FeaturedDestinationCard };
