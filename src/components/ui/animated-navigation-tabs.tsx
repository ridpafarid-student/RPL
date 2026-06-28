import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon?: LucideIcon;
};

interface AnimatedNavigationTabsProps {
  items: NavItem[];
}

export function AnimatedNavigationTabs({ items }: AnimatedNavigationTabsProps) {
  const [isHover, setIsHover] = useState<NavItem | null>(null);
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <ul className="flex items-center justify-center gap-2">
      {items.map((item) => {
        const active = isActive(item.to);
        const Icon = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === '/'}
            className={cn(
              "relative px-4 py-2 transition-colors duration-300 flex items-center gap-2",
              active ? "text-forest-100" : "text-forest-400 hover:text-forest-200"
            )}
            onMouseEnter={() => setIsHover(item)}
            onMouseLeave={() => setIsHover(null)}
          >
            {/* Background Hover Animation */}
            {isHover?.id === item.id && (
              <motion.div
                layoutId="hover-bg"
                className="absolute inset-0 bg-forest-700/20 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            </div>

            {/* Active Bottom Line */}
            {active && (
              <motion.div
                layoutId="active-line"
                className="absolute -bottom-1 left-3 right-3 h-0.5 bg-forest-400 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Hover Bottom Line */}
            {isHover?.id === item.id && !active && (
              <motion.div
                layoutId="hover-line"
                className="absolute -bottom-1 left-4 right-4 h-0.5 bg-forest-600/50 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </NavLink>
        );
      })}
    </ul>
  );
}
