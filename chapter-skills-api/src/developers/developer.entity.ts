import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeveloperSkill } from './developer-skill.entity';

@Entity('developers')
export class Developer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  mlLevel: string | null;

  @OneToMany(() => DeveloperSkill, (ds) => ds.developer, { cascade: true })
  developerSkills: DeveloperSkill[];
}
