import {
  Building2,
  Factory,
  Hotel,
  Laptop,
  Mountain,
  Pill,
  Wheat,
  Zap,
} from 'lucide-react';

/** Maps the string keys used in `src/data/*` onto lucide components. */
export const ICONS = {
  hotel: Hotel,
  mountain: Mountain,
  factory: Factory,
  pill: Pill,
  laptop: Laptop,
  wheat: Wheat,
  zap: Zap,
  building: Building2,
};

export function getIcon(key) {
  return ICONS[key] ?? Building2;
}
