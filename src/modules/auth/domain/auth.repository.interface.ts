import { AuthEntity } from './auth.entity';

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
}

export abstract class AuthRepositoryInterface {
  abstract create(data: CreateUserData): Promise<AuthEntity>;
  abstract findById(id: string): Promise<AuthEntity | null>;
  abstract findByEmail(email: string): Promise<AuthEntity | null>;
  abstract update(id: string, data: Partial<AuthEntity>): Promise<AuthEntity>;
  abstract delete(id: string): Promise<void>;
}
