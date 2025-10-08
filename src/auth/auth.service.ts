import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: { email: string; password: string }) {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
      });

      return { id: user.id, email: user.email };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          // ⚠️ Уникальное поле нарушено (email уже существует)
          throw new BadRequestException('Этот email уже зарегистрирован');
        }
      }
      // Всё остальное — дальше
      throw err;
    }
  }

  async signin(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Wrong email or passsword');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Wrong login or password');
    }

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });

    return { access_token: token };
  }
}
