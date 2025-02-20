import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './interfaces/profile.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() profile: Profile): Profile {
    return this.profilesService.create(profile);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Profile {
    return this.profilesService.findByUserId(Number(userId));
  }
}
