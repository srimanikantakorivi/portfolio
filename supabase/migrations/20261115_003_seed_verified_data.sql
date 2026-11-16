-- Migration 003: Seed Verified Portfolio Data
-- Seeds confirmed information for Sri Manikanta Korivi
-- Adheres to strict truth-in-content rules: no placeholder emails, no unsupported dates, and no profile URLs as repository links.

-- 1. Seed Profile
insert into public.portfolio_profile (
    id, name, tagline, subheadline, education, bio, github_url, status_badge, roles, status
) values (
    'profile-sri-manikanta-korivi',
    'Sri Manikanta Korivi',
    'Building Modern Web Experiences with AI and Software Development.',
    'Computer Science undergraduate at KITS Akshar Institute of Technology, interested in software development, modern web experiences, and practical AI-assisted workflows.',
    jsonb_build_object(
        'degree', 'B.Tech',
        'field', 'Computer Science and Engineering',
        'institution', 'KITS Akshar Institute of Technology',
        'startYear', '2024',
        'endYear', '2028',
        'currentStatus', 'Undergraduate Student (2024–2028)'
    ),
    array[
        'I am an engineering student at KITS Akshar Institute of Technology focused on software development and building thoughtful, dependable web applications. My interests center on modern frontend experiences, core programming fundamentals, and leveraging practical AI-assisted workflows to build better software.',
        'As Tech Lead of KITS Innovation Club (Generation 2), I work with fellow students to foster collaborative technical exploration, guide project discussions, and promote structured student innovation.'
    ],
    'https://github.com/srimanikantakorivi',
    'Undergraduate • KITS Akshar Institute of Technology',
    array[
        'B.Tech CSE Student (2024–2028)',
        'Tech Lead — KITS Innovation Club (Gen 2)',
        'Certified LLM Security Professional'
    ],
    'published'
) on conflict (id) do update set
    name = excluded.name,
    tagline = excluded.tagline,
    subheadline = excluded.subheadline,
    education = excluded.education,
    bio = excluded.bio,
    github_url = excluded.github_url;

