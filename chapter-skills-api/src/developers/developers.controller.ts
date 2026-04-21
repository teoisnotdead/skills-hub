import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { FindDevelopersDto } from './dto/find-developers.dto';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly service: DevelopersService) {}

  @Get()
  findAll(@Query() filters: FindDevelopersDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const developer = await this.service.findOne(id);
    if (!developer) throw new NotFoundException(`Developer #${id} no encontrado`);
    return developer;
  }
}
