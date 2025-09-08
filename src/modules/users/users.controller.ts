import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationOptions } from '../../utils/pagination';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '建立新使用者' })
  @ApiResponse({ status: 201, description: '成功建立使用者' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '取得使用者列表' })
  @ApiResponse({ status: 200, description: '成功取得使用者列表' })
  findAll(@Query() paginationOptions: PaginationOptions) {
    return this.usersService.findAll(paginationOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: '根據 ID 取得使用者' })
  @ApiResponse({ status: 200, description: '成功取得使用者' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
