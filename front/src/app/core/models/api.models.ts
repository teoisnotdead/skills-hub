export interface KnowledgeLevel {
  id: number;
  name: string;
  color: string;
  order: number;
}

export interface Skill {
  id: number;
  number: number;
  name: string;
  priority: boolean;
  expectedExperto: string | null;
  expectedGeneral: string | null;
}

export interface DeveloperSkill {
  id: number;
  skill: Skill;
  level: KnowledgeLevel;
}

export interface Developer {
  id: number;
  name: string;
  mlLevel: string | null;
  developerSkills: DeveloperSkill[];
}

export interface DeveloperFilters {
  name?: string;
  skillName?: string;
  levelName?: string;
  mlLevel?: string;
  onlyPriority?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedDevelopers {
  data: Developer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
