import { Injectable } from '@nestjs/common';
import { DeveloperRepository, DeveloperFilter, PaginatedDevelopers } from './developer.repository';
import { Developer } from './developer.entity';
import { DeveloperSkill } from './developer-skill.entity';

@Injectable()
export class DevelopersService {
  constructor(private readonly developerRepository: DeveloperRepository) {}

  findAll(filters: DeveloperFilter = {}): Promise<PaginatedDevelopers> {
    return this.developerRepository.findAllPaginated(filters);
  }

  findOne(id: number): Promise<Developer | null> {
    return this.developerRepository.findOneById(id);
  }

  findByName(name: string): Promise<Developer | null> {
    return this.developerRepository.findByName(name);
  }

  save(developer: Partial<Developer>): Promise<Developer> {
    return this.developerRepository.save(developer);
  }

  saveDeveloperSkill(ds: Partial<DeveloperSkill>): Promise<DeveloperSkill> {
    return this.developerRepository.saveDeveloperSkill(ds);
  }
}
