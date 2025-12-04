import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { defaultRecipes } from './recipes.seed';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateRecipeDto) {
    return this.prisma.recipe.create({ data: { ...data, userId } });
  }

  async findAll(userId: string, params: { page?: number; limit?: number; maxTime?: number; healthy?: boolean; economical?: boolean }) {
    await this.ensureSeeded(userId);

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 50) : 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (params.maxTime) {
      where.tiempo = { lte: params.maxTime };
    }
    if (typeof params.healthy === 'boolean') {
      where.saludable = params.healthy;
    }
    if (typeof params.economical === 'boolean') {
      where.economico = params.economical;
    }

    const [items, total] = await Promise.all([
      this.prisma.recipe.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, id: string) {
    const recipe = await this.prisma.recipe.findFirst({ where: { id, userId } });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    return recipe;
  }

  async update(userId: string, id: string, data: UpdateRecipeDto) {
    await this.findOne(userId, id);
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.recipe.delete({ where: { id } });
    return { deleted: true };
  }

  private normalizeIngredients(ingredients: string[]): string[] {
    return ingredients.map((ing) => ing.toLowerCase().trim());
  }

  private async ensureSeeded(userId: string): Promise<void> {
    const existing = await this.prisma.recipe.count({ where: { userId } });
    if (existing > 0) {
      return;
    }

    const data = defaultRecipes.map((recipe) => ({
      ...recipe,
      ingredientes: this.normalizeIngredients(recipe.ingredientes),
      userId,
    }));

    await this.prisma.recipe.createMany({ data });
  }
}
