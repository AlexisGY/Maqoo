import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService, JwtStrategy, JwtAuthGuard],
})
export class IngredientsModule {}
