/**
 * Site content — all copy is taken from RS International's own website
 * (rsinternationalagency.com) and the agency's brief. Edit here, not in components.
 */
export const CONTACT = {
  phones: ["+91-9811660959", "+91-9811668579"],
  emails: ["info@rsinternationalagency.com", "info@rsinternational.co.in"],
};

export const LICENSE = "B-0605/DEL/PER/1000+/5/7217/2005";

/* Navigation — mirrors the existing site's information architecture */
export const NAV = [
  { label: "Home", href: "#top" },
  {
    label: "Vacancies",
    children: [
      { label: "For Employer", href: "#inquiry", intent: "employer" },
      { label: "Jobs", href: "#inquiry", intent: "candidate" },
    ],
  },
  { label: "Our Clients", href: "#clients" },
  {
    label: "About",
    children: [
      { label: "About Company", href: "#about" },
      { label: "How We Do", href: "#workflow" },
      { label: "Region We Serve", href: "#regions" },
    ],
  },
  { label: "Contact", href: "#contact" },
  {
    label: "Updates",
    children: [
      { label: "RS Update", href: "#about" },
      { label: "Global", href: "#regions" },
    ],
  },
];

/* Hero copy — original wording from the live homepage */
export const HERO = {
  subtitle: "One stop solution for your recruitment needs.",
  cta: "Free CV Search",
  // Offshore rig photo from the agency's current homepage slider.
  // For production, copy it into /public and point this at "/hero-offshore.jpg".
  image: "https://rsinternationalagency.com/wp-content/uploads/2023/01/Slider-1.jpg",
};

/* Successful Recruitment 2022–2023 */
export const METRICS = [
  { value: 65, suffix: "+", label: "Global Projects Delivered" },
  { value: 4000, suffix: "+", label: "Elite Workers Recruited" },
  { value: 95, suffix: "%", label: "Worker Retention Rate" },
  { value: 24, suffix: "x7", label: "Dedicated Support" },
];

/* Regions served (from "Region We Serve") */
export const REGIONS = [
  { id: "middle-east", label: "Middle East", note: "Bulk manpower for Gulf countries" },
  { id: "south-east", label: "South East Asia", note: "Workforce for a recovering regional economy" },
  { id: "europe", label: "Europe", note: "Skilled talent for an evolving job market" },
  { id: "russia", label: "Russian Federation", note: "Mass workers to meet industrial demand" },
];

/* Section 2 copy — original wording from the live homepage */
export const SECTORS_COPY = {
  tag: "(02) Sectors",
  headline: "Looking For A Deserving Candidate Is Not Easy.",
  subtitle: "Start Searching Now!",
};

/*
 * Core sectors — the four categories from the live site's slider, with its photos.
 * For production, copy the images into /public and update the paths.
 */
const IMG = "https://rsinternationalagency.com/wp-content/uploads/2023/02/";
export const SECTORS = [
  { id: "hospitality", title: "Hospitality", image: `${IMG}Hospitality-2.jpg` },
  { id: "railway", title: "Railway", image: `${IMG}Railway.jpg` },
  { id: "agriculture", title: "Agriculture", image: `${IMG}Agriculture-1.jpg` },
  { id: "construction", title: "Construction", image: `${IMG}Construction-1.jpg` },
];

/*
 * Section 3 — "Save Time And Get The Best Talent".
 * Pillar copy is the live site's tab text. Pillar 4 uses the site's licence statement,
 * because the live tab text for it ("insured rates… coverage") reads as template filler.
 * Images are from the live homepage; copy them into /public before launch.
 */
const UP = "https://rsinternationalagency.com/wp-content/uploads/";
export const ADVANTAGES = {
  tag: "(04) Advantages",
  headline: "Save Time And Get The Best Talent",
  cta: "Search For Talent",
  pillars: [
    {
      id: "mobilization",
      title: "Easy Mobilization",
      body: "We can help! We provide easy mobilization of candidates to your company through our recruitment strategy. Our recruiters will search for the best fit for your organization, and we will make sure that each candidate is properly screened and vetted before beginning their application process.",
      image: `${UP}2023/01/Slider-2.jpg`,
      position: "object-[80%_center]",
    },
    {
      id: "security",
      title: "99.9% Talent Job Security",
      body: "We offer 99.9% job security, so you can rest easy knowing that we don’t just say it – we back it up with a guarantee. If you’re not happy, we’ll make it right.",
      image: `${UP}2023/01/Slider-4.png`,
      position: "object-center",
    },
    {
      id: "affordability",
      title: "Talent Affordability",
      body: "We guarantee the best talents at the most affordable cost. With us, you can hire trained candidates at an affordable cost!",
      image: `${UP}2023/02/home-photo0.jpg`,
      position: "object-[center_20%]",
    },
    {
      id: "government",
      title: "Government-Approved Agency",
      body: "R.S. International is approved by the Government of India, Ministry of External Affairs to carry business of Manpower Recruitments.",
      image: `${UP}2023/01/Home-3.png`,
      position: "object-center",
      badge: `License No: ${LICENSE}`,
    },
  ],
};

