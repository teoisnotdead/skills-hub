import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeLevel } from './knowledge-level.entity';

@Injectable()
export class KnowledgeLevelsService {
  constructor(
    @InjectRepository(KnowledgeLevel)
    private readonly repo: Repository<KnowledgeLevel>,
  ) {}

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  findByName(name: string) {
    return this.repo.findOneBy({ name });
  }

  async seed() {
    const levels = [
      { name: 'Experto', color: '#FF69B4', order: 1 },
      { name: 'General', color: '#87CEEB', order: 2 },
    ];
    for (const level of levels) {
      const exists = await this.repo.findOneBy({ name: level.name });
      if (!exists) await this.repo.save(this.repo.create(level));
    }
  }

  create(data: Partial<KnowledgeLevel>) {
    return this.repo.save(this.repo.create(data));
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
