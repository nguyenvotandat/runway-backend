export class AuthEntity {
  id: string;
  email: string;
  password: string;
  name?: string | null; // Cho phép null
  createdAt: Date;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}

export class AuthResult {
  user: {
    id: string;
    email: string;
    name?: string | null; // Cho phép null
    createdAt: Date;
  };
  access_token: string;
  refresh_token: string;

  constructor(partial: Partial<AuthResult>) {
    Object.assign(this, partial);
  }
}