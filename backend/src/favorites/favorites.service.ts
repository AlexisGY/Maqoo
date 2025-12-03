import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.favorite.findMany({ where: { userId }, include: { recipe: true } });
  }

  async toggle(userId: string, recipeId: string) {
    const recipe = await this.prisma.recipe.findFirst({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const existing = await this.prisma.favorite.findFirst({ where: { userId, recipeId } });
    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, recipeId } });
    return { favorited: true };
  }
}
