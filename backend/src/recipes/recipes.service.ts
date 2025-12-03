import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateRecipeDto) {
    return this.prisma.recipe.create({ data: { ...data, userId } });
  }

  async findAll(userId: string, params: { page?: number; limit?: number; maxTime?: number; healthy?: boolean; economical?: boolean }) {
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
}
