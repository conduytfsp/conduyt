
export const seedProfile = {
  id: 'usr_2481',
  firstName: 'Adeeba',
  lastName: 'Siddiqi',
  avatarUrl: null,
  professionalTitle: 'Senior React & Tailwind Developer',
  bio: 'I build fast, accessible web applications end-to-end — from data modelling to pixel-perfect UI. Over the last 4 years I have shipped dashboards, marketplaces, and internal tools for startups across fintech and healthtech, with a strong focus on clean architecture and clear client communication.',
  skills: ['React', 'TypeScript', 'Spring Boot', 'MySQL', 'Tailwind CSS', 'Figma', 'Node.js', 'PostgreSQL'],
  email: 'adeeba.siddiqi@example.com',
  emailVerified: true,
  emailVisible: false,
};

export const seedPortfolio = {
  resumeUrl: null,
  resumeFileName: null,
  githubUrl: 'https://github.com/adeeba031',
  linkedinUrl: 'https://linkedin.com/in/adeeba',
  portfolioUrl: 'https://adeeba.dev',
};

export const seedApplications = [
  {
    id: 'app_1001',
    jobTitle: 'Redesign of Internal Analytics Dashboard',
    fixedBudget: 1800,
    clientName: 'Northwind Analytics',
    clientType: 'Startup',
    clientEmail: null,
    appliedDate: '2026-07-28',
    status: 'applied',
    coverLetter:
      'Hi team, I have redesigned three analytics dashboards this year with a focus on data density without clutter. I would love to bring that experience to Northwind — happy to walk through my process on a quick call.',
  },
  {
    id: 'app_1002',
    jobTitle: 'Landing Page for SaaS Launch',
    fixedBudget: 650,
    clientName: 'Loop Labs',
    clientType: 'Agency',
    clientEmail: null,
    appliedDate: '2026-07-22',
    status: 'shortlisted',
    coverLetter:
      'I specialize in high-converting SaaS landing pages built with React and Framer Motion. Attached is a similar project I shipped for a fintech client last quarter.',
  },
  {
    id: 'app_1003',
    jobTitle: 'E-commerce Checkout Flow Rebuild',
    fixedBudget: 2400,
    clientName: 'Verdant Goods',
    clientType: 'Individual',
    clientEmail: 'priya@verdantgoods.com',
    appliedDate: '2026-06-30',
    status: 'hired',
    coverLetter:
      'Checkout flow optimization is my specialty — I have taken three stores from ~2% to 4%+ conversion through form design and reduced friction.',
  },
  {
    id: 'app_1004',
    jobTitle: 'API Integration for Booking System',
    fixedBudget: 1200,
    clientName: 'Harbor Stays',
    clientType: 'Startup',
    clientEmail: 'dev@harborstays.io',
    appliedDate: '2026-05-14',
    status: 'completed',
    coverLetter: 'I have integrated Stripe and calendar sync APIs across five booking platforms.',
  },
  {
    id: 'app_1005',
    jobTitle: 'Portfolio Site for Photographer',
    fixedBudget: 400,
    clientName: 'Elena M.',
    clientType: 'Individual',
    clientEmail: 'elena.m@example.com',
    appliedDate: '2026-04-02',
    status: 'completed',
    coverLetter: 'Minimal, image-forward portfolio sites are one of my favorite kinds of build.',
  },
  {
    id: 'app_1006',
    jobTitle: 'Internal CRM Bug Fixes',
    fixedBudget: 900,
    clientName: 'Pallet & Co',
    clientType: 'Agency',
    clientEmail: null,
    appliedDate: '2026-07-05',
    status: 'rejected',
    coverLetter: 'I have worked extensively with legacy CRM codebases and enjoy untangling them.',
  },
  {
    id: 'app_1007',
    jobTitle: 'Mobile-First Marketing Site',
    fixedBudget: 700,
    clientName: 'Fernbank Studio',
    clientType: 'Agency',
    clientEmail: null,
    appliedDate: '2026-06-11',
    status: 'withdrawn',
    coverLetter: 'Excited to bring a mobile-first approach to this marketing refresh.',
  },
];

export const seedAnalytics = {
  totalApplications: 7,
  activeContracts: 1,
  completedJobs: 2,
  totalEarned: 3600,
  winRate: 43,
  rejectedOrGhosted: 2,
  monthlyApplications: [
    { month: 'Feb', applications: 3, hires: 1 },
    { month: 'Mar', applications: 4, hires: 1 },
    { month: 'Apr', applications: 2, hires: 1 },
    { month: 'May', applications: 5, hires: 1 },
    { month: 'Jun', applications: 4, hires: 1 },
    { month: 'Jul', applications: 3, hires: 2 },
  ],
};

export const seedSecurity = {
  twoFactorEnabled: false,
};
