/**
 * Single source of truth for all portfolio content.
 *
 * Edit copy here and the whole site updates — components never hard-code text.
 *
 * Provenance: everything below was already published on the previous site
 * (see content-structure.md) unless it is explicitly attributed to a source
 * note. Nothing is invented. Open `TODO(moulendra)` items before publishing.
 */

export const meta = {
  title: 'Moulendra Balaji — AI Engineer',
  // Unchanged from the previous site (index.html).
  description:
    'AI Engineer specializing in ML, Deep Learning, and Web Development. Building end-to-end AI solutions and scalable user interfaces.',
  canonical: 'https://moulendrabalajiportfolio.vercel.app/',
  themeColor: '#07080B',
  ogImage: '/images/brand/og-cover.png',
  ogImageAlt: 'Moulendra Balaji — AI Engineer, machine learning and research',
  resume: '/Moulendra_Balaji_Resume.pdf'
  // TODO(moulendra): drop the PDF at public/Moulendra_Balaji_Resume.pdf, or send me a
  // hosted link and I will swap this constant. The Resume button hides itself until
  // the file resolves, so there is no 404 in the meantime.
};

/* --------------------------------------------------------------- contact -- */

export const contact = {
  email: 'moulendrabalaji2007@gmail.com',
  phone: '8074061387',
  location: 'Hyderabad, Telangana, India',
  headline: "Let's build something intelligent.",
  sub: 'Open to collaborations on applied ML, research, and product engineering.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/MoulendraBalaji' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/moulendra-balaji-01979b325' },
    { label: 'Email', href: 'mailto:moulendrabalaji2007@gmail.com' }
  ]
};

/* ----------------------------------------------------------------- hero -- */

export const hero = {
  eyebrow: 'Bridging Intelligent Algorithms with Scalable Interfaces',
  name: 'Moulendra',
  nameAccent: 'Balaji',
  role: 'AI Engineer',
  // One-line value statement, taken verbatim from the site meta description.
  value:
    'AI Engineer specializing in ML, Deep Learning, and Web Development. Building end-to-end AI solutions and scalable user interfaces.',
  primaryCta: { label: 'View work', href: '#projects' },
  secondaryCta: { label: 'Read my research', href: '#research' },
  portrait: '/images/profile/portrait.webp',
  portraitAlt: '/images/profile/portrait-alt.webp'
};

/* ---------------------------------------------------------------- about -- */

export const about = {
  lead:
    'Engineering student at CRRAO AIMSCS, Hyderabad, specializing in Artificial Intelligence, Machine Learning, and Web Development. At 19, my focus is bridging the gap between intelligent algorithmic systems and clean, scalable user interfaces.',
  drives: {
    title: 'What Drives Me',
    items: [
      'Transforming complex data challenges into intuitive user experiences',
      'High-stakes environments — hackathons, national challenges, competitive benchmarks',
      'End-to-end ownership: from research paper to production deployment'
    ]
  },
  differentiators: {
    title: 'Key Differentiators',
    items: [
      'Practical experience across cross-platform apps, data-driven logistics dashboards, and deployed ML models',
      'Machine Learning Intern at FlyRank (flyrank.ai), completed September 2026',
      'Published CRDT database engine scoring 90% on Anvil L3 Benchmark'
    ]
  },
  portrait: '/images/profile/portrait-alt.webp',
  // Every figure below already appears on the published site or in the FlyRank
  // internship brief. Nothing new is claimed.
  stats: [
    { value: 90, suffix: '%', label: 'Anvil L3 benchmark score', hint: 'Conflict-Free Collaborative OLTP' },
    { value: 17, suffix: 'mo', label: 'of search data analysed', hint: 'FlyRank capstone' },
    { value: 79, prefix: '~', suffix: 'M', label: 'daily rows processed', hint: 'FlyRank capstone' },
    { value: 4, suffix: '', label: 'certifications earned', hint: 'HCL · IBM · Cisco · Google Cloud' }
  ]
};

/* ----------------------------------------------------------- experience -- */

// Declared up front: both the experience timeline and the research section link here.
const PAPER_URL = 'https://moulendrabalaji.github.io/Flyrank_ML_Works/';

