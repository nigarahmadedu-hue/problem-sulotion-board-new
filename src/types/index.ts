export type CategoryType = 
  | 'agriculture' 
  | 'education' 
  | 'healthcare' 
  | 'environment' 
  | 'business' 
  | 'technology'
  | 'transport'
  | 'government'
  | 'community';

export type ValidationStage = 
  | 'Submitted' 
  | 'Discussion' 
  | 'Research' 
  | 'Validated' 
  | 'Prototype' 
  | 'MVP' 
  | 'Launched';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  location: string;
  description: string;
  fullDescription?: string[];
  stage: ValidationStage;
  currentStageIndex: number; // 0 to 6
  ideasCount: number;
  commentsCount: number;
  votesCount?: number;
  hasVoted?: boolean;
  author: {
    name: string;
    initials: string;
    timeAgo: string;
  };
  whoFacesIt?: string[];
  evidence?: {
    references: number;
    images: number;
    solutions: number;
  };
  lookingForRoles?: {
    role: string;
    countNeeded: number;
  }[];
}

export interface Idea {
  id: string;
  problemId: string;
  numberLabel: string; // e.g., "IDEA 01"
  title: string;
  description: string;
  votes: number;
  commentsCount: number;
  whoWouldUse?: string;
  neededToBuild?: string;
}

export interface Comment {
  id: string;
  problemId: string;
  author: {
    name: string;
    initials: string;
  };
  timeAgo: string;
  content: string;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleCategory: 'ai' | 'developer' | 'designer' | 'researcher' | 'expert';
  bio: string;
  skills: string[];
  location?: string;
}

export interface CategorySummary {
  name: string;
  slug: CategoryType;
  icon: string;
  problemCount: number;
}

export interface DashboardStats {
  problemsSubmitted: number;
  problemsDelta: string;
  ideasProposed: number;
  ideasDelta: string;
  votesReceived: number;
  votesDelta: string;
  collaborations: number;
  collaborationsDelta: string;
}

export interface ActiveTeam {
  id: string;
  name: string;
  initials: string;
  membersCount: number;
}
