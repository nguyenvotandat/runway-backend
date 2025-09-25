import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthRepositoryInterface } from '../domain/auth.repository.interface';
import { AuthEntity, AuthResult } from '../domain/auth.entity';
import { LoginDto, RegisterDto } from '../presentation/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const { email, password, name } = registerDto;

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user (repository will handle duplicate email)
    const user = await this.authRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return new AuthResult({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return new AuthResult({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }

  async logout(userId: string): Promise<void> {
    // In a real application, you might want to blacklist the token
    // or implement a token revocation mechanism
    // For now, we'll just return void as the client will remove the token
    return;
  }

  async validateUser(userId: string): Promise<AuthEntity | null> {
    return this.authRepository.findById(userId);
  }

  private async generateTokens(user: AuthEntity): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload = { sub: user.id, email: user.email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
