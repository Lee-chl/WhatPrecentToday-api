import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthUser, CurrentUser } from '../common/current-user.decoraor';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '모든 유저 찾기' })
  findAll(@CurrentUser('role') userRole: string) {
    return this.usersService.findAll(userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: '한명 유저 찾기' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.findOne(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 제거' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.usersService.remove(id, user);
  }
}
