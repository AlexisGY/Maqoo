import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PantryItemDto } from './dto/pantry-item.dto';

@Injectable()
export class PantryService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.pantryItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  add(userId: string, data: PantryItemDto) {
    return this.prisma.pantryItem.create({ data: { ...data, userId, name: data.name.toLowerCase().trim() } });
  }

  async update(userId: string, id: string, data: PantryItemDto) {
    await this.ensureOwned(userId, id);
    return this.prisma.pantryItem.update({ where: { id }, data: { ...data, name: data.name.toLowerCase().trim() } });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwned(userId, id);
    await this.prisma.pantryItem.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureOwned(userId: string, id: string) {
    const item = await this.prisma.pantryItem.findFirst({ where: { id, userId } });
    if (!item) {
      throw new NotFoundException('Pantry item not found');
    }
    return item;
  }
}
