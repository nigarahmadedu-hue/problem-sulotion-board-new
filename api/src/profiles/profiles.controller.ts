import { Controller, Get, Patch, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  /** GET /profiles/me/dashboard — JWT protected, returns full personal dashboard data */
  @UseGuards(JwtAuthGuard)
  @Get('me/dashboard')
  getDashboard(@Request() req: any) {
    return this.profilesService.getDashboard(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.findOne(id);
  }

  /** PATCH /profiles/me — JWT protected, self-only */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateMe(req.user.userId, dto);
  }
}