export const experience = [
  {
    id: 'flyrank',
    company: 'FlyRank',
    companyUrl: 'https://flyrank.ai',
    logo: '/images/logos/flyrank.svg',
    role: 'Machine Learning Intern',
    location: 'Hyderabad, India',
    start: 'June 2026',
    end: 'Sep 2026',
    status: 'completed',
    featured: true,
    summary:
      'Search-intelligence platform. Built a query-concentration signal from 17 months of pseudonymized search-performance data and shipped a ranked editorial-review queue.',
    achievements: [
      'Built a query-concentration signal (Herfindahl–Hirschman Index over each page’s query portfolio) from 17 months of pseudonymized search-performance data (~79M daily rows, ~2.4M query-level observations, ~519K content pages across ~100 clients).',
      'Designed a leakage-safe evaluation: page-grouped, time-aware train/test split with explicit leakage audits.',
      'Benchmarked a trend-continuation baseline vs. logistic regression vs. LightGBM; best model reached AUC 0.66 and Precision@50 of 0.62 vs. 0.52 for the baseline (run `capstone-run-01`).',
      'Produced a ranked editorial-review queue with reason codes, and published the capstone research paper (August 2026).'
    ],
    tech: ['Python', 'DuckDB', 'scikit-learn', 'LightGBM', 'pandas'],
    links: [{ label: 'Read the research paper', href: PAPER_URL }]
  }
];

/* ------------------------------------------------------------- research -- */

export const research = {
  url: PAPER_URL,
  eyebrow: 'Published · August 2026 · FlyRank ML Internship Capstone',
  title: "Does Query-Portfolio Diversification Predict a Page's Resilience to Visibility Decline?",
  titleAccent: 'Resilience',
  summary:
    'Tests whether pages that rely on a narrow set of search queries are more likely to lose visibility. Builds a Herfindahl–Hirschman concentration signal over 17 months of pseudonymized data and compares a trend baseline, logistic regression, and gradient-boosted trees under a time-aware, page-grouped split. Findings are associational; no causal claims are made.',
  caveat: 'Associational findings, not causal claims.',
  preview: '/images/research/paper-preview.webp',
  previewMobile: '/images/research/paper-preview-mobile.webp',
  stats: [
    { value: 0.66, decimals: 2, label: 'AUC-ROC', hint: 'LightGBM' },
    { text: '0.62 vs 0.52', label: 'Precision@50', hint: 'LightGBM vs baseline' },
    { value: 79, prefix: '~', suffix: 'M', label: 'rows analysed', hint: 'daily, pseudonymized' },
    { value: 17, suffix: 'mo', label: 'of data', hint: 'time span' },
    { value: 14, label: 'engineered features', hint: 'incl. HHI' }
  ],
  comparison: {
    caption: 'Held-out performance by model. AUC-ROC and PR-AUC on the time-aware, page-grouped split.',
    series: [
      { key: 'baseline', label: 'Baseline', tone: 'dim', values: [0.585, 0.421, 0.52, 0.684] },
      { key: 'logistic', label: 'Logistic', tone: 'muted', values: [0.643, 0.469, 0.58, 0.739] },
      { key: 'lightgbm', label: 'LightGBM', tone: 'accent', values: [0.661, 0.487, 0.62, 0.762] }
    ],
    metrics: ['AUC-ROC', 'PR-AUC', 'Precision@50', 'NDCG@50']
  },
  decline: {
    caption: 'Forward 90-day decline rate by query-concentration tier.',
    note: 'High-concentration pages declined 11.4 percentage points more often (observed).',
    tiers: [
      { label: 'Low', range: 'HHI ≤ 0.2', value: 33.8 },
      { label: 'Medium', range: '0.2–0.5', value: 38.2 },
      { label: 'High', range: 'HHI > 0.5', value: 45.2 }
    ]
  },
  tags: ['Python', 'DuckDB', 'scikit-learn', 'LightGBM', 'Search Intelligence', 'Time-aware validation'],
  cta: 'Read the full paper ↗'
};

/* ------------------------------------------------------------- projects -- */

