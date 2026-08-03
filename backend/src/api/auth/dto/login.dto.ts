import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for login request
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