/*
 * Section 4 — "The Solution". Headline, subtitle and button are the live site's copy.
 * Assurance lines restate claims the agency already makes on its site
 * (screening & vetting, MEA licence, 99.9% job-security guarantee, 95% retention).
 */
export const SOLUTION = {
  tag: "(05) The Solution",
  headline: "We know how difficult it is to hire a deserving candidate",
  subtitle: "We can help you hire the best talents for your industry!",
  cta: "Search for a Talent",
  assurances: [
    {
      id: "vetting",
      title: "Streamlined vetting",
      body: "Every candidate is properly screened and vetted before their application begins.",
      status: "Screened",
    },
    {
      id: "compliance",
      title: "Guaranteed compliance",
      body: "Approved by the Govt. of India, Ministry of External Affairs.",
      status: "Licensed",
    },
    {
      id: "risk",
      title: "Zero-risk talent acquisition",
      body: "99.9% job security, backed by a guarantee — if you’re not happy, we’ll make it right.",
      status: "Guaranteed",
    },
  ],
  retention: 95,
};

/* Section 5 — "Your Steps to hire the best candidate" (copy per the section brief) */
export const WORKFLOW = {
  tag: "(06) Workflow",
  headline: "Your Steps to hire the best candidate",
  cta: "Contact Us",
  steps: [
    {
      id: "search",
      title: "Search For Industry",
      body: "Search for your desired Industry, and search from our list of talents.",
    },
    {
      id: "consult",
      title: "Get On 1-1 Consultation with Us",
      body: "Collaborate directly with our expert manpower advisors for customized talent acquisition strategies.",
    },
    {
      id: "hire",
      title: "Hire The Deserved Talent",
      body: "Secure vetted professionals with complete visa processing and rapid global mobilization.",
    },
  ],
};

/* Clients listed on the current site */
/*
 * Section 6 — client logos from the live site (150×80 PNGs on white, no transparency).
 * Ask the agency for transparent/SVG versions and drop them in /public before launch.
 */
const LOGO = "https://rsinternationalagency.com/wp-content/uploads/2023/02/";
export const CLIENTS = {
  tag: "(07) Trusted Partners",
  headline: "Trusted by Industry Leaders Worldwide",
  subtitle: "Powering workforce deployment for multinational enterprises and government contractors.",
  logos: [
    { name: "SKD Group", logo: `${LOGO}SKD.png` },
    { name: "United Plantations Berhad", logo: `${LOGO}UP.png` },
    { name: "Al Qabdah Building Contracting", logo: `${LOGO}Al-Qabdah-1.png` },
    { name: "FGV", logo: `${LOGO}FGV.png` },
    { name: "Kuwait Resources House", logo: `${LOGO}KRH-2.png` },
  ],
};

/* Section 7 — "Strategic Advantage" (card text verbatim from the live homepage) */
export const STRATEGIC = {
  tag: "(09) Strategic Advantage",
  headline: "Enterprise-Grade Manpower Solutions Backed by Certified Trust",
  cards: [
    {
      id: "efficiency",
      title: "Efficiency & Speed",
      body: "Hiring a new talent can cost you time, energy, and money. With R.S. International, complete your search and hire the best talents in your industry!",
    },
    {
      id: "license",
      title: "Government Approved License",
      body: `R.S. International is approved by the Government of India, Ministry of External Affairs to carry business of Manpower Recruitments through License No: ${LICENSE}.`,
    },
    {
      id: "research",
      title: "Research Consultancy",
      body: "We understand our client's objectives and help them find the best employees by integrating information, analysis, and strategy with availability. We provide complete research consultancy to assist our clients in making wise decisions.",
    },
    {
      id: "analytics",
      title: "Data & Workforce Analytics",
      body: "We help companies in assessing their data and find the best-suited employees for their needs. Our research and data analytics can assist you in modeling your staff and ensuring they have the necessary skills.",
    },
  ],
};

