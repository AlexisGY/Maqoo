import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, JwtStrategy, JwtAuthGuard],
})
export class FavoritesModule {}
