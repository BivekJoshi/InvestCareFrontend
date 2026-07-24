import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-forest-950 text-cream">
      <div className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-700/25 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container relative text-center">
        <p className="font-display text-[6rem] font-bold leading-none text-gold-500 sm:text-[9rem]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          This page isn't in our portfolio.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-forest-100/70">
          The page you're looking for may have moved. Head back to the homepage or review the
          investment opportunity.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="gold" withArrow>
            Back to Home
          </Button>
          <Button href="/invest" variant="ghostLight">
            The Opportunity
          </Button>
        </div>
      </div>
    </section>
  );
}
