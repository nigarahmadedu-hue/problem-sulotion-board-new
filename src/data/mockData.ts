import { Problem, Idea, Comment, Person, CategorySummary, DashboardStats, ActiveTeam } from '@/types';

export const CATEGORIES: CategorySummary[] = [
  { name: 'Agriculture', slug: 'agriculture', icon: '🌱', problemCount: 42 },
  { name: 'Education', slug: 'education', icon: '🎓', problemCount: 38 },
  { name: 'Healthcare', slug: 'healthcare', icon: '🏥', problemCount: 31 },
  { name: 'Environment', slug: 'environment', icon: '🌍', problemCount: 27 },
  { name: 'Business', slug: 'business', icon: '💼', problemCount: 36 },
  { name: 'Technology', slug: 'technology', icon: '💻', problemCount: 44 },
];

export const PROBLEMS: Problem[] = [
  {
    id: '1',
    slug: 'farmers-soil-nutrients',
    title: 'Farmers cannot easily test soil nutrients',
    category: 'agriculture',
    categoryLabel: 'Agriculture',
    location: 'Punjab, Pakistan',
    description: "Small farmers often don't have affordable access to reliable soil testing before planting.",
    fullDescription: [
      "Farmers need to understand the condition of their soil before deciding what crops to plant and which nutrients may be required.",
      "Traditional soil testing can require specialized equipment, laboratory access and additional time. For smaller farmers, these barriers can make regular testing difficult."
    ],
    stage: 'Discussion',
    currentStageIndex: 1, // 0: Submitted, 1: Discussion, 2: Research, 3: Validated, 4: Prototype, 5: MVP, 6: Launched
    ideasCount: 12,
    commentsCount: 34,
    author: {
      name: 'Ahmed Khan',
      initials: 'AK',
      timeAgo: 'Submitted 4 days ago',
    },
    whoFacesIt: [
      'Farmers',
      'Small agricultural businesses',
      'Agricultural consultants',
      'Rural communities',
    ],
    evidence: {
      references: 3,
      images: 4,
      solutions: 2,
    },
    lookingForRoles: [
      'AI Engineer',
      'Developer',
      'Domain Expert',
      'Designer',
    ],
  },
  {
    id: '2',
    slug: 'practical-projects-discovery',
    title: 'Students struggle to find practical projects',
    category: 'education',
    categoryLabel: 'Education',
    location: 'Karachi, Pakistan',
    description: 'Students learn theory but often don\'t know which real-world problems they can build solutions for.',
    fullDescription: [
      "Students learn theory in universities and online bootcamps, but often lack exposure to genuine community and industrial problems.",
      "A centralized board connecting academia to real ground-level problems is crucial for bridging the skills gap."
    ],
    stage: 'Research',
    currentStageIndex: 2,
    ideasCount: 21,
    commentsCount: 48,
    author: {
      name: 'Mariam Ali',
      initials: 'MA',
      timeAgo: 'Submitted 1 week ago',
    },
    whoFacesIt: ['Undergraduate Students', 'Self-taught Coders', 'Teachers', 'University Labs'],
    evidence: { references: 5, images: 2, solutions: 3 },
    lookingForRoles: [
      'Educator',
      'Full Stack Dev',
    ],
  },
  {
    id: '3',
    slug: 'unpredictable-waste-collection',
    title: 'Neighborhood waste collection is unpredictable',
    category: 'environment',
    categoryLabel: 'Environment',
    location: 'Lahore, Pakistan',
    description: "Residents don't know when collection trucks will arrive in their neighborhood.",
    fullDescription: [
      "Municipal waste collection timing varies widely each week, resulting in accumulated trash bins and roadside dumping.",
      "Live tracking or predictive route notifications could vastly clean up residential zones."
    ],
    stage: 'Validated',
    currentStageIndex: 3,
    ideasCount: 17,
    commentsCount: 29,
    author: {
      name: 'Usman Shah',
      initials: 'US',
      timeAgo: 'Submitted 2 weeks ago',
    },
    whoFacesIt: ['Residents', 'Sanitation Staff', 'Municipal Councils'],
    evidence: { references: 2, images: 6, solutions: 1 },
    lookingForRoles: [
      'IoT Specialist',
      'Mobile Dev',
    ],
  },
  {
    id: '4',
    slug: 'patients-medical-reports',
    title: 'Patients struggle to understand medical reports',
    category: 'healthcare',
    categoryLabel: 'Healthcare',
    location: 'Islamabad, Pakistan',
    description: 'Medical reports often contain terminology that is difficult for ordinary patients to understand.',
    fullDescription: [
      "Patients receive complex blood work and pathology reports with abbreviations, high-range flags, and clinical Latin phrases.",
      "Patients often turn to unverified internet search results and panic before seeing their primary physician."
    ],
    stage: 'Discussion',
    currentStageIndex: 1,
    ideasCount: 9,
    commentsCount: 21,
    author: {
      name: 'Dr. Tariq',
      initials: 'DT',
      timeAgo: 'Submitted 3 days ago',
    },
    whoFacesIt: ['Patients', 'Elderly Caregivers', 'General Practitioners'],
    evidence: { references: 4, images: 1, solutions: 2 },
    lookingForRoles: [
      'Medical Consultant',
      'NLP Engineer',
    ],
  },
  {
    id: '5',
    slug: 'small-business-inventory',
    title: 'Small businesses struggle with inventory tracking',
    category: 'business',
    categoryLabel: 'Business',
    location: 'Multan, Pakistan',
    description: 'Many small retailers still rely on notebooks and spreadsheets to track inventory.',
    fullDescription: [
      "Physical ledger recording leads to inventory leakage, deadstock, and delayed reordering for small mom-and-pop stores.",
      "Existing enterprise ERPs are overly complex and cost-prohibitive for neighborhood retail owners."
    ],
    stage: 'Prototype',
    currentStageIndex: 4,
    ideasCount: 15,
    commentsCount: 37,
    author: {
      name: 'Farhan Zaidi',
      initials: 'FZ',
      timeAgo: 'Submitted 5 days ago',
    },
    whoFacesIt: ['Retailers', 'Wholesalers', 'Shopkeepers'],
    evidence: { references: 3, images: 3, solutions: 4 },
    lookingForRoles: [
      'Full Stack Dev',
      'UI Designer',
    ],
  },
  {
    id: '6',
    slug: 'digital-knowledge-organization',
    title: 'People struggle to organize their digital knowledge',
    category: 'technology',
    categoryLabel: 'Technology',
    location: 'Global',
    description: 'Information is spread across notes, documents, bookmarks and different applications.',
    fullDescription: [
      "Modern knowledge workers accumulate fragments in Notion, Apple Notes, browser tabs, screenshots, and chat messages.",
      "Context-switching and search fragmentation destroy creative synthesis."
    ],
    stage: 'Submitted',
    currentStageIndex: 0,
    ideasCount: 26,
    commentsCount: 51,
    author: {
      name: 'Nigar Ahmad',
      initials: 'NA',
      timeAgo: 'Submitted 1 day ago',
    },
    whoFacesIt: ['Researchers', 'Developers', 'Writers', 'Students'],
    evidence: { references: 6, images: 5, solutions: 5 },
    lookingForRoles: [
      'Frontend Engineer',
      'Vector DB Expert',
    ],
  },
];

