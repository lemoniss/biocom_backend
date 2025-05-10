import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserDto) { 
    const hashedPassword = dto.password ? await hash(dto.password, 10) : null;

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        profileImg: dto.profileImg
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getAllUsers(userId: number) {
    return this.prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, name: true },
    });
  }
}
