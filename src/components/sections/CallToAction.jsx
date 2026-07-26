import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { company } from '@/data/company';

export default function CallToAction({
  title = 'Ready to put your capital to work?',
  body = 'The promoter round is open ahead of a planned public offering. Talk to the board about allocation, timelines and documentation.',
  primary = { href: '/contact', label: 'Speak With Us' },
  secondary = { href: '/invest', label: 'Review the Opportunity' },
}) {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 text-cream md:py-24">
      <div className="absolute inset-0 bg-grid-forest bg-[size:56px_56px] opacity-25" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-full h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <Reveal className="container relative flex flex-col items-center text-center">
        <p className="script text-2xl text-gold-400 sm:text-3xl">
          {company.tagline}
        </p>
        <h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight text-balance text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-forest-100/75">{body}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={primary.href} variant="gold" withArrow>
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="ghostLight">
            {secondary.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
