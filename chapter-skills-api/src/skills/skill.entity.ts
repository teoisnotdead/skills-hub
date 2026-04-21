import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeveloperSkill } from '../developers/developer-skill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column({ default: false })
  priority: boolean;

  @Column({ nullable: true })
  expectedExperto: number;

  @Column({ nullable: true })
  expectedGeneral: number;

  @OneToMany(() => DeveloperSkill, (ds) => ds.skill)
  developerSkills: DeveloperSkill[];
}