-- 2. Seed Projects (Strictly no GitHub profile URL used as repository URL)
insert into public.portfolio_projects (
    id, slug, title, subtitle, summary, description, category, featured, project_stage, stage_label,
    status, is_verified, tech_stack, tags, live_url, github_url, key_highlights, challenges, sort_order
) values
(
    'proj-idea-portal',
    'innovation-and-idea-submission-portal',
    'Innovation & Idea Submission Portal',
    'Student innovation and idea submission platform',
    'A web platform designed to streamline student idea submissions, categorize project proposals, and facilitate review workflows. Developed as an internship-related project using React and Supabase.',
    'The Innovation & Idea Submission Portal is an internship-related web application designed to provide a structured digital environment for student innovators. Built with React on the frontend and integrated with Supabase for data handling and persistence, the platform organizes proposals by category and enables structured tracking of submission states.',
    'Full-Stack Web',
    true,
    'live',
    'Internship Project • Public Demo',
    'published',
    true,
    array['React', 'Supabase', 'JavaScript', 'HTML/CSS'],
    array['Internship Project', 'Student Innovation', 'Full-Stack Web', 'Supabase'],
    'https://idea-portal-sandy.vercel.app',
    'https://github.com/srimanikantakorivi/idea-portal',
    array[
        'Structured proposal submission interface for student concepts and project pitches',
        'Supabase backend integration for database storage and data management',
        'Responsive layout designed for student accessibility on desktop and mobile browsers',
        'Public source repository maintained on GitHub and deployed on Vercel'
    ],
    array[
        'Organizing a clear multi-step submission form for diverse student ideas',
        'Connecting frontend component state cleanly with Supabase database tables'
    ],
    1
),
(
    'proj-vehicle-failure-investigation',
    'vehicle-failure-investigation-prototype',
    'Vehicle Failure Investigation Prototype',
    'Automotive failure-investigation concept from an Agentic AI hackathon',
    'A hackathon concept prototype exploring automotive failure analysis through API integration and workflow orchestration. Features experimental diagnostic flows with partial integrations.',
    'Developed as a collaborative hackathon prototype during an Agentic AI hackathon, this project investigates how API-driven workflow orchestration and targeted AI prompting can assist in analyzing automotive failure reports. Note that this project represents an experimental proof-of-concept with unfinished integrations, rather than a production-ready application.',
    'AI Workflow Prototype',
    true,
    'hackathon_prototype',
    'Agentic AI Hackathon Prototype (Work in Progress)',
    'published',
    true,
    array['Python fundamentals', 'Workflow Orchestration', 'API Integration', 'AI Prompting'],
    array['Agentic AI', 'Hackathon Concept', 'Prototype', 'Automotive'],
    null,
    null, -- Strictly null: no dedicated repository confirmed, profile URL omitted per rule
    array[
        'Conceptual multi-step diagnostic workflow formulated during an Agentic AI hackathon',
        'Exploration of API connectors to correlate symptom inputs with potential component faults',
        'Iterative prompt engineering designed to assist in structuring failure investigation summaries',
        'Documented prototype architecture highlighting areas for future integration completion'
    ],
    array[
        'Orchestrating multi-step workflow logic under hackathon timeframe constraints',
        'Balancing experimental API calls against partial subsystem data availability'
    ],
    2
),
(
    'proj-portfolio-v2',
    'personal-portfolio-v2',
    'Personal Portfolio V2',
    'Light minimal editorial portfolio architecture',
    'An in-progress personal portfolio project in active workspace development. Built with Vite, React, TypeScript, and Tailwind CSS, prepared for future Supabase headless CMS integration.',
    'Personal Portfolio V2 is an ongoing engineering project focused on crafting a polished, accessible personal portfolio. Engineered with an editorial Light Minimal aesthetic, it features warm ivory backdrops, graphite typography, and muted sage accents, alongside typed reusable content blocks structured for single-admin Supabase management in Phase 2.',
    'Web Development',
    true,
    'in_progress',
    'In Active Workspace Development (Not Deployed)',
    'published',
    true,
    array['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML/CSS'],
    array['Web Development', 'Editorial Design', 'In Progress', 'Vite + React'],
    null,
    null, -- Strictly null: internal workspace project, profile URL omitted per rule
    array[
        'Editorial typography pairing Instrument Serif display accents with Plus Jakarta Sans',
        'Typed content block system supporting rich text, documents, and flexible media attachments',
        'Strict truth-in-content policy hiding missing elements rather than fabricating placeholders',
        'Zero bloated dependencies with instantaneous Vite compilation and strict ESLint compliance'
    ],
    array[
        'Establishing distinctive editorial elegance while preserving high performance and fast load times',
        'Structuring modular content block types to easily connect with PostgreSQL in Phase 2'
    ],
    3
)
on conflict (slug) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    summary = excluded.summary,
    description = excluded.description,
    tech_stack = excluded.tech_stack,
    live_url = excluded.live_url,
    github_url = excluded.github_url;

-- 3. Seed Skills
insert into public.portfolio_skills (id, category, description, items, sort_order, status)
values
(
    'cat-languages',
    'Core Programming Fundamentals',
    'Foundational programming languages studied and applied through coursework and projects.',
    jsonb_build_array(
        jsonb_build_object('name', 'C fundamentals', 'isHighlight', true),
        jsonb_build_object('name', 'Python fundamentals', 'isHighlight', true),
        jsonb_build_object('name', 'Java fundamentals', 'isHighlight', true),
        jsonb_build_object('name', 'JavaScript fundamentals', 'isHighlight', true)
    ),
    1,
    'published'
),
(
    'cat-web',
    'Web Technologies',
    'Markup, styling, UI libraries, and backend service integration applied in projects.',
    jsonb_build_array(
        jsonb_build_object('name', 'HTML', 'isHighlight', true),
        jsonb_build_object('name', 'CSS', 'isHighlight', true),
        jsonb_build_object('name', 'React', 'isHighlight', true),
        jsonb_build_object('name', 'Supabase', 'note', 'Project Experience', 'isHighlight', true)
    ),
    2,
    'published'
),
(
    'cat-tools',
    'Tools & Workflows',
    'Version control and applied artificial intelligence utilities for development.',
    jsonb_build_array(
        jsonb_build_object('name', 'Git / GitHub', 'isHighlight', true),
        jsonb_build_object('name', 'AI Tools & Prompt Engineering', 'isHighlight', true)
    ),
    3,
    'published'
)
on conflict (id) do update set
    category = excluded.category,
    description = excluded.description,
    items = excluded.items;

