import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { KnowledgeLevelsService } from './knowledge-levels.service';
import { CreateKnowledgeLevelDto } from './dto/create-knowledge-level.dto';

@Controller('knowledge-levels')
export class KnowledgeLevelsController {
  constructor(private readonly service: KnowledgeLevelsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateKnowledgeLevelDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
