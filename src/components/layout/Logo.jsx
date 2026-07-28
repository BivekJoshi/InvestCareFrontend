import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";

// Brand assets live in /public and are served from the URL root.
const LOGO_FOREST = "/images/brand/investcarehorizontal.png";
const LOGO_WHITE = "/images/brand/investcarehorizontalwhite.png";
const LOGO_W = 1000;
const LOGO_H = 369;

/**
 * Horizontal wordmark, linked home. Both colourways are rendered and
 * cross-faded so callers whose background changes at runtime — the navbar
 * over the hero — can flip `invert` without a swap-in flicker.
 */
export default function Logo({ invert = false, priority = false, className = "h-15" }) {
  return (
    <Link
      href="/"
      className={cn("relative inline-flex shrink-0 items-center", className)}
      aria-label={`${company.name} — home`}
    >
      <Image
        src={LOGO_FOREST}
        alt={`${company.name} logo`}
        width={LOGO_W}
        height={LOGO_H}
        priority={priority}
        className={cn(
          "h-full w-auto transition-opacity duration-500",
          invert ? "opacity-0" : "opacity-100",
        )}
      />
      <Image
        src={LOGO_WHITE}
        alt=""
        aria-hidden="true"
        width={LOGO_W}
        height={LOGO_H}
        priority={priority}
        className={cn(
          "absolute left-0 top-0 h-full w-auto max-w-none transition-opacity duration-500",
          invert ? "opacity-100" : "opacity-0",
        )}
      />
    </Link>
  );
}
