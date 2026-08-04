import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react';

import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

/**
 * Open roles, published from the CMS. The careers page renders the
 * "no openings" panel instead when this list is empty, so publishing the first
 * job is all it takes to turn the page live.
 */
export default function JobOpenings({ jobs, fallbackEmail }) {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-forest-900 md:text-3xl">
          {jobs.length === 1 ? 'One open position' : `${jobs.length} open positions`}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-forest-800/75 md:text-base">
          We build long-term value with a small, deliberate team. If one of these fits, we would
          like to hear from you.
        </p>
      </Reveal>

      <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-5" staggerChildren={0.1}>
        {jobs.map((job) => (
          <RevealItem key={job.id}>
            <article className="rounded-2xl border border-forest-100 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-lift md:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-forest-900">
                    {job.title}
                  </h3>

                  <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-forest-800/65">
                    {job.department ? (
                      <li className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.department}
                      </li>
                    ) : null}
                    {job.location ? (
                      <li className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.location}
                      </li>
                    ) : null}
                    {job.employmentType ? (
                      <li className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {job.employmentType}
                      </li>
                    ) : null}
                  </ul>
                </div>

                {job.closesOn ? (
                  <span className="rounded-full border border-forest-100 bg-forest-50 px-3 py-1 text-xs text-forest-700">
                    Closes {new Date(job.closesOn).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                ) : null}
              </div>

              {job.summary ? (
                <p className="mt-5 text-sm leading-relaxed text-forest-800/80">{job.summary}</p>
              ) : null}

              {job.description ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest-800/70">
                  {job.description}
                </p>
              ) : null}

              {job.requirements?.length ? (
                <ul className="mt-5 space-y-2">
                  {job.requirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex gap-2.5 text-sm leading-relaxed text-forest-800/75"
                    >
                      <ArrowRight
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-gold-600"
                        aria-hidden="true"
                      />
                      {requirement}
                    </li>
                  ))}
                </ul>
              ) : null}

              <Button
                href={`mailto:${job.applyEmail || fallbackEmail}?subject=${encodeURIComponent(
                  `Application — ${job.title}`,
                )}`}
                variant="primary"
                size="sm"
                className="group mt-7"
                withArrow
              >
                Apply for this role
              </Button>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
