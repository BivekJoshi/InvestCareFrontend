import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

export const metadata = {
  title: 'Important Notice & Disclaimer',
  description:
    'This website is provided for informational purposes only and does not constitute an offer, solicitation, or recommendation to buy or sell any securities or investment products.',
  robots: { index: true, follow: true },
};

const PARAGRAPHS = [
  'This document is provided for informational purposes only and does not constitute an offer, solicitation, or recommendation to buy or sell any securities or investment products. Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. Prospective investors should conduct their own due diligence and consult qualified financial, legal, and tax advisers before making any investment decisions. Invest Care Limited makes no representations or warranties, express or implied, regarding the accuracy or completeness of the information contained herein.',
  'Certain statements in this document may be forward-looking, including projections, forecasts, and estimates regarding future financial performance, business strategies, and market conditions. These statements are based on current expectations and assumptions and are subject to known and unknown risks, uncertainties, and other factors that may cause actual results to differ materially from those expressed or implied. Invest Care Limited undertakes no obligation to update or revise any forward-looking statements in light of new information or future events.',
  'Invest Care Limited is a Public Limited Company and intends to raise capital in accordance with the Companies Act and applicable SEBON regulations. This profile does not constitute a prospectus.',
];

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Important Notice"
        title="Disclaimer"
        lead="Please read the following carefully before relying on any information presented on this website."
        breadcrumb={['Disclaimer']}
      />

      <Section tone="light">
        <Reveal className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-forest-100 bg-forest-50 p-8 md:p-12">
            <div className="space-y-6">
              {PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-forest-800/80 md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-forest-700/60">
            Last updated: Shrawan 2083 (July 2026).
          </p>
        </Reveal>
      </Section>
    </>
  );
}
