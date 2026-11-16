import type { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  profile: {
    id: 'profile-sri-manikanta-korivi',
    name: 'Sri Manikanta Korivi',
    tagline: 'Building Modern Web Experiences with AI and Software Development.',
    subheadline:
      'Computer Science undergraduate at KITS Akshar Institute of Technology, interested in software development, modern web experiences, and practical AI-assisted workflows.',
    status: 'published',
    education: {
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      institution: 'KITS Akshar Institute of Technology',
      startYear: '2024',
      endYear: '2028',
      currentStatus: 'Undergraduate Student (2024–2028)',
    },
    bio: [
      'I am an engineering student at KITS Akshar Institute of Technology focused on software development and building thoughtful, dependable web applications. My interests center on modern frontend experiences, core programming fundamentals, and leveraging practical AI-assisted workflows to build better software.',
      'As Tech Lead of KITS Innovation Club (Generation 2), I work with fellow students to foster collaborative technical exploration, guide project discussions, and promote structured student innovation.',
    ],
    githubUrl: 'https://github.com/srimanikantakorivi',
    statusBadge: 'Undergraduate • KITS Akshar Institute of Technology',
    roles: [
      'B.Tech CSE Student (2024–2028)',
      'Tech Lead — KITS Innovation Club (Gen 2)',
      'Certified LLM Security Professional',
    ],
    updatedAt: '2026-11-14T17:00:00Z',
  },

  skills: [
    {
      id: 'cat-languages',
      category: 'Core Programming Fundamentals',
      description: 'Foundational programming languages studied and applied through coursework and projects.',
      sortOrder: 1,
      items: [
        { name: 'C fundamentals', isHighlight: true },
        { name: 'Python fundamentals', isHighlight: true },
        { name: 'Java fundamentals', isHighlight: true },
        { name: 'JavaScript fundamentals', isHighlight: true },
      ],
    },
    {
      id: 'cat-web',
      category: 'Web Technologies',
      description: 'Markup, styling, UI libraries, and backend service integration applied in projects.',
      sortOrder: 2,
      items: [
        { name: 'HTML', isHighlight: true },
        { name: 'CSS', isHighlight: true },
        { name: 'React', isHighlight: true },
        { name: 'Supabase', note: 'Project Experience', isHighlight: true },
      ],
    },
    {
      id: 'cat-tools',
      category: 'Tools & Workflows',
      description: 'Version control and applied artificial intelligence utilities for development.',
      sortOrder: 3,
      items: [
        { name: 'Git / GitHub', isHighlight: true },
        { name: 'AI Tools & Prompt Engineering', isHighlight: true },
      ],
    },
  ],

  projects: [
    {
      id: 'proj-idea-portal',
      slug: 'innovation-and-idea-submission-portal',
      title: 'Innovation & Idea Submission Portal',
      subtitle: 'Student innovation and idea submission platform',
      summary:
        'A web platform designed to streamline student idea submissions, categorize project proposals, and facilitate review workflows. Developed as an internship-related project using React and Supabase.',
      description:
        'The Innovation & Idea Submission Portal is an internship-related web application designed to provide a structured digital environment for student innovators. Built with React on the frontend and integrated with Supabase for data handling and persistence, the platform organizes proposals by category and enables structured tracking of submission states.',
      category: 'Full-Stack Web',
      featured: true,
      status: 'published',
      isVerified: true,
      projectStage: 'live',
      stageLabel: 'Internship Project • Live Project',
      techStack: ['React', 'Supabase', 'JavaScript', 'HTML/CSS'],
      tags: ['Internship Project', 'Student Innovation', 'Full-Stack Web', 'Supabase'],
      liveUrl: 'https://idea-portal-sandy.vercel.app',
      githubUrl: 'https://github.com/srimanikantakorivi/idea-portal',
      keyHighlights: [
        'Structured proposal submission interface for student concepts and project pitches',
        'Supabase backend integration for database storage and data management',
        'Responsive layout designed for student accessibility on desktop and mobile browsers',
        'Public source repository maintained on GitHub and deployed on Vercel',
      ],
      challenges: [
        'Organizing a clear multi-step submission form for diverse student ideas',
        'Connecting frontend component state cleanly with Supabase database tables',
      ],
      sortOrder: 1,
      createdAt: '2024-10-01',
      updatedAt: '2026-11-14',
    },
    {
      id: 'proj-vehicle-failure-investigation',
      slug: 'vehicle-failure-investigation-prototype',
      title: 'Vehicle Failure Investigation Prototype',
      subtitle: 'Automotive failure-investigation concept from an Agentic AI hackathon',
      summary:
        'A hackathon concept prototype exploring automotive failure analysis through API integration and workflow orchestration. Features experimental diagnostic flows with partial integrations.',
      description:
        'Developed as a collaborative hackathon prototype during an Agentic AI hackathon, this project investigates how API-driven workflow orchestration and targeted AI prompting can assist in analyzing automotive failure reports. Note that this project represents an experimental proof-of-concept with unfinished integrations, rather than a production-ready application.',
      category: 'AI Workflow Prototype',
      featured: true,
      status: 'published',
      isVerified: true,
      projectStage: 'hackathon_prototype',
      stageLabel: 'Agentic AI Hackathon Prototype (Work in Progress)',
      techStack: ['Python fundamentals', 'Workflow Orchestration', 'API Integration', 'AI Prompting'],
      tags: ['Agentic AI', 'Hackathon Concept', 'Prototype', 'Automotive'],
      liveUrl: undefined, // No demo link invented per instruction
      githubUrl: undefined, // Dedicated repo not yet published; do not use general profile URL
      keyHighlights: [
        'Conceptual multi-step diagnostic workflow formulated during an Agentic AI hackathon',
        'Exploration of API connectors to correlate symptom inputs with potential component faults',
        'Iterative prompt engineering designed to assist in structuring failure investigation summaries',
        'Documented prototype architecture highlighting areas for future integration completion',
      ],
      challenges: [
        'Orchestrating multi-step workflow logic under hackathon timeframe constraints',
        'Balancing experimental API calls against partial subsystem data availability',
      ],
      sortOrder: 2,
      createdAt: '2026-06-20',
      updatedAt: '2026-11-14',
    },
    {
      id: 'proj-portfolio-v2',
      slug: 'personal-portfolio-v2',
      title: 'Personal Portfolio V2',
      subtitle: 'Light minimal editorial portfolio architecture',
      summary:
        'An in-progress personal portfolio project in active workspace development. Built with Vite, React, TypeScript, and Tailwind CSS, prepared for future Supabase headless CMS integration.',
      description:
        'Personal Portfolio V2 is an ongoing engineering project focused on crafting a polished, accessible personal portfolio. Engineered with an editorial Light Minimal aesthetic, it features warm ivory backdrops, graphite typography, and muted sage accents, alongside typed reusable content blocks structured for single-admin Supabase management in Phase 2.',
      category: 'Web Development',
      featured: true,
      status: 'published',
      isVerified: true,
      projectStage: 'in_progress',
      stageLabel: 'In Active Workspace Development (Not Deployed)',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML/CSS'],
      tags: ['Web Development', 'Editorial Design', 'In Progress', 'Vite + React'],
      liveUrl: undefined, // Marked as in-progress until actually deployed
      githubUrl: undefined, // Dedicated repo not yet published; do not use general profile URL
      keyHighlights: [
        'Editorial typography pairing Instrument Serif display accents with Plus Jakarta Sans',
        'Typed content block system supporting rich text, documents, and flexible media attachments',
        'Strict truth-in-content policy hiding missing elements rather than fabricating placeholders',
        'Zero bloated dependencies with instantaneous Vite compilation and strict ESLint compliance',
      ],
      challenges: [
        'Establishing distinctive editorial elegance while preserving high performance and fast load times',
        'Structuring modular content block types to easily connect with PostgreSQL in Phase 2',
      ],
      sortOrder: 3,
      createdAt: '2026-11-14',
      updatedAt: '2026-11-14',
    },
  ],

  experiences: [
    {
      id: 'exp-kits-innovation-lead',
      title: 'Tech Lead',
      organization: 'KITS Innovation Club, Generation 2',
      period: 'Generation 2',
      location: 'KITS Akshar Institute of Technology',
      focus: 'Focus on collaboration, technical initiatives, and student innovation.',
      isVerified: true,
      status: 'published',
      bullets: [
        'Serving as Tech Lead for KITS Innovation Club Generation 2, collaborating on technical initiatives.',
        'Promoting structured student innovation and collaborative project ideation among peer engineering students.',
      ],
      skills: ['Technical Initiatives', 'Student Innovation', 'Collaboration'],
      sortOrder: 1,
    },
    {
      id: 'exp-btech-cse',
      title: 'B.Tech in Computer Science and Engineering',
      organization: 'KITS Akshar Institute of Technology',
      period: '2024 – 2028',
      location: 'Campus Undergraduate Program',
      focus: 'Undergraduate computer science coursework and hands-on software development.',
      isVerified: true,
      status: 'published',
      bullets: [
        'Pursuing foundational coursework in Programming (C, Python, Java), Data Structures, and Computer Science principles.',
        'Applying web technologies (HTML, CSS, JavaScript, React) to build practical student projects.',
        'Exploring modern AI-assisted development tools and prompt engineering workflows.',
      ],
      skills: ['C Fundamentals', 'Python Fundamentals', 'Java Fundamentals', 'Web Fundamentals'],
      sortOrder: 2,
    },
  ],

  certifications: [
    {
      id: 'cert-cllmsp',
      title: 'Certified LLM Security Professional (CLLMSP)',
      acronym: 'CLLMSP',
      issuer: 'Red Team Leaders',
      issueDate: 'July 2026',
      isVerified: true,
      status: 'published',
      topics: [
        'LLM Red Teaming Concepts',
        'Prompt Injection Defenses',
        'Model Context Isolation',
        'AI Safety Guardrails',
        'Input & Output Sanitization',
      ],
      sortOrder: 1,
    },
  ],

  contactChannels: [
    {
      id: 'channel-github',
      platform: 'GitHub',
      label: 'github.com/srimanikantakorivi',
      value: 'https://github.com/srimanikantakorivi',
      url: 'https://github.com/srimanikantakorivi',
      isVerified: true,
      isVisible: true,
    },
  ],
};