export const IDEAS: Idea[] = [
  {
    id: 'idea-1',
    problemId: '1',
    numberLabel: 'IDEA 01',
    title: 'Mobile soil testing',
    description: 'A portable soil testing kit connected to a mobile application that provides farmers with quick results.',
    votes: 128,
    commentsCount: 18,
    whoWouldUse: 'Small farmers and local cooperative managers',
    neededToBuild: 'Low-cost chemical test strips, optical sensor, React Native mobile app',
  },
  {
    id: 'idea-2',
    problemId: '1',
    numberLabel: 'IDEA 02',
    title: 'IoT soil sensor',
    description: 'Low-cost sensors that continuously monitor soil conditions and send measurements to a dashboard.',
    votes: 94,
    commentsCount: 11,
    whoWouldUse: 'Medium-to-large farm owners and agronomists',
    neededToBuild: 'ESP32 microcontrollers, capacitive soil sensors, solar battery pack, LoRaWAN gateway',
  },
  {
    id: 'idea-3',
    problemId: '1',
    numberLabel: 'IDEA 03',
    title: 'AI-based nutrient prediction',
    description: 'Use historical soil, weather and crop data to estimate nutrient requirements for different fields.',
    votes: 76,
    commentsCount: 9,
    whoWouldUse: 'Agricultural planners, consultants, and farmers with smartphone access',
    neededToBuild: 'Satellite imagery integration, historical meteorological records, gradient-boosting model',
  },
];

