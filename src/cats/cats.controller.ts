import { Controller, Get, Param, Post } from '@nestjs/common';
import { Cat, CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat | string> {
    const num_id = Number(id);
    return this.catsService.findOne(num_id);
  }

  @Post()
  create(): string {
    return 'This action creates a cat';
  }
}
