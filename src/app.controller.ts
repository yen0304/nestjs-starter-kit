import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '取得應用程式狀態' })
  @ApiResponse({ status: 200, description: '成功取得應用程式狀態' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '健康檢查' })
  @ApiResponse({ status: 200, description: '應用程式健康狀態' })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
