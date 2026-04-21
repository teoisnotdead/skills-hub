import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Developer } from './developer.entity';
import { DeveloperSkill } from './developer-skill.entity';
import { DeveloperRepository } from './developer.repository';
import { DevelopersService } from './developers.service';
import { DevelopersController } from './developers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Developer, DeveloperSkill])],
  controllers: [DevelopersController],
  providers: [DeveloperRepository, DevelopersService],
  exports: [DevelopersService],
})
export class DevelopersModule {}
