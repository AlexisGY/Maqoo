import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { PantryModule } from './pantry/pantry.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PreferencesModule } from './preferences/preferences.module';
import { PrismaService } from './prisma/prisma.service';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [AuthModule, RecipesModule, PantryModule, FavoritesModule, PreferencesModule, IngredientsModule],
  providers: [PrismaService],
})
export class AppModule {}
