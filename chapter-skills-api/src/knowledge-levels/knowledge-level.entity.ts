import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeveloperSkill } from '../developers/developer-skill.entity';

@Entity('knowledge_levels')
export class KnowledgeLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => DeveloperSkill, (ds) => ds.level)
  developerSkills: DeveloperSkill[];
}