export const COMMENTS: Comment[] = [
  {
    id: 'c1',
    problemId: '1',
    author: {
      name: 'Mariam Ali',
      initials: 'MA',
    },
    timeAgo: '2 hours ago',
    content: 'Has anyone looked into existing low-cost testing kits available in rural areas?',
  },
  {
    id: 'c2',
    problemId: '1',
    author: {
      name: 'Usman Shah',
      initials: 'US',
    },
    timeAgo: '5 hours ago',
    content: 'I think accessibility and price would be important factors for any proposed solution.',
  },
];

export const PEOPLE: Person[] = [
  {
    id: 'p1',
    name: 'Ahmed Khan',
    initials: 'AK',
    role: 'AI Engineer',
    roleCategory: 'ai',
    bio: 'Building AI systems, agents and intelligent applications.',
    skills: ['AI', 'Python', 'LLMs', 'RAG'],
    location: 'Lahore, Pakistan',
  },
  {
    id: 'p2',
    name: 'Mariam Ali',
    initials: 'MA',
    role: 'UX Designer',
    roleCategory: 'designer',
    bio: 'Designing simple digital experiences for complex problems.',
    skills: ['UX', 'UI', 'Research', 'Figma'],
    location: 'Karachi, Pakistan',
  },
  {
    id: 'p3',
    name: 'Usman Shah',
    initials: 'US',
    role: 'Full Stack Developer',
    roleCategory: 'developer',
    bio: 'Building scalable web applications and backend systems.',
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'React'],
    location: 'Islamabad, Pakistan',
  },
  {
    id: 'p4',
    name: 'Fatima Sheikh',
    initials: 'FS',
    role: 'Agriculture Researcher',
    roleCategory: 'researcher',
    bio: 'Researching agricultural systems and sustainable farming.',
    skills: ['Agriculture', 'Research', 'Soil'],
    location: 'Faisalabad, Pakistan',
  },
];

export const DASHBOARD_STATS: DashboardStats = {
  problemsSubmitted: 4,
  problemsDelta: '+1 this month',
  ideasProposed: 12,
  ideasDelta: '+4 this month',
  votesReceived: 286,
  votesDelta: '+42 this month',
  collaborations: 7,
  collaborationsDelta: '2 active teams',
};

export const ACTIVE_TEAMS: ActiveTeam[] = [
  { id: 't1', name: 'SoilSense', initials: 'AK', membersCount: 4 },
  { id: 't2', name: 'EduBuild', initials: 'MA', membersCount: 5 },
];

export const CURRENT_USER: Person = {
  id: 'current-user',
  name: 'Nigar Ahmad',
  initials: 'NA',
  role: 'Product Designer & Builder',
  roleCategory: 'designer',
  bio: 'Passionate about building software that addresses real human needs, community tools, and sustainable development.',
  skills: ['Product Design', 'Next.js', 'User Research', 'Design Systems', 'Systems Thinking'],
  location: 'Peshawar, Pakistan',
};
