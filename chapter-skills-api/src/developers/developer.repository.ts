import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Developer } from './developer.entity';
import { DeveloperSkill } from './developer-skill.entity';

export interface DeveloperFilter {
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

@Injectable()
export class DeveloperRepository {
  constructor(
    @InjectRepository(Developer)
    private readonly repo: Repository<Developer>,
    @InjectRepository(DeveloperSkill)
    private readonly developerSkillRepo: Repository<DeveloperSkill>,
  ) {}

  async findAllPaginated(filters: DeveloperFilter): Promise<PaginatedDevelopers> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 12));

    const qb = this.repo
      .createQueryBuilder('dev')
      .leftJoinAndSelect('dev.developerSkills', 'ds')
      .leftJoinAndSelect('ds.skill', 'skill')
      .leftJoinAndSelect('ds.level', 'level');

    if (filters.name) {
      qb.andWhere('LOWER(dev.name) LIKE LOWER(:name)', { name: `%${filters.name}%` });
    }
    if (filters.mlLevel) {
      qb.andWhere('LOWER(dev.mlLevel) LIKE LOWER(:mlLevel)', { mlLevel: `%${filters.mlLevel}%` });
    }
    if (filters.skillName) {
      qb.andWhere('LOWER(skill.name) LIKE LOWER(:skillName)', { skillName: `%${filters.skillName}%` });
    }
    if (filters.levelName) {
      qb.andWhere('LOWER(level.name) = LOWER(:levelName)', { levelName: filters.levelName });
    }
    if (filters.onlyPriority) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM developer_skills ds_p
          INNER JOIN skills s_p ON ds_p.skill_id = s_p.id
          WHERE ds_p.developer_id = dev.id
          AND s_p.priority = true
        )`,
      );
    }

    const total = await qb.getCount();
    qb.orderBy('dev.name', 'ASC').skip((page - 1) * limit).take(limit);
    const data = await qb.getMany();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findOneById(id: number): Promise<Developer | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['developerSkills', 'developerSkills.skill', 'developerSkills.level'],
    });
  }

  findByName(name: string): Promise<Developer | null> {
    return this.repo.findOneBy({ name });
  }

  save(developer: Partial<Developer>): Promise<Developer> {
    return this.repo.save(developer);
  }

  saveDeveloperSkill(ds: Partial<DeveloperSkill>): Promise<DeveloperSkill> {
    return this.developerSkillRepo.save(ds);
  }
}
