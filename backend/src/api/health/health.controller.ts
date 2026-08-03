import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@api/guards/jwt-auth.guard';
import { CurrentUser } from '@api/decorators/current-user.decorator';
import { UserPayload } from '@api/auth/types/user-payload';

@Controller('health')
export class HealthController {
  /**
   * Public health check endpoint
   */
  @Get('public')
  checkPublic() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      public: true,
    };
  }

  /**
   * Protected health check endpoint - requires valid JWT
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  check(@CurrentUser() user: UserPayload) {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      user,
    };
  }
}
