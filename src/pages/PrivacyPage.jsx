import PageBanner from "../components/PageBanner.jsx";
import { CONTACT } from "../content.js";

/**
 * Privacy policy — a plain-language DRAFT written for India's Digital Personal Data
 * Protection Act, 2023. Have it reviewed by the company (and ideally a lawyer) before
 * relying on it; update the "Last updated" date whenever it changes.
 */
const UPDATED = "26 November 2026";

const SECTIONS = [
  {
    h: "Who we are",
    p: [
      "RS International (“we”, “us”) is a Government of India approved overseas manpower recruitment agency with its head office at H-9A, 3rd Floor, Main Road Kalkaji, New Delhi. This policy explains how we handle personal data you share through this website.",
    ],
  },
  {
    h: "What we collect",
    p: [
      "Only what you type or upload in our forms: your name, phone number, email address, company or trade, the sector and destination you choose, your message, and — if you apply for a job — your résumé and a short description of your experience.",
      "We do not use advertising cookies or tracking pixels. Our hosting provider keeps standard server logs (such as IP address and time of request) for security.",
    ],
  },
  {
    h: "Why we use it",
    p: [
      "To answer your enquiry, to match candidates with overseas employers, to process job applications (including sharing your profile with the employer you applied to, with your consent), and to meet our legal obligations as a licensed recruitment agency.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "Employers and their agents for the specific role you apply for; government bodies where the law requires it (for example for emigration clearance); and service providers who host this website and our email (Vercel and Zoho), only to run those services. We never sell your data.",
    ],
  },
  {
    h: "How long we keep it",
    p: ["Enquiries are kept for up to 2 years. Candidate profiles and résumés are kept for up to 3 years so we can contact you about suitable roles, unless you ask us to delete them sooner."],
  },
  {
    h: "Your rights",
    p: [
      `You can ask to see, correct or delete your data, or withdraw your consent, at any time by emailing ${CONTACT.emails[0]} or calling ${CONTACT.phones[0]}. We reply within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India.`,
    ],
  },
  {
    h: "Security",
    p: ["Forms are sent over an encrypted connection (HTTPS) and delivered to our company mailbox. Access to candidate data is limited to our recruitment staff."],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageBanner crumb="Privacy Policy" tag="Legal" title="Privacy Policy" subtitle={`Last updated ${UPDATED}`} image="/media/hero-cities-poster.jpg" />
      <section aria-label="Privacy policy" className="bg-white px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl font-bold text-slate-900">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t.slice(0, 30)} className="mt-3 text-base leading-relaxed text-slate-700">
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
