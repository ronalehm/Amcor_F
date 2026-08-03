import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from '@api/guards/jwt-auth.guard';
import { CurrentUser } from '@api/decorators/current-user.decorator';
import { UserPayload } from './types/user-payload';

/**
 * Authentication Controller
 * Handles login and user endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint - returns JWT token
   * @param loginDto - Email and password
   * @returns AuthResponseDto with access token
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user profile - requires valid JWT
   * @param user - Current user from JWT payload
   * @returns Current user data
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  }
}
