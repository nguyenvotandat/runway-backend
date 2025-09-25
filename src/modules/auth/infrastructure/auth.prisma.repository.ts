import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { AuthRepositoryInterface, CreateUserData } from '../domain/auth.repository.interface';
import { AuthEntity } from '../domain/auth.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthPrismaRepository implements AuthRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<AuthEntity> {
    try {
      const user = await this.prisma.user.create({
        data: {
          id: randomUUID(),
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });

      return new AuthEntity(user);
    } catch (error) {
      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        throw new ConflictException('Email đã được sử dụng');
      }
      // Handle other database errors
      throw new InternalServerErrorException('Database error occurred');
    }
  }

  async findById(id: string): Promise<AuthEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? new AuthEntity(user) : null;
  }

  async findByEmail(email: string): Promise<AuthEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? new AuthEntity(user) : null;
  }

  async update(id: string, data: Partial<AuthEntity>): Promise<AuthEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return new AuthEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