// Tags are short descriptors derived from each project's existing `role` field
// on the previous site — presentational only, no new claims.
export const projects = [
  {
    slug: 'query-portfolio-diversification',
    title: 'Query-Portfolio Diversification & Visibility Decline',
    category: 'Research',
    role: 'Published capstone research paper — FlyRank',
    description:
      'Tests whether pages that rely on a narrow set of search queries are more likely to lose visibility, using a Herfindahl–Hirschman concentration signal over 17 months of pseudonymized search-performance data.',
    highlights: [
      'Leakage-safe, time-aware, page-grouped evaluation',
      'Trend baseline vs. logistic regression vs. LightGBM',
      'AUC 0.66 · Precision@50 0.62 vs. 0.52 baseline'
    ],
    tech: ['Python', 'DuckDB', 'scikit-learn', 'LightGBM'],
    image: '/images/research/paper-preview.webp',
    cover: null,
    kind: 'paper',
    links: [{ label: 'Read the paper ↗', href: PAPER_URL, primary: true }]
  },
  {
    slug: 'conflict-free-collaborative-oltp',
    title: 'Conflict-Free Collaborative OLTP',
    category: 'Distributed Systems',
    role: 'CRDT Engine Developer — Pixel Pirates',
    badge: 'Anvil L3 Benchmark — 90%',
    description:
      'A masterless, local-first, peer-to-peer relational database engine powered by Conflict-Free Replicated Data Types (CRDTs). Supports offline-first operation, seamless multi-peer synchronization, and guaranteed 100% bit-identical state convergence across arbitrary network partitions.',
    highlights: [
      'Architected cell-level LWW-Registers and OR-Sets with Lamport clocks — preserved concurrent non-overlapping column updates without data loss',
      'Implemented a deterministic uniqueness protocol with post-merge resolution — enforced UNIQUE constraints across distributed peers without central coordination',
      'Designed configurable foreign-key policies (cascade, tombstone, orphan) — maintained referential integrity under network partitions',
      'Built continuous OpLog garbage collection with compaction — bounded metadata growth per row to distinct peer count'
    ],
    tech: ['Python', 'CRDT', 'LWW-Register', 'OR-Set', 'Lamport Clocks', 'Pytest', 'Docker'],
    image: '/images/projects/conflict-free-collaborative-oltp-cover.webp',
    cover: '/images/projects/conflict-free-collaborative-oltp-detail-1.webp',
    kind: 'project',
    links: [{ label: 'Code', href: 'https://github.com/SiddharthaMadireddy/Conflict-Free_Collaborative_OLTP' }]
  },
  {
    slug: 'scrybe-io',
    title: 'Scrybe.io — Text & Video Analyzer',
    category: 'AI / ML',
    role: 'AI Developer — The Synapse Squad',
    description:
      'An AI-driven evaluation platform that assesses video and audio responses against reference answers. Extracts media, performs high-fidelity transcription via Whisper, generates frame-by-frame visual insights via Gemini Vision, and verifies semantic similarity using all-mpnet-base-v2.',
    highlights: [
      'Engineered a multi-stage ML pipeline (FFmpeg → Whisper → Gemini Vision → Sentence-Transformers) — reduced evaluation latency while maintaining 95%+ transcription accuracy',
      'Implemented hybrid similarity scoring combining abstract semantic similarity with exact keyword overlap — achieved higher score predictability than cosine-only approaches',
      'Built FastAPI backend with async job processing — supported concurrent evaluation requests with real-time progress streaming',
      'Designed React + Vite frontend with glassmorphism UI and PDF report export — delivered polished UX for interview practice, presentations, and spoken assignments'
    ],
    tech: ['Python', 'FastAPI', 'React 19', 'Vite', 'OpenAI Whisper', 'Gemini Vision', 'Sentence-Transformers', 'all-mpnet-base-v2', 'FFmpeg', 'PyTorch', 'Docker'],
    image: '/images/projects/scrybe-io-cover.webp',
    cover: '/images/projects/scrybe-io-detail-1.webp',
    kind: 'project',
    links: [
      { label: 'Live demo ↗', href: 'https://moulendrabalaji.github.io/Scrybe.io-Text-And-Video-Analyzer/', primary: true },
      { label: 'Code', href: 'https://github.com/MoulendraBalaji/Scrybe.io-Text-And-Video-Analyzer' }
    ]
  },
  {
    slug: 'support-triage-environment',
    title: 'Support Triage Environment',
    category: 'AI Agents',
    role: 'AI Environment Developer',
    description:
      'A realistic simulation environment for training AI agents in customer support triage logic. Agents operate in a single-action command space — reading emails, querying customer metadata, searching knowledge bases — to decide whether to reply or escalate. Features tiered difficulty (Easy → Hard) with validated baseline scores.',
    highlights: [
      'Designed a structured action-observation space (read_email, lookup_customer, search_kb, reply, escalate) — enabled systematic RL/LLM agent training on real-world support flows',
      'Implemented three difficulty tiers with escalating reasoning requirements — validated progressive skill acquisition (Easy: 1.0, Medium: 0.9, Hard: 0.8 baseline scores)',
      'Built a Docker containerized environment with REST API — enabled headless evaluation and CI/CD integration for agent pipelines',
      'Authored a comprehensive inference script with GPT-4o baseline — provided a reproducible benchmark for agent comparison'
    ],
    tech: ['Python', 'OpenAI', 'Docker', 'REST API', 'FastAPI', 'UV', 'Hugging Face'],
    image: '/images/projects/support-triage-environment-cover.webp',
    cover: '/images/projects/support-triage-environment-detail-1.webp',
    kind: 'project',
    links: [{ label: 'Code', href: 'https://github.com/MoulendraBalaji/support_triage' }]
  }
];

