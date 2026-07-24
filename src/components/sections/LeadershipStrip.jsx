import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import MediaFrame from '@/components/ui/MediaFrame';
import { board } from '@/data/board';
import { slideInLeft } from '@/lib/motion';

/**
 * Condensed board preview for the home page — links through to /leadership.
 */
export default function LeadershipStrip() {
  const featured = board.slice(0, 4);

  return (
    <Section id="leadership" tone="white">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-20">
        <Reveal variants={slideInLeft}>
          <span className="eyebrow">Leadership & Governance</span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.1] text-balance sm:text-4xl">
            A board with 100+ combined years of building businesses.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-forest-800/75">
            Our Board of Directors combines decades of leadership experience across pharmaceuticals,
            engineering, hospitality, hydropower, audit and capital markets to guide Invest Care's
            strategic vision and uphold strong corporate governance.
          </p>
          <Button href="/leadership" className="mt-9" withArrow>
            Meet the Full Board
          </Button>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-5 sm:grid-cols-4" staggerChildren={0.09}>
          {featured.map((member, i) => (
            <RevealItem key={member.slug} className={i % 2 === 1 ? 'sm:mt-8' : ''}>
              <figure className="group">
                <MediaFrame
                  src={member.image}
                  alt={member.name}
                  hint="/images/board/[slug].jpg — 800×1000"
                  ratio="portrait"
                  imageClassName="group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, 20vw"
                />
                <figcaption className="mt-4">
                  <p className="text-sm font-semibold leading-snug text-forest-900">
                    {member.name}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-600">
                    {member.role}
                  </p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
