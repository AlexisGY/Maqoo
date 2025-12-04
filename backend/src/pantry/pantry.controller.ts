import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PantryItemDto } from './dto/pantry-item.dto';

@Controller('pantry')
@UseGuards(JwtAuthGuard)
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Get()
  list(@Request() req: any) {
    return this.pantryService.list(req.user.userId);
  }

  @Post()
  add(@Body() dto: PantryItemDto, @Request() req: any) {
    return this.pantryService.add(req.user.userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: PantryItemDto, @Request() req: any) {
    return this.pantryService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.pantryService.remove(req.user.userId, id);
  }
}
