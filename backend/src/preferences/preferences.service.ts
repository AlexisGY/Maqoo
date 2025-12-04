import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string) {
    return this.prisma.preference.findUnique({ where: { userId } });
  }

  async update(userId: string, data: UpdatePreferencesDto) {
    const existing = await this.prisma.preference.findUnique({ where: { userId } });
    if (existing) {
      return this.prisma.preference.update({ where: { userId }, data });
    }
    return this.prisma.preference.create({ data: { ...data, userId } });
  }
}
