/**
 * DTO for authentication response
 */
export class AuthResponseDto {
  access_token!: string;
  expiresIn!: string;
  user!: {
    id: string;
    email: string;
    fullName: string;
  };
}
