import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeLevel } from './knowledge-level.entity';
import { KnowledgeLevelsService } from './knowledge-levels.service';
import { KnowledgeLevelsController } from './knowledge-levels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeLevel])],
  controllers: [KnowledgeLevelsController],
  providers: [KnowledgeLevelsService],
  exports: [KnowledgeLevelsService],
})
export class KnowledgeLevelsModule {}
