/**
 * User payload interface for JWT tokens
 */
export interface UserPayload {
  id: string;
  email: string;
  fullName: string;
}

/**
 * JWT payload interface with standard claims
 */
export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  iat?: number;
  exp?: number;
}