-- 4. Seed Experience (Strictly verified leadership details, no unsupported dates or unverified workshop claims)
insert into public.portfolio_experience (
    id, title, organization, period, location, focus, is_verified, status, bullets, skills, sort_order
) values
(
    'exp-kits-innovation-lead',
    'Tech Lead',
    'KITS Innovation Club, Generation 2',
    'Generation 2',
    'KITS Akshar Institute of Technology',
    'Focus on collaboration, technical initiatives, and student innovation.',
    true,
    'published',
    array[
        'Focusing on collaboration, student technical initiatives, and student innovation.',
        'Engaging in student technical exploration as Tech Lead for Generation 2.'
    ],
    array['Collaboration', 'Technical Initiatives', 'Student Innovation'],
    1
),
(
    'exp-btech-cse',
    'B.Tech in Computer Science and Engineering',
    'KITS Akshar Institute of Technology',
    '2024 – 2028',
    'Campus Undergraduate Program',
    'Undergraduate computer science coursework and hands-on software development.',
    true,
    'published',
    array[
        'Pursuing foundational coursework in Programming (C, Python, Java), Data Structures, and Computer Science principles.',
        'Applying web technologies (HTML, CSS, JavaScript, React) to build practical student projects.',
        'Exploring modern AI-assisted development tools and prompt engineering workflows.'
    ],
    array['C Fundamentals', 'Python Fundamentals', 'Java Fundamentals', 'Web Fundamentals'],
    2
)
on conflict (id) do update set
    title = excluded.title,
    organization = excluded.organization,
    period = excluded.period,
    bullets = excluded.bullets,
    focus = excluded.focus;

-- 5. Seed Certifications
insert into public.portfolio_certifications (
    id, title, acronym, issuer, issue_date, is_verified, status, topics, allow_download, sort_order
) values (
    'cert-cllmsp',
    'Certified LLM Security Professional (CLLMSP)',
    'CLLMSP',
    'Red Team Leaders',
    'July 2026',
    true,
    'published',
    array[
        'LLM Red Teaming Concepts',
        'Prompt Injection Defenses',
        'Model Context Isolation',
        'AI Safety Guardrails',
        'Input & Output Sanitization'
    ],
    false,
    1
) on conflict (id) do update set
    title = excluded.title,
    issuer = excluded.issuer,
    issue_date = excluded.issue_date,
    topics = excluded.topics;

-- 6. Seed Contact Channels
insert into public.portfolio_contact_channels (
    id, platform, label, value, url, is_verified, is_visible
) values (
    'channel-github',
    'GitHub',
    'github.com/srimanikantakorivi',
    'https://github.com/srimanikantakorivi',
    'https://github.com/srimanikantakorivi',
    true,
    true
) on conflict (id) do update set
    label = excluded.label,
    url = excluded.url;

-- 7. Seed Site Settings (No placeholder emails; resume download disabled until upload)
insert into public.portfolio_site_settings (
    id, site_title, meta_description, admin_email, allow_resume_download
) values (
    'primary',
    'Sri Manikanta Korivi — Software Development & Modern Web Experiences',
    'B.Tech Computer Science & Engineering student at KITS Akshar Institute of Technology. Building modern web experiences and exploring practical AI-assisted workflows.',
    null,
    false
) on conflict (id) do update set
    site_title = excluded.site_title,
    meta_description = excluded.meta_description;