/* Section 8 — "Proven Impact" (labels verbatim from the live homepage counters) */
export const IMPACT = {
  tag: "(10) Proven Impact",
  headline: "Successful Recruitment 2022-2023",
  metrics: [
    { id: "projects", value: 65, suffix: "+", label: "Projects" },
    { id: "recruitment", value: 4000, suffix: "+", label: "Recruitment" },
    { id: "retention", value: 95, suffix: "%", label: "Worker Retention Rate" },
    { id: "support", value: 24, suffix: "x7", label: "Support" },
  ],
};

/*
 * Footer — link labels and sub-footer text verbatim from the live site.
 * Social URLs weren't findable on the live site: fill in `href` for each before launch.
 */
export const FOOTER = {
  quickLinks: [
    { label: "Home", href: "#top" },
    { label: "Employer", href: "#inquiry", intent: "employer" },
    { label: "Jobs", href: "#inquiry", intent: "candidate" },
    { label: "Our Clients", href: "#clients" },
    { label: "Contact Us", href: "#contact" },
  ],
  companyLinks: [
    { label: "About Company", href: "#about" },
    { label: "How We Do", href: "#workflow" },
    { label: "Region We Serve", href: "#regions" },
    { label: "RS Updates", href: "#impact" },
    { label: "Global Updates", href: "#regions" },
  ],
  social: [
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
  ],
  copyright: "© 2026 All rights reserved | RS International",
  credit: "Made by Norx Cloud",
};

export const ABOUT = {
  blurb:
    "R.S. International is one of the pioneering manpower supply agencies engaged in manpower recruitment from India for overseas assignments.",
  approval:
    "R.S. International is approved by the Government of India, Ministry of External Affairs to carry business of Manpower Recruitments.",
  promise:
    "Hiring a new talent can cost you time, energy, and money. With R.S. International, complete your search and hire the best talents in your industry!",
};

/** Section 3 — two-column platform feature (copy as supplied). */
export const PLATFORM = {
  tag: "(03) Advanced Recruitment Platform",
  headlineLead: "Smart Recruitment That",
  headlineAccent: "Gets Global Hiring Done.",
  subtitle:
    "Find, vet, and mobilize elite international talent in minutes. Powered by automated compliance, secure visa processing, and in-country expert verification.",
  bullets: [
    "End-to-end visa processing and legal documentation handled",
    "Rapid mobilization with strict pre-screening and skill vetting",
    "Complete compliance with international labor standards",
  ],
  primaryCta: "Book a Consultation",
  secondaryCta: "Explore Sectors",
};

/**
 * Section 8 — case studies carousel. Copy as supplied by the client brief;
 * Images are the live site's photos — placeholders until real project photos are supplied.
 */
export const CASE_STUDIES = {
  tag: "(08) Global Case Studies",
  headline: "Trusted by Leading Enterprises Worldwide.",
  subtitle: "See how world-class companies scale their workforce across borders with verified manpower deployment.",
  stories: [
    {
      id: "am-logistics",
      client: "AM Logistics",
      region: "United Kingdom",
      metric: "100% Audit Pass Rate",
      body: "Successfully onboarded and managed over 250 logistics drivers with zero compliance friction across annual UK audits.",
      image: `${UP}2023/01/Slider-2.jpg`,
      tone: "orange",
    },
    {
      id: "al-qabdah",
      client: "Al Qabdah Contracting",
      region: "Middle East",
      metric: "48-Hour Mobilization",
      body: "Scaled engineering and technical teams across regional sites with fully verified visas and labor documentation.",
      image: `${UP}2023/01/Slider-4.png`,
      tone: "rose",
    },
    {
      id: "skd",
      client: "SKD Group",
      region: "Southeast Asia",
      metric: "98% Retention Rate",
      body: "Optimized corporate and hospitality staffing through rigorous pre-screening and end-to-end recruitment pipelines.",
      image: `${UP}2023/02/home-photo0.jpg`,
      imagePosition: "object-top",
      tone: "emerald",
    },
  ],
};
