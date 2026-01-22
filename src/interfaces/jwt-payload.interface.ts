import { Role } from '../users/roles/role.enum';

export interface JwtPayload {
  sub: string; // User ID (MongoDB ObjectId as string)
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}
