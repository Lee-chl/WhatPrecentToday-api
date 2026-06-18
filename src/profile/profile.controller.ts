import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthUser, CurrentUser } from '../common/current-user.decoraor';

@Controller('profile')
@ApiTags('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: '프로파일 생성' })
  create(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.profileService.create(createProfileDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: '프로파일 확인' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.profileService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '프로파일 수정' })
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.profileService.update(+id, updateProfileDto, user);
  }
}
