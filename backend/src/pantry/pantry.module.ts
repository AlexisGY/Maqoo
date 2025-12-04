import { Module } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { PantryController } from './pantry.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [PantryController],
  providers: [PantryService, PrismaService, JwtStrategy, JwtAuthGuard],
})
export class PantryModule {}
