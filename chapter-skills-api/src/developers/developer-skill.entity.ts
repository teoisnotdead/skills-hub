import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Developer } from './developer.entity';
import { Skill } from '../skills/skill.entity';
import { KnowledgeLevel } from '../knowledge-levels/knowledge-level.entity';

@Entity('developer_skills')
export class DeveloperSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Developer, (dev) => dev.developerSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'developer_id' })
  developer: Developer;

  @ManyToOne(() => Skill, (skill) => skill.developerSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => KnowledgeLevel, (level) => level.developerSkills, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'level_id' })
  level: KnowledgeLevel | null;
}
