import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  get(@Request() req: any) {
    return this.preferencesService.get(req.user.userId);
  }

  @Patch()
  update(@Body() dto: UpdatePreferencesDto, @Request() req: any) {
    return this.preferencesService.update(req.user.userId, dto);
  }
}
