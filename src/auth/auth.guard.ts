import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { accessTokenSecret, AuthService } from './auth.service';
import { Service } from 'src/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(Service.AUTH)
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request, 'BEARER');


    
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: accessTokenSecret,
      });

      const userSession = await this.authService.getUserSession(+payload.userId, payload.sessionId);

      if (!userSession) {
        throw new UnauthorizedException();  
      }
      request.userSession = userSession;
    } catch(e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request, title: string): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type?.toUpperCase() === title ? token : undefined;
  }

}