import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly repo: Repository<Skill>,
  ) {}

  findAll(onlyPriority?: boolean) {
    if (onlyPriority) return this.repo.findBy({ priority: true });
    return this.repo.find({ order: { number: 'ASC' } });
  }

  findByName(name: string) {
    return this.repo.findOneBy({ name });
  }

  upsert(data: Partial<Skill>) {
    return this.repo.save(data);
  }
}
