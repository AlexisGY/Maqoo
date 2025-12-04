import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngredientsService, type IngredientRecognitionResult, type UploadedIngredientFile } from './ingredients.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post('recognize')
  @UseInterceptors(FileInterceptor('image'))
  recognize(@UploadedFile() file: UploadedIngredientFile): Promise<IngredientRecognitionResult> {
    if (!file) {
      throw new BadRequestException('Debes adjuntar una imagen para analizar.');
    }

    return this.ingredientsService.recognize(file);
  }
}
