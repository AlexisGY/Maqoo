import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [PreferencesController],
  providers: [PreferencesService, PrismaService, JwtStrategy, JwtAuthGuard],
})
export class PreferencesModule {}
