import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new UnauthorizedException('No such user');
        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid password');
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }

    async loginWithGoogle(idToken: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
        if (!payload?.email || !payload?.name) {
          throw new UnauthorizedException('Google 인증 실패');
        }
    
        const user = await this.prisma.user.upsert({
          where: { email: payload.email },
          update: {},
          create: {
            email: payload.email,
            name: payload.name,
            password: null,
            profileImg: payload.picture || null,
          },
        });
    
        const token = this.jwtService.sign({
          sub: user.id,
          email: user.email,
        });
    
        return { access_token: token };
      }
}
