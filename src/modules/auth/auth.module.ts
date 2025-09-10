import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepositoryInterface } from './domain/auth.repository.interface';
import { AuthPrismaRepository } from './infrastructure/auth.prisma.repository';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    {
      provide: AuthRepositoryInterface,
      useClass: AuthPrismaRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
