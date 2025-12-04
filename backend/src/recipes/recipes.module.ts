import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, PrismaService, JwtStrategy, JwtAuthGuard],
})
export class RecipesModule {}