/* --------------------------------------------------------------- skills -- */

// Existing site taxonomy, preserved. FlyRank-derived tools (DuckDB, LightGBM,
// pandas) are folded into the groups they belong to; duplicates removed.
export const skills = [
  {
    label: 'AI & ML',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LightGBM', 'Hugging Face', 'LangChain', 'OpenAI', 'Gemini', 'Whisper', 'Sentence-Transformers']
  },
  { label: 'Backend', items: ['FastAPI', 'Python', 'Node.js', 'REST APIs', 'PostgreSQL'] },
  { label: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind'] },
  { label: 'Data & DevOps', items: ['pandas', 'DuckDB', 'Docker', 'Git', 'Power BI', 'DAX', 'MySQL', 'CI/CD'] },
  { label: 'Core CS', items: ['CRDT', 'Distributed Systems', 'Data Structures', 'Algorithms', 'OOP'] }
];

// Preserved verbatim from the existing marquee strip.
export const marqueeItems = [
  'React', 'Python', 'PyTorch', 'FastAPI', 'Docker', 'Gemini AI',
  'Whisper', 'LangChain', 'TensorFlow', 'Hugging Face', 'PostgreSQL', 'Git'
];

/* ------------------------------------------------- achievements & education -- */

export const achievements = {
  competitions: [
    { title: 'IIT Hyderabad', detail: 'Sustainable Development / Cybersecurity Challenges' },
    { title: 'Anvil Hackathon (Scalar)', detail: 'Built Conflict-Free Collaborative OLTP (90% L3 Benchmark)' },
    { title: 'SIH (Smart India Hackathon)', detail: 'Participant' }
  ],
  certifications: [
    { name: 'HCL Volt MX Application Development', issuer: 'HCL Technologies' },
    { name: 'IBM Data Visualization', issuer: 'IBM / Cognitive Class' },
    { name: 'HTML & CSS Essentials', issuer: 'Cisco Networking Academy' },
    { name: 'Google Cloud Expertise', issuer: 'Google Cloud' }
  ]
};

export const education = [
  {
    degree: 'B.Tech in Computer Science (AI & ML Specialization)',
    school: 'CRRAO AIMSCS, Hyderabad',
    period: '2023 – 2027',
    logo: '/images/logos/crrao-aimscs.svg'
  }
];

/* ------------------------------------------------------------------ nav -- */

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' }
];

export const sectionMeta = {
  hero: { index: null, label: 'Index' },
  about: { index: '01', label: 'About' },
  experience: { index: '02', label: 'Experience' },
  research: { index: '03', label: 'Research' },
  projects: { index: '04', label: 'Projects' },
  skills: { index: '05', label: 'Skills' },
  achievements: { index: '06', label: 'Achievements' },
  contact: { index: '07', label: 'Contact' }
};