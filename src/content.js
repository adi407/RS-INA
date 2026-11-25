/**
 * Site content — all copy is taken from RS International's own website
 * (rsinternationalagency.com) and the agency's brief. Edit here, not in components.
 */
export const CONTACT = {
  phones: ["+91-9072111770", "+91-484-2359569", "+91-484-2356270"],
  // emails[0] receives every website inquiry (all forms send to it)
  emails: ["recruit@rsina.in", "hr1@rsina.in", "hr2@rsina.in", "cvs@rsina.in"],
};

export const LICENSE = "B-0605/DEL/PER/1000+/5/7217/2005";

/* Navigation — mirrors the existing site's information architecture */
export const NAV = [
  { label: "Home", href: "#top" },
  {
    label: "Vacancies",
    children: [
      { label: "For Employer", href: "/employers" },
      { label: "Jobs", href: "/jobs" },
    ],
  },
  { label: "Our Clients", href: "/clients" },
  {
    label: "About",
    children: [
      { label: "About Company", href: "/about" },
      { label: "How We Do", href: "/how-we-do" },
      { label: "Region We Serve", href: "/regions" },
    ],
  },
  { label: "Contact", href: "/contact" },
  {
    label: "Updates",
    children: [
      { label: "RS Update", href: "/rs-updates" },
      { label: "Global", href: "/global" },
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
  // Background videos (served from /public/media), played one after another in a
  // crossfading loop. The first poster shows until playback starts and for reduced motion.
  videos: [
    { src: "/media/hero-cities.mp4", poster: "/media/hero-cities-poster.jpg" },
    { src: "/media/hero.mp4", poster: "/media/hero-poster.jpg" },
  ],
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
  tag: "Sectors",
  headline: "Looking For A Deserving Candidate Is Not Easy.",
  headlineSplit: 5, // words in the dark lead of the two-tone heading
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
  tag: "Advantages",
  headline: "Save Time And Get The Best Talent",
  headlineSplit: 2, // words in the dark lead of the two-tone heading
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
  tag: "The Solution",
  headline: "We know how difficult it is to hire a deserving candidate",
  headlineSplit: 6, // words in the dark lead of the two-tone heading
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
  tag: "Workflow",
  headline: "Your Steps to hire the best candidate",
  headlineSplit: 2, // words in the dark lead of the two-tone heading
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
  tag: "Trusted Partners",
  headline: "Trusted by Industry Leaders Worldwide",
  headlineSplit: 4, // words in the dark lead of the two-tone heading
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
  tag: "Strategic Advantage",
  headline: "Enterprise-Grade Manpower Solutions Backed by Certified Trust",
  headlineSplit: 3, // words in the dark lead of the two-tone heading
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
  tag: "Proven Impact",
  headline: "Successful Recruitment 2022-2023",
  headlineSplit: 2, // words in the dark lead of the two-tone heading
  metrics: [
    { id: "projects", value: 65, suffix: "+", label: "Projects" },
    { id: "recruitment", value: 4000, suffix: "+", label: "Recruitment" },
    { id: "retention", value: 95, suffix: "%", label: "Worker Retention Rate" },
    { id: "support", value: 24, suffix: "x7", label: "Support" },
  ],
};

/*
 * Footer — link labels and sub-footer text verbatim from the live site.
 * Social URLs as linked from the live site's footer.
 */
export const FOOTER = {
  quickLinks: [
    { label: "Home", href: "#top" },
    { label: "Employer", href: "/employers" },
    { label: "Jobs", href: "/jobs" },
    { label: "Our Clients", href: "/clients" },
    { label: "Contact Us", href: "/contact" },
  ],
  companyLinks: [
    { label: "About Company", href: "/about" },
    { label: "How We Do", href: "/how-we-do" },
    { label: "Region We Serve", href: "/regions" },
    { label: "RS Updates", href: "/rs-updates" },
    { label: "Global Updates", href: "/global" },
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/manpowr" },
    { label: "Instagram", href: "https://www.instagram.com/rsinternationall/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/r-s-international-077174159/" },
  ],
  copyright: "© 2026 All rights reserved | RS International",
  credit: "Made by Norx Cloud",
};

/**
 * /about — "About Company" page. Copy verbatim from the old About Company page; photos
 * and the brochure PDF are that page's own files (copy into /public before launch).
 */
export const ABOUT_PAGE = {
  tag: "(About Us)",
  title: "About Company",
  banner: `${UP}2023/01/About-Company.png`,
  storyTag: "Who We Are",
  storyTitle: "Our Story",
  story: [
    "R.S. International is a pioneering manpower supply agency, that engages in manpower recruitment from India for overseas assignments. We have years of experience and expertise in providing the right people at different levels in various industries. In the past, we have earned most value as a recruitment agency in the Gulf countries.",
    "We offer manpower services ranging from manpower consultancy to mass and/or bulk hiring for specified projects requirement. We provide you with an opportunity to hire the skilled workers available in India, regardless of their location or experience, so that you can focus on your business without compromising on quality or cost.",
  ],
  storyMore: [
    "We facilitate testing, interviews, and assessments that are conducted by experts. Knowledge and experience in the sector enable us to respond to requisitions quickly. As manpower agency, we provide services for recruiting a wide spectrum of professionals, workers, engineers, and many more.",
    "The requirements we provide include both skilled and unskilled candidates. Our search plan, coupled with applied research and a network of contacts helps us choose the best candidates for selection.",
    "We understand the importance of having the right candidates in an organization, which is why we provide international placements. We set up interviews in our office or even at the clients to hire the best people directly for our clients. This process can be done in a short period of time to organize any number of candidates in any capacity. We will help you arrange any number of workers for overseas recruitment.",
    "We help you in managing all international recruitments through our trustworthy associates in India, Bangladesh, and Nepal. After joining, we continue to monitor candidates and assist our clients and candidates in resolving any issues between employers and employees. If in any case the problem is not resolved in a span of three months, we will replace them.",
  ],
  brochure: `${UP}2023/01/R.S.-Brochure-101.pdf`,
  director: {
    tag: "Managing Director's Message",
    quote:
      "I started this journey in 2005 with my first client “Laglove”. A Malaysian glove production firm. As time passes, we updated our recruitment pattern with a high-tech sourcing team. In 2012 we joined ourselves in a project with “Shapoorji Pallonji” Dubai as a construction manpower vendor. It was a huge success and we learned a lot of new tricks to serve our client happy. Since 2017 we are in touch with “KRH” from Kuwait, “FGV” from Malaysia, and many more from different countries. It was a roller coaster ride and we are ready for a new chapter.",
    name: "Mr. Shri Chand",
    role: "Managing Director",
    photo: `${UP}2023/02/Director-photo00.jpg`,
  },
  valuesTag: "What Drives Us",
  valuesTitle: "Vision, Mission & Values",
  photo: `${UP}2023/01/About-3.png`,
  pillars: [
    {
      id: "vision",
      title: "Vision",
      body: "Our vision is to lead in the creation and delivery of innovative workforce solutions and services that enable our clients to win in the changing world of work. We believe that every organization should have access to a workforce solution that enables them to thrive, grow and compete in today’s hyper-competitive market.",
    },
    {
      id: "mission",
      title: "Mission",
      body: "At R.S International, we believe that quality, the best service, and good results are the main motive of our company. We have hired a highly talented and experienced team of professionals, recruitment and placement experts, and many others. We also have an excellent reputation among our clients as we always help them get what they need.",
    },
    {
      id: "values",
      title: "Values & Commitments",
      body: "We are committed to providing manpower solutions at the highest quality levels, quick turnaround times, and cost-effective services. We have been around for over 5 years with a proven track record in the Middle East and Asia. Our extensive procedures, that is implemented by a highly experienced recruitment team, have allowed us to back up our claim of quality and devotion.",
    },
  ],
};

/**
 * /how-we-do — "How We Do It?" methodology. Step titles and text verbatim from the old
 * How We Do page; photos are that page's own, cropped free of their yellow frames
 * (public/media/process). Subtitle as supplied in the agency's brief.
 */
export const PROCESS_PAGE = {
  tag: "(Our Process)",
  title: "How We Do It?",
  banner: `${UP}2023/01/About-Company.png`,
  sectionTag: "Methodology",
  sectionTitle: "Our Methodology",
  subtitle:
    "A rigorous, end-to-end recruitment and global deployment framework built on speed, absolute legal compliance, and worker security.",
  steps: [
    {
      id: "consulting",
      title: "Get on a free recruitment consulting session",
      body: "We have close encounters with clients to determine their exact requirements. We are a team of professionals who are skilled in providing services to clients. We have a team of experts who can provide solutions to their problems. We are able to offer video conferencing, face-to-face interaction, and telephone conversation with our clients.",
    },
    {
      id: "advertising",
      title: "Advertising Job openings",
      body: "We will create a creative and profitable solution to advertise all the job categories asked by our clients across all branches of R.S. International. We will promote client required positions on all social mediums such as LinkedIn, Instagram, Facebook, Website, WhatsApp groups, etc.",
    },
    {
      id: "interview",
      title: "Interview Conduction",
      body: "Our physical interviews are conducted through P.O.E permissions only. We conduct interviews in trade centers with interview equipment to make it easy for you.",
    },
    {
      id: "medical",
      title: "Medical Procedure",
      body: "After the Interview conduction, the selected candidates are sent for medical checkups. Our selection process is rigorous and includes a variety of medical checkups, including blood tests, x-rays, and scans. The selected candidates are sent to respected medicals affiliated with the home country of the employer.",
    },
    {
      id: "visa",
      title: "Visa Procedure",
      body: "The visa process is a long and tedious one. It’s important to make sure that everything is done correctly, so we can guarantee a smooth transition from your end to ours. Once we sent the fit medical reports of the selected candidate, we help with the visa procedure for the selected candidates.",
    },
    {
      id: "orientation",
      title: "Pre-Departure Orientation",
      body: "After the selection process, we organize an orientation program for workers who are traveling to the employer’s country for work, after completion of the visa and other travel procedures. In this orientation, we brief them about the work and the nature of the business the company deals in. Orientation contains all the briefing of the government policies of the country the selected candidates are traveling to and the briefing of travel documents.",
    },
    {
      id: "arrival",
      title: "Safety at Arrival",
      body: "We take worker grievances seriously and try to resolve them as soon as possible. We also value employers’ feedback so that, in the future, any disputes may be managed properly while preventing misinterpretation and misunderstanding.",
    },
    {
      id: "feedback",
      title: "Feedback and Grievance",
      body: "We take worker’s grievance very seriously and try to solve them as fast as we can. Also, employers’ feedback is also considered crucial so in case employer and workers comes into any dispute in future we solve them very professionally by avoiding miscommunication and misunderstanding.",
    },
  ].map((s, i) => ({ ...s, image: `/media/process/step-${i + 1}.jpg` })),
};

/**
 * /regions — "Region We Serve". Intro and each region's story verbatim from the old
 * Region We Serve page and its four region posts; { h } entries are their subheadings.
 * `places` are only the countries / cities each post itself names.
 */
export const REGIONS_PAGE = {
  tag: "(Global Reach)",
  title: "Region, We Serve",
  banner: `${UP}2023/02/world-map-3.jpg`,
  intro:
    "Last year has seen a lot of people looking for opportunities to build and grow their careers in Gulf countries. Understanding the need for recruitment in Gulf countries we made sure to help our clients in these countries especially in Middle East, South East, Europe, and the Russian Federation to have mass workers as per their requirement.",
  sectionTag: "Regions",
  sectionTitle: "Where We Recruit For",
  cta: "Read More",
  regions: [
    {
      id: "south-east",
      title: "Recruitment in South East",
      image: `${UP}2023/01/Region-we-serve-2.png`,
      places: ["Malaysia", "Singapore", "Thailand", "Indonesia"],
      body: [
        "As a way to cope with the aftereffects of the pandemic, South East has various job vacancies. Seeing the crucial need of the hour, R.S.International took the initiative to help many organizations in the South East area including Malaysia, Singapore, and many more, to have bulk workers during their time of need.",
        { h: "Why does South East have a higher demand for manpower?" },
        "South East has a high demand for skilled workers and talents in many places. Places like Singapore, Malaysia, Thailand, and Indonesia, have an immense need for manpower. The proportion of employment pass (EP) holders in Singapore who are Indian nationals has doubled from 13 percent to 26 percent. On the other hand, Malaysia is one of the top destinations for hiring Indian workers. More than 30% of the workforce is in many sectors including construction, plantation, and agriculture. Seeing the need of the hour – a Memorandum of Understanding on the Employment of workers has been signed between the Government of India and the Government of Malaysia.",
        "This need for talent had made it difficult for many companies to hire the talent they need.",
        "Many multinational corporations struggle to fill workers’ openings. While businesses’ hands are full trying to attract and hire the best-skilled talents in the industry, it takes time and attention to address every individual’s demand and need. Every time there are new challenges that they are needed to be addressed.",
        "As difficult as It is to find the best talent for these businesses, R.S. International understands the need of the hour. We have helped many companies in South East with bulk talents whenever required. Starting from the Selection to getting them onboarded we take care of it all.",
        "Need an Indian manpower agency for manpower supply to the Southeast from India then contact us for all your requirements needs.",
      ],
    },
    {
      id: "middle-east",
      title: "Recruitment in Middle East",
      image: `${UP}2023/01/Region-we-serve-1.png`,
      places: ["UAE", "Kuwait", "Bahrain", "Saudi Arabia", "Oman", "Qatar"],
      body: [
        "Manpower requirements are crucial in Gulf countries. Getting bulk workers for all kinds of jobs is an important aspect for many organizations in the Middle East. With numerous job vacancies having low manpower is a challenge. Keeping the requirements in mind R.S.International has provided bulk workers to some of the areas in the Middle East that as UAE, Kuwait, Bahrain, Saudi Arabia, Oman, Qatar, and many more.",
        { h: "How Pandemic has affected the Recruitment rate in the Middle East?" },
        "The Covid-19 pandemic caused disruption and instability in the Middle East Job sectors, making it difficult to make informed decisions. The effect of pandemic has had a massive impact on every market including real estate, Oils exports, petroleum, etc. The market had faced a lot of ups and downs with prices being highly volatile and making it difficult to predict the future for businesses.",
        "But now the market is back again in action. The real estate property prices have shown a steady increase again rising by 21% from 2021-2022. Working in the Middle East has its own advantages. It has everything one can depict, starting from contemporary oasis cities with everything a person could want to Urban retail malls with stores selling whatever you can think of, gorgeous urban parks where you can rest and relax, good infrastructure with high-tech hospitals, and more.",
        "If you are looking for jobs in the Middle East then you have reached the right place. R.S. International has helped many businesses get workers from India, Nepal, and Bangladesh.",
        "Need for an Indian manpower agency for manpower supply to the middle east from India then contact us for all your requirements needs. We understand your need for a job or hiring skilled workers thus we will be able to connect you with the best talents or help you get the best jobs based on your skills.",
      ],
    },
    {
      id: "russian-federation",
      title: "Recruitment in Russian Federation",
      image: `${UP}2023/01/Region-we-serve-4.png`,
      places: ["Moscow", "Novosibirsk", "Kazan", "Vladivostok"],
      body: [
        "The European economy is facing a difficult challenge as it struggles to find enough qualified workers. This is especially true in Russia, where the economic situation has led to a shortage of available manpower. As a result, many companies are turning to India to find the skilled workers they need. However, this comes with its own set of problems. The cultural differences between Russia and India can make it difficult for Russian companies to successfully recruit Indian workers, and there are also issues related to the cost of living and wages in Russia that can be prohibitive for some Indian workers.",
        "Russia is a vast country with a diverse range of industries, and the need for manpower is constantly growing. With the region’s huge population and abundance of resources, it has become an attractive destination for many international companies looking to fill various job vacancies.",
        "The need for talented workers in Russia has been increasing. Provided many organizations in Moscow, Novosibirsk, Vladivostok, and Kaz have a lot of manpower requirements in hand. These organizations are on a constant lookout for skilled workers at competitive prices. With its wide range of job opportunities, they are all set to hire a cost-effective labor force, Russia is quickly becoming one of the most sought-after countries for businesses looking to expand their operations.",
        "The Russian Federation is constantly in a state of development and change. With this development, there is an enormous number of opportunities for everyone. The country has many vacancies for manpower, who are willing to work and develop themselves in order to achieve high goals in life. R.S. International has helped many organizations with manpower in Moscow, Novosibirsk, Kazan, and many more.",
        "Need for an Indian manpower agency for manpower supply to Russia from India then contact us for all your requirements needs.",
      ],
    },
    {
      id: "europe",
      title: "Recruitment in Europe",
      image: `${UP}2023/01/Region-we-serve-3.png`,
      places: [],
      body: [
        "The European job market is constantly evolving, with new opportunities and recruitment strategies emerging every day. As a result, it can be difficult to keep up with the latest trends and remain competitive in the job search or hiring of deserving candidates. However, understanding the current trends in Europe’s job market can help you find employment opportunities that match your skills and experience. With an increase in the number of jobs globally, the need for manpower from India has seen a huge rise. With a large range of skilled and talented professionals and with emerging companies entering the market, it has become far easier for recruitment agencies to fulfill the business requirements and candidates’ preferences.",
        "The recruitment sector in Europe is facing a major challenge due to the overwhelming demand for manpower from India. As the global economy grows and more companies are looking for skilled workers, the recruitment sector is becoming increasingly critical. This has created a need for organizations to find ways to source manpower from India in an efficient and cost-effective manner. Unfortunately, this has proven to be difficult due to the various challenges faced by organizations when it comes to hiring from India. These challenges include language barriers, cultural differences, and legal restrictions on hiring foreign workers.",
        "Moreover, due to the current global pandemic situation, the recruitment sector has become even more critical as organizations must find ways to ensure that their manpower needs are met without compromising on quality or safety. Employment in Europe had immense growth before the pandemic. However, if we look into the post-pandemic situation there has been a vast requirement of candidates for various job types in the areas, we covered in Europe that had many vacancies. We helped many organizations with required candidates all over Europe to cover their manpower needs.",
        "R.S. International had successfully provided bulk workers to several organizations in Europe. We understand the need of the hour and thus have bulk talents available with us, to get hired.",
        "Need for an Indian manpower agency for manpower supply to Europe from India then contact us for all your requirements needs.",
      ],
    },
  ],
};

/**
 * /contact — "Contact Us". Form labels (English / Hindi) and office addresses from the
 * old Contact page; addresses only tidied for spacing and capitalisation. Phone and
 * email come from CONTACT (the old page lists the previous numbers).
 */
export const CONTACT_PAGE = {
  tag: "(Get In Touch)",
  title: "Contact Us",
  banner: `${UP}2023/02/contact.jpg`, // contact-1.jpg (used by the old page) is a broken file
  formsTag: "Enquiries",
  formsTitle: "How can we help?",
  tabs: {
    company: { label: "For Companies", hint: "Hiring workers for your projects" },
    jobseeker: { label: "For Job Seeker", hint: "Looking for a job overseas" },
  },
  fields: {
    name: "Name / नाम",
    phone: "Contact No. / संपर्क संख्या",
    email: "Email / ईमेल",
    purpose: "Purpose of Contact / संपर्क का उद्देश्य",
    message: "Message / संदेश",
    resume: "Upload Resume",
  },
  submit: "Send",
  inquiryTitle: "For any Inquiry...",
  officesTag: "Global Presence",
  officesTitle: "Our Offices",
  offices: [
    {
      country: "India",
      code: "IN",
      places: [
        { name: "R.S. International Delhi HQ", address: "H-9A, 3rd Floor, Main Road Kalkaji, New Delhi" },
        { name: "R.S. International Kerala Branch", address: "39/6503, Tharakan Dam Estate, Kurisu Pally Road, Rasipuram, Cochin" },
      ],
    },
    {
      country: "United Arab Emirates",
      code: "AE",
      places: [{ address: "Company building, Al Shohada Road, Al Hamra Industrial Zone, Ras Al Khaimah, United Arab Emirates" }],
    },
    {
      country: "Malaysia",
      code: "MY",
      places: [
        {
          name: "R.S. International Resources (M) Sdn. Bhd.",
          address: "1A Medan Bukit Indah 5, Taman Bukit Indah, Ampang, Selangor Darul Ehsan, Malaysia",
        },
      ],
    },
    {
      country: "Bahrain",
      code: "BH",
      places: [{ name: "R.S. International Real Estate", address: "Al Hoora, Manama, Bahrain" }],
    },
  ],
};

/**
 * /rs-updates — "RS Updates". Each story's label, title and text verbatim from the old
 * RS Update listing and its two posts; photos are the posts' own.
 */
export const UPDATES_PAGE = {
  tag: "(Company News)",
  title: "RS Updates",
  banner: `${UP}2023/02/Picture3.png`,
  stories: [
    {
      id: "zero-cost-recruitment",
      label: "Zero Cost Recruitment",
      title: "Rs International Works On A “Zero-Cost Recruitment” Policy!",
      images: [
        { src: `${UP}2023/02/Picture3.png`, alt: "Selected candidates holding their documents at the R.S. International office" },
        { src: `${UP}2023/02/Picture4.png`, alt: "A selected candidate holding his passport and documents", portrait: true },
      ],
      lead: "R.S. International focuses on providing a no-cost recruitment service. We do not charge any fees to workers or employees during the recruitment process.",
      body: [
        "A lot of workers who are willing to work abroad are required to pay a recruitment charge to an international recruitment agency. The recruiting fee is an expense of the employment recruitment procedure. This recruitment fee includes a free ticket, a Visa fee, a medical fee, and a variety of other fees and service charges. These costs may also result in the job seeker incurring a loan or debt with a high-interest rate.",
        "R.S. International has done a high rate of “Zero-cost recruitment” last year for the middle east and southeast Asian region. We have maintained our low-cost structure by providing employers with flexible matching algorithms and recruiting individuals according to their skills, needs, and preferences in order to help employers save not only time but money as well. Our process had made it easier for employers to find the best talent globally.",
      ],
    },
    {
      id: "physical-interviews",
      label: "Interview At Your Desired Location",
      title: "R.S. International Provides Physical Interviews At Your Desired Location!",
      images: [
        { src: `${UP}2023/02/Picture1.png`, alt: "Candidates completing a practical trade test during the interview" },
        { src: `${UP}2023/02/Picture2.png`, alt: "Candidates at work during the 3-day interview" },
      ],
      lead: "R.S. International aims at making all the procedures easy for our clients. Starting from 1-1 consultations to making the workers arrive safely we help you out in every bit of the journey.",
      body: [
        "On this journey, physical interview conduction is an important part and we had helped many clients get on a physical interview with the selected candidates.",
        "On 10 October, R.S. International conducted a 3-day long interview for a Bahrain-based company. The interview was held in the designated office and it was attended by representatives from both sides. This was an important step for the company as it would help them find the right candidate for their open position.",
        "After the interview conduction, a few candidates got selected and we helped them with the further procedure.",
      ],
    },
  ],
};

/**
 * /global — "Global Updates". Labels, titles and text verbatim from the old Global
 * Updates listing and its two posts (general industry news, not agency projects).
 */
export const GLOBAL_PAGE = {
  tag: "(Global Updates)",
  title: "Global Updates",
  banner: `${UP}2023/02/Marsa-Al-Arab.png`,
  // Old page: "THIS PAGE SHOWS GLOBAL UPPDATES AS IN GENERAL NOTION" (typo fixed)
  note: "This page shows global updates as in general notion",
  stories: [
    {
      id: "neom",
      label: "NEOM - Saudi Arabia",
      title: "The New City In Saudi Arabia- NEOM",
      images: [{ src: `${UP}2023/02/NEOM.png`, alt: "Architectural render of NEOM, Saudi Arabia" }],
      lead: "Creating a new city from scratch is an extremely challenging and daunting task. It requires careful planning, large investments of time and resources, and the ability to make sure the project stays on track throughout its duration.",
      body: [
        "Without proper management of such a large project, it can easily become derailed and lead to costly delays, with potentially disastrous consequences.",
        "NEOM is the perfect example of what a successful city-building project can look like. With careful planning and meticulous management, Saudi Arabia’s flagship business and tourism development stand as a testament to what is possible when ambition meets execution. This new city is being built in Saudi Arabia and was first shared by Prince Mohammed in 2017. Make NEOM your blueprint for success in 2030 and create your own dream city!",
      ],
    },
    {
      id: "marsa-al-arab",
      label: "Marsa Al Arab - Dubai",
      title: "The Marsa Al Arab Project-Dubai had extended the coastline of the mighty Burj Al Arab!",
      images: [{ src: `${UP}2023/02/Marsa-Al-Arab.png`, alt: "Render of the Marsa Al Arab islands beside the Burj Al Arab, Dubai" }],
      lead: "Dubai is a world-renowned city that has become a popular choice for tourists from across the globe. But, until now it has lacked something truly spectacular that would make it stand out from the rest.",
      body: [
        "People want something exclusive and extraordinary to experience in a city like Dubai, something that will leave them with memories to cherish for a lifetime.",
        "The Marsa Al Arab project will fulfill this wish of people by introducing two new islands in Dubai that had extended the coastline of the mighty Burj Al Arab by 1.5 miles! With an estimated worth of $1.7 billion, this endeavor is sure to become one of the most luxurious destinations in the world — offering an experience that won’t be found anywhere else!",
      ],
    },
  ],
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
  tag: "Advanced Recruitment Platform",
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
  tag: "Global Case Studies",
  headline: "Trusted by Leading Enterprises Worldwide.",
  headlineSplit: 4, // words in the dark lead of the two-tone heading
  subtitle: "See how world-class companies scale their workforce across borders with verified manpower deployment.",
  stories: [
    {
      id: "am-logistics",
      client: "AM Logistics",
      region: "United Kingdom",
      metric: "100% Audit Pass Rate",
      body: "Successfully onboarded and managed over 250 logistics drivers with zero compliance friction across annual UK audits.",
      image: `${UP}2023/01/Slider-2.jpg`,
    },
    {
      id: "al-qabdah",
      client: "Al Qabdah Contracting",
      region: "Middle East",
      metric: "48-Hour Mobilization",
      body: "Scaled engineering and technical teams across regional sites with fully verified visas and labor documentation.",
      image: `${UP}2023/01/Slider-4.png`,
    },
    {
      id: "skd",
      client: "SKD Group",
      region: "Southeast Asia",
      metric: "98% Retention Rate",
      body: "Optimized corporate and hospitality staffing through rigorous pre-screening and end-to-end recruitment pipelines.",
      image: `${UP}2023/02/home-photo0.jpg`,
      imagePosition: "object-top",
    },
  ],
};

/**
 * /clients — "Our Clients" page. Case-study text verbatim from the four original
 * case-study posts (the card shows the opening paragraph; "Read More" opens the rest).
 * Images and logos are the old page's own files; copy into /public before launch.
 */
const CL = `${UP}2023/02/`;
export const CLIENTS_PAGE = {
  tag: "(Our Clients)",
  title: "Our Clients",
  banner: `${UP}2023/01/our-client.png`,
  caseTag: "Case Studies",
  caseTitle: "Some Of Our Case Studies",
  logosTag: "Partners",
  logosTitle: "Our Clients",
  cta: "Read More",
  caseStudies: [
    {
      id: "skd-group",
      client: "SKD Group of Companies",
      image: `${CL}skd-group.png`,
      body: [
        "Finding reliable, experienced, and skilled staff can be a daunting task for many companies. With the ever-changing labor market and the need to stay ahead of the competition, it is important to recruit top-notch talent in a timely manner.",
        "Turning away potential customers due to a lack of resources can have a long-term impact on your company’s growth and reputation. Without the right staff, it can be difficult to ensure the quality of service and meet customer demands.",
        "The SKD Group of Companies offers a unique recruitment experience tailored to businesses looking to hire international workers. It is a Bahrain-based organization established in 1963. R.S. International has helped SKD Group of Companies in recruiting skilled personnel such as Mason, electricians, carpenters, Heavy vehicle drivers, and many more. We have an established process and well-trained recruiters ready to help you successfully find the right candidates for your team. Trust R.S.International for your next round of hiring and get the right people for the job, at an affordable price!",
      ],
    },
    {
      id: "kuwait-resource-house",
      client: "Kuwait Resource House",
      image: `${UP}2023/01/Kuwait-Resource-House.png`,
      body: [
        "Organizations in the defense industry require logistical support to complete their projects. Traditional logistics companies often lack the infrastructure, expertise, and capacity needed for reliable and efficient service.",
        "This often leads to delayed projects, overspending on resources, and difficulty in achieving optimal performance from staff and employees. Poor logistical services can cost organizations in the defense industry a fortune, not to mention the time wasted – potentially jeopardizing their reputation and success.",
        "With Kuwait Resource House (KRH), organizational needs are met quickly and efficiently. KRH has been providing dependable logistics services for over 30 years, with subsidiaries across multiple countries, 500 core staff members, and 8,000 employees deployed to various projects & clients. R.S. International had helped KRH over the last decade providing them with quality workers at a fraction of the cost.",
        "Recently, some modifications were made on the KRH side for “Zero Cost Recruitment,” and R.S. also contributed to the change by supplying workers with the “Zero Cost Recruitment” procedure.",
      ],
    },
    {
      id: "fgv-holding-berhad",
      client: "FGV Holding Berhad",
      image: `${CL}FGV-Holding-Berhad.png`,
      body: [
        "Recruitment can be a challenging process, with high costs associated with it. This is especially true for companies like FGV that have large workforces and need to find qualified candidates quickly and cost-effectively.",
        "The cost of recruitment can add up quickly, which could potentially burden the company’s budget and prevent it from expanding its operations. Furthermore, a lack of qualified candidates can lead to costly mistakes and delays in hiring.",
        "R.S. International has helped FGV overcome these challenges by providing zero-cost recruitment services from India for the company’s 45,000 employees. FGV focuses on a zero-cost recruitment process and R.S. International’s team has already successfully recruited many planters, supervisors, and managers for FGV in Malaysia. We help you save time & money so that you can focus on what matters most – running & growing your business.",
      ],
    },
    {
      id: "al-qabdah",
      client: "Al-Qabdah Global Building Contracting LLC",
      image: `${CL}Al-Qabdah.png`,
      body: [
        "Finding the right type of skilled and semi-skilled labor for your construction projects can be a challenging task. Not to mention, traditional recruitment processes are also time-consuming and costly.",
        "In this era of digital transformation, your construction business needs to adapt quickly to keep up with the competition. Time is of the essence and if you don’t find quality workers quickly, it could cost you dearly in terms of lost progress and lost profits.",
        "Al-Qabdah Global Building Contracting LLC trusts R.S. International to provide them with a wide variety of skilled and semi-skilled workers, including Painters, Plumbers, Storekeepers, Carpenters, and more. R.S. International ensures that they recruit the right people for each job so that your projects are completed on time and within your desired budget.",
      ],
    },
  ],
  logos: [
    { name: "United Plantations Berhad", logo: `${CL}UP.png` },
    { name: "Al Qabdah Building Contracting", logo: `${CL}Al-Qabdah-1.png` },
    { name: "FGV (Felda Global Ventures)", logo: `${CL}FGV.png` },
    { name: "Kuwait Resources House", logo: `${CL}KRH-2.png` },
    { name: "Sime Darby", logo: `${CL}Sime.png` },
    { name: "Simplex Infrastructures", logo: `${CL}simplex.png` },
    { name: "SKD Group", logo: `${CL}SKD.png` },
  ],
};

/**
 * /employers — "Choose Your Employee" talent database (copy from the old For Employer page).
 * Photos are that page's own images (480 × 315); copy into /public before launch.
 */
const EMP = `${UP}2023/02/`;
export const EMPLOYERS = {
  tag: "Employer Portal",
  title: "Choose Your Employee",
  subtitle: "Browse our pre-vetted, government-approved international workforce database.",
  banner: `${UP}2023/01/For-Employee-Main-Banner.png`,
  dbTag: "Sectors",
  dbTitle: "Available Database",
  cta: "Know More",
  // Every pool shares the same profile on the original page
  profile: [
    { id: "age", label: "Age Bracket", value: "19 – 45" },
    { id: "gender", label: "Gender", value: "Male / Female" },
    { id: "base", label: "Base Location", value: "Pan India, Nepal & Bangladesh" },
  ],
  sectors: [
    { id: "construction", title: "Construction", image: `${EMP}construction.jpg` },
    { id: "hospitality", title: "Hospitality", image: `${EMP}hospitality.jpg` },
    { id: "agriculture", title: "Agriculture", image: `${EMP}AGRICULTURE.jpg` },
    { id: "shipyard", title: "Shipyard", image: `${EMP}SHIPYARD.jpg` },
    { id: "management", title: "Management", image: `${EMP}MANAGEMENT.jpg` },
    { id: "facility", title: "Facility", image: `${EMP}FACILITY.jpg` },
  ],
};

/**
 * /jobs — "Job Openings" board. Titles, categories, types and locations as on the old
 * Jobs page; descriptions from each original post (old contact details left out: the
 * apply form sends to CONTACT). Filter options in the old dropdowns' order.
 */
export const JOBS = {
  tag: "Career Opportunities",
  title: "Job Openings",
  subtitle: "Explore verified international career opportunities with end-to-end visa and mobilization support.",
  searchPlaceholder: "Search job title or keyword...",
  filters: {
    category: { label: "All Job Category", options: ["Blacksmith", "Security Guard", "Construction", "Engineer"] },
    type: { label: "All Job Type", options: ["Full Time"] },
    location: { label: "All Job Location", options: ["Saudi Arabia", "Dubai", "Middle East"] },
  },
  cta: "More Details",
  listings: [
    {
      id: "security-guard-dubai",
      title: "GOLDEN OPPORTUNITIES FOR SECURITY GUARD JOB IN DUBAI",
      category: "SECURITY GUARD",
      location: "DUBAI",
      type: "Full Time",
      posted: "May 21, 2025",
      summary: "Client interview shortly. Share your documents through WhatsApp or email.",
      points: [],
    },
    {
      id: "blacksmith-saudi",
      title: "Job Openings for Stainless steel blacksmith for Factory in Saudi Arabia",
      category: "Blacksmith",
      location: "Saudi Arabia",
      type: "Full Time",
      posted: "May 21, 2025",
      summary: "For further information, contact our recruitment team.",
      points: [],
    },
    {
      id: "lightning-engineer",
      title: "Lightning Engineer",
      category: "Engineer",
      location: "MIDDLE EAST",
      type: "Full Time",
      posted: "January 24, 2023",
      points: [
        "Excellent knowledge of Avolites/GrandMA lighting desk and intelligent lighting equipment.",
        "Good understanding of lighting techniques",
        "Knowledge of Sound and AV equipment and its use",
        "A detailed-oriented person with the ability to work in a fast-paced environment",
        "At least 4-5 years of experience working as a lighting programmer.",
      ],
      salary: "RM 4500 - 5000",
    },
    {
      id: "audio-engineer",
      title: "Audio Engineer",
      category: "Construction",
      location: "MIDDLE EAST",
      type: "Full Time",
      posted: "January 19, 2023",
      points: [
        "Excellent knowledge of operating Midas/Behringer/Yamaha/Digico consoles.",
        "Good understanding of audio techniques",
        "Knowledge of Sound and AV equipment and it use",
        "At least 5 Years of experience working as an Audio Engineer",
      ],
    },
  ],
};
