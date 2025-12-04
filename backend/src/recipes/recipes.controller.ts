import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() dto: CreateRecipeDto, @Request() req: any) {
    return this.recipesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('maxTime') maxTime: number,
    @Query('healthy') healthy: string,
    @Query('economical') economical: string,
    @Request() req: any,
  ) {
    return this.recipesService.findAll(req.user.userId, {
      page: Number(page),
      limit: Number(limit),
      maxTime: maxTime ? Number(maxTime) : undefined,
      healthy: healthy !== undefined ? healthy === 'true' : undefined,
      economical: economical !== undefined ? economical === 'true' : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto, @Request() req: any) {
    return this.recipesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.remove(req.user.userId, id);
  }
}
