import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { ExcelParserService } from './excel-parser.service';
import { DevelopersModule } from '../developers/developers.module';
import { SkillsModule } from '../skills/skills.module';
import { KnowledgeLevelsModule } from '../knowledge-levels/knowledge-levels.module';

@Module({
  imports: [DevelopersModule, SkillsModule, KnowledgeLevelsModule],
  controllers: [ImportController],
  providers: [ImportService, ExcelParserService],
})
export class ImportModule {}
