import RouteLoader from '@/components/ui/RouteLoader';

/**
 * Suspense fallback for every route segment under `app/`.
 *
 * Without this file the router holds the previous page on screen, unchanged,
 * until the next one is ready — which reads as a frozen tab rather than a
 * navigation. Nested routes inherit this unless they ship their own.
 */
export default function Loading() {
  return <RouteLoader />;
}
