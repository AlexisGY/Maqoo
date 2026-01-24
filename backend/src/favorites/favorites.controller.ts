import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@Request() req: any) {
    return this.favoritesService.list(req.user.userId);
  }

  @Post(':recipeId/toggle')
  toggle(@Param('recipeId') recipeId: string, @Request() req: any) {
    return this.favoritesService.toggle(req.user.userId, recipeId);
  }
}
