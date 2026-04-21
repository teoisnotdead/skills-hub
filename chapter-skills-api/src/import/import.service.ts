import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { DevelopersService } from '../developers/developers.service';
import { SkillsService } from '../skills/skills.service';
import { KnowledgeLevelsService } from '../knowledge-levels/knowledge-levels.service';
import { ExcelParserService, ParsedDeveloper, ParsedSkill } from './excel-parser.service';
import { Developer } from '../developers/developer.entity';
import { Skill } from '../skills/skill.entity';
import { DeveloperSkill } from '../developers/developer-skill.entity';
import { KnowledgeLevel } from '../knowledge-levels/knowledge-level.entity';

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly excelParser: ExcelParserService,
    private readonly developersService: DevelopersService,
    private readonly skillsService: SkillsService,
    private readonly knowledgeLevelsService: KnowledgeLevelsService,
  ) {}

  async importFromBuffer(buffer: Buffer): Promise<ImportResult> {
    await this.knowledgeLevelsService.seed();

    const { developers: parsedDevs, skills: parsedSkills, skippedRows } = this.excelParser.parse(buffer);

    if (parsedDevs.length === 0) {
      return {
        imported: 0,
        skipped: skippedRows,
        errors: ['No se encontraron desarrolladores en la fila de headers (fila 7)'],
      };
    }

    const errors: string[] = [];
    let imported = 0;

    await this.dataSource.transaction(async (manager) => {
      const levelsByName = await this.loadLevelsByName();
      const devEntities = await this.upsertDevelopers(parsedDevs, manager);
      imported = await this.processSkills(parsedSkills, devEntities, levelsByName, manager, errors);
    });

    this.logger.log(`Import completado: ${imported} relaciones, ${skippedRows} filas vacías`);
    return { imported, skipped: skippedRows, errors };
  }

  private async loadLevelsByName(): Promise<Map<string, KnowledgeLevel>> {
    const all = await this.knowledgeLevelsService.findAll();
    return new Map(all.map((l) => [l.name.toLowerCase(), l]));
  }

  private async upsertDevelopers(
    parsedDevs: ParsedDeveloper[],
    manager: EntityManager,
  ): Promise<Map<string, Developer>> {
    const devEntities = new Map<string, Developer>();

    for (const parsed of parsedDevs) {
      let entity = await this.developersService.findByName(parsed.name);
      if (!entity) {
        entity = await manager.save(Developer, { name: parsed.name, mlLevel: parsed.mlLevel });
      }
      devEntities.set(parsed.name, entity);
    }

    return devEntities;
  }

  private async processSkills(
    parsedSkills: ParsedSkill[],
    devEntities: Map<string, Developer>,
    levelsByName: Map<string, KnowledgeLevel>,
    manager: EntityManager,
    errors: string[],
  ): Promise<number> {
    let imported = 0;

    for (const parsedSkill of parsedSkills) {
      let skill = await this.skillsService.findByName(parsedSkill.name);
      if (!skill) {
        skill = await manager.save(Skill, {
          number: parsedSkill.number,
          name: parsedSkill.name,
          priority: parsedSkill.priority,
        });
      }

      for (const { devName, levelName } of parsedSkill.levels) {
        const level = levelsByName.get(levelName.toLowerCase());
        if (!level) {
          const msg = `Nivel desconocido: "${levelName}" — ${devName} / ${parsedSkill.name}`;
          this.logger.warn(msg);
          errors.push(`Nivel desconocido: "${levelName}"`);
          continue;
        }

        const developer = devEntities.get(devName);
        if (!developer) continue;

        await manager.save(DeveloperSkill, { developer, skill, level });
        imported++;
      }
    }

    return imported;
  }
}
