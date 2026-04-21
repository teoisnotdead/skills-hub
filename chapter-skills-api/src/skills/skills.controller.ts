import { Controller, Get, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  findAll(@Query('priority') priority?: string) {
    return this.service.findAll(priority === 'true');
  }
}
