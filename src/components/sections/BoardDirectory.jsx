'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';

import MediaFrame from '@/components/ui/MediaFrame';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { EASE, viewportOnce } from '@/lib/motion';

/**
 * Board grid where a card expands into a full-width profile.
 *
 * The morph is a framer-motion shared-layout animation: the collapsed card and
 * the expanded panel carry the same `layoutId`, so opening one dissolves the
 * rest of the grid and grows the chosen card into its place instead of pushing
 * a modal over the page.
 */

const SPRING = { type: 'spring', stiffness: 250, damping: 32, mass: 0.9 };
const FADE = { duration: 0.32, ease: EASE };

/**
 * Credentials read either as a list of qualifications ("M.Phil, LLB") or as a
 * sentence ("25+ years in hospitality..."). Only the former becomes chips.
 */
function credentialChips(credentials) {
  if (!credentials) return null;
  const parts = credentials
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const listLike =
    parts.length > 1 && parts.every((part) => part.length <= 26 && part.split(' ').length <= 3);
  return listLike ? parts : null;
}

/** First sentence carries the profile; the rest become supporting points. */
function splitBio(bio = '') {
  const sentences = bio.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  return { lead: sentences[0] ?? bio, rest: sentences.slice(1) };
}

export default function BoardDirectory({ members = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  /** Entrance stagger is for the first paint only — reopening should snap back. */
  const hasInteracted = useRef(false);

  const activeIndex = members.findIndex((member) => member.slug === activeSlug);
  const active = activeIndex >= 0 ? members[activeIndex] : null;

  const scrollIntoView = useCallback(() => {
    const node = wrapRef.current;
    if (!node) return;
    const { top } = node.getBoundingClientRect();
    if (top > -40 && top < 180) return;
    window.scrollTo({
      top: top + window.scrollY - 120,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [reduceMotion]);

  const open = useCallback(
    (slug) => {
      hasInteracted.current = true;
      setActiveSlug(slug);
      scrollIntoView();
    },
    [scrollIntoView],
  );

  const close = useCallback(() => setActiveSlug(null), []);

  const step = useCallback(
    (direction) => {
      if (activeIndex < 0) return;
      const next = (activeIndex + direction + members.length) % members.length;
      setActiveSlug(members[next].slug);
    },
    [activeIndex, members],
  );

  useEffect(() => {
    if (!active) return undefined;
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, close, step]);

  return (
    <div ref={wrapRef} className="scroll-mt-32">
      <motion.div
        layout={!reduceMotion}
        transition={SPRING}
        className={cn('grid gap-8', active ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3')}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {active ? (
            <DirectorPanel
              key={active.slug}
              ref={panelRef}
              member={active}
              index={activeIndex}
              total={members.length}
              reduceMotion={reduceMotion}
              onClose={close}
              onStep={step}
            />
          ) : (
            members.map((member, index) => (
              <DirectorCard
                key={member.slug}
                member={member}
                index={index}
                reduceMotion={reduceMotion}
                delay={hasInteracted.current ? 0 : index * 0.07}
                onOpen={() => open(member.slug)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function DirectorCard({ member, index, delay, reduceMotion, onOpen }) {
  const chips = credentialChips(member.credentials);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layoutId={reduceMotion ? undefined : `director-${member.slug}`}
      transition={SPRING}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0, transition: { ...FADE, duration: 0.55, delay } }}
      viewport={viewportOnce}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22, ease: EASE } }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      whileTap={{ scale: 0.985 }}
      aria-label={`Read the profile of ${member.name}`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white text-left shadow-card outline-none transition-shadow duration-300 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
    >
      <motion.div
        layoutId={reduceMotion ? undefined : `director-media-${member.slug}`}
        transition={SPRING}
        className="relative"
      >
        <MediaFrame
          src={member.image}
          alt={member.name}
          hint="/images/board/[slug].jpg — 800×1000, plain background"
          ratio="portrait"
          className="rounded-none"
          imageClassName="group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-950/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/85 px-2.5 py-1 font-display text-[11px] font-semibold text-forest-700 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <motion.div layout="position" transition={SPRING} className="flex flex-1 flex-col p-7">
        <h2 className="font-display text-lg font-semibold leading-snug text-forest-900">
          {member.name}
        </h2>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-label text-gold-600">
          {member.role}
        </p>

        {chips ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-semibold text-forest-700"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs font-semibold text-forest-700">{member.credentials}</p>
        )}

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-forest-800/70">{member.bio}</p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-forest-700 transition-colors duration-300 group-hover:text-gold-600">
          Read profile
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </motion.div>
    </motion.button>
  );
}

function DirectorPanel({ member, index, total, reduceMotion, onClose, onStep, ref }) {
  const chips = credentialChips(member.credentials);
  const { lead, rest } = splitBio(member.bio);

  return (
    <motion.article
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-label={`${member.name} — ${member.role}`}
      layoutId={reduceMotion ? undefined : `director-${member.slug}`}
      transition={SPRING}
      initial={reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE } }}
      className="relative overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-lift outline-none"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <motion.div
          layoutId={reduceMotion ? undefined : `director-media-${member.slug}`}
          transition={SPRING}
          className="relative bg-forest-50"
        >
          <MediaFrame
            src={member.image}
            alt={member.name}
            hint="/images/board/[slug].jpg — 800×1000, plain background"
            ratio="portrait"
            className="h-full rounded-none"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { ...FADE, delay: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="flex flex-col p-8 sm:p-10 lg:p-14"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-label text-gold-600">
                {member.role}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">
                {member.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile and return to the board"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-forest-100 text-forest-700 transition-colors duration-300 hover:border-forest-200 hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {chips ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-700"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm font-semibold text-forest-700">{member.credentials}</p>
          )}

          <div className="mt-8 h-px w-16 bg-gold-500/60" aria-hidden="true" />

          <p className="mt-8 text-base leading-relaxed text-forest-800/80 sm:text-lg">{lead}</p>

          {rest.length ? (
            <ul className="mt-6 space-y-3">
              {rest.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-forest-800/70">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/contact" size="sm" withArrow>
              Arrange a Meeting
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-semibold uppercase tracking-label text-forest-700 underline-offset-4 transition-colors duration-300 hover:text-gold-600 hover:underline"
            >
              Back to the board
            </button>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <span className="text-[11px] font-semibold uppercase tracking-label text-forest-800/45">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <NavButton label="Previous director" onClick={() => onStep(-1)}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </NavButton>
              <NavButton label="Next director" onClick={() => onStep(1)}>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </NavButton>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function NavButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-forest-100 text-forest-700 transition-colors duration-300 hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
    >
      {children}
    </button>
  );
}
