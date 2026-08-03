import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto';
import { UserPayload, JwtPayload } from './types/user-payload';

/**
 * Authentication Service
 * Handles user validation and JWT token generation
 * Demo implementation with hardcoded users (to be replaced with database in Ticket 11)
 */
@Injectable()
export class AuthService {
  /**
   * Demo users for MVP
   * NOTE: In Ticket 11 (User Management), this will be replaced with database lookup
   */
  private readonly demoUsers = [
    {
      id: 'user-1',
      email: 'admin@example.com',
      password: 'password123',
      fullName: 'Admin User',
    },
    {
      id: 'user-2',
      email: 'manager@example.com',
      password: 'password456',
      fullName: 'Manager User',
    },
    {
      id: 'user-3',
      email: 'viewer@example.com',
      password: 'password789',
      fullName: 'Viewer User',
    },
  ];

  constructor(private jwtService: JwtService) {}

  /**
   * Validate user credentials and return user data
   * @param email - User email
   * @param password - User password
   * @returns User data if valid
   * @throws UnauthorizedException if credentials are invalid
   */
  async validateUser(email: string, password: string) {
    const user = this.demoUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generate JWT token for authenticated user
   * @param user - User data to encode in token
   * @returns JWT token and expiration time
   */
  async generateToken(user: UserPayload) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      expiresIn: process.env.JWT_EXPIRATION || '7d',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  /**
   * Login user with email and password
   * @param loginDto - Login credentials
   * @returns JWT token response
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.generateToken(user);
  }
}
